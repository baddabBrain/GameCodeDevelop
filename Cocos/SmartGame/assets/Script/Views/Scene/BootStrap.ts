import UIMgr from "../../Framework/UI/UIMgr";
import { UIType } from "../../Define/UIDef";
import UIBase from "../../Framework/UIBase";
import SceneMgr from "../../Framework/Scene/SceneMgr";
import { SceneType, SceneDataInfo } from "../../Define/SceneDef";
import SceneBase from "../../Framework/Scene/SceneBase";
import AudioSourceMgr from "../../Framework/Audio/AudioSoureMgr";
import { TAHelper } from "../../Framework/Platforms/TAHelper";
import EventMgr, { eventMgr } from "../../Framework/Event/EventMgr";
import { EventId } from "../../Define/EventId";
import { Platform, PlatformType } from "../../Framework/Platforms/Platform";
import TableMgr from "../../Controller/TableMgr";
import { PlayerModel } from "../../Model/PlayerModel";
import Utils from "../../Framework/Utils/Utils";
import { iloginRetInfo } from "../../Network/NetApi";
import MoxiModel from "../../Model/MoxiModel";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BootStrap extends SceneBase {


  private _tipStr: string = "";
  private _loadEnd: boolean = false;
  private _changeScene: boolean = false;
  onLoad() {
    UIMgr.inst.open(UIType.Loading);
  }

  async start() {

    this._tipStr = "初始化音频...";
    AudioSourceMgr.inst.init();

    this._tipStr = "初始化数据统计...";
    TAHelper.init();

    let sceneData: SceneDataInfo = SceneDataInfo.getSceneData(SceneType.MainScene);
    cc.director.preloadScene(sceneData.sceneName, (completedCount, totalCount, item) => {
      if (this._changeScene) {
        EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_PROGRESS, completedCount, totalCount);
      }
    });


    EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "初始化平台...");
    await Platform.init();
    Platform.login();

    this._tipStr = "加载配置文件....";
    await TableMgr.inst.loadTableRes();

    this._loadEnd = true;
    // SceneMgr.inst.loadScene(SceneType.MainScene);
  }


  private async onLoginRet(data: iloginRetInfo) {

    EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, this._tipStr);
    EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "获取玩家数据成功！");

    // 初始化服务器时间
    Utils.initServerTime(data.localTime);
    // 上报登录事件
    let loginType: number = 1;
    if (Platform.getEnterParam("inviterId")) {
      loginType = 2;
    }
    TAHelper.reportEvent("login", { loginType: loginType });
    TAHelper.reportLogin(data.role.gameId);

    // 点消淘宝平台记录活动id
    let platType: PlatformType = Platform.getPlatType();
    if (platType == PlatformType.TaoBao) {
      let authInfo: any = MoxiModel.inst.getAuthInfo();
      if (authInfo) {
        TAHelper.userSetOnce({ 'activityId': authInfo.activeId });
      }
    }



    this.schedule(() => {
      if (this._loadEnd) {
        this._changeScene = true;

        //初始化用户数据
        PlayerModel.inst.initPlayerData(data);

        // 切换到主场景
        EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "加载主场景资源...");
        SceneMgr.inst.loadScene(SceneType.MainScene);
        this.unscheduleAllCallbacks();
        return;
      }

      EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, this._tipStr);
    });
  }


  onEnable() {
    EventMgr.inst.on(EventId.ON_LOGIN_RET, this.onLoginRet, this);
  }

  onDisable() {
    EventMgr.inst.off(EventId.ON_LOGIN_RET, this.onLoginRet, this);
  }

}
