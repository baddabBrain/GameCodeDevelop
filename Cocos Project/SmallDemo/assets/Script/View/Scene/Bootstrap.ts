import SceneBase from "../../Framework/Scene/SceneBase";
import { SceneType } from "../../Define/Define";
import { ResUtil } from "../../Framework/Res/ResUtil";
import { FlyTxtPool } from "../../Framework/UI/FlyTxtPool";
import { TABLE } from "../../Controller/TableMgr";
import SceneMgr from "../../Framework/Scene/SceneMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BootStrap extends SceneBase {


    @property(cc.Prefab)
    uiRoot : cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    async onLoad() {
        
         
    }

    async start() {

        // 框架初始化
        await this.initFramework();

        // 切换到游戏场景
        SceneMgr.inst.loadScene(SceneType.Game);
    }

    async initFramework() {
        // 创建UIRoot
        let uiRoot : cc.Node = ResUtil.instantiate(this.uiRoot);
        cc.director.getScene().addChild(uiRoot);

        // 设置UIRoot 常驻内存
        cc.game.addPersistRootNode(uiRoot);
 
      //  FlyTxtPool.init();

        // 加载表格
        await TABLE.loadTableRes();
    }

}
