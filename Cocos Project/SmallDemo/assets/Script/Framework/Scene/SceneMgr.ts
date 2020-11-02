import { UIFacade } from '../UI/UIFacade';
import UIMgr from '../UI/UIMgr';
import { UIType } from '../../Define/UIDefs';
import { EventId } from '../../Define/EventId';
import { SceneType } from '../../Define/Define';
import { SceneDataInfo } from '../../Define/SceneDef';
import { EVENT } from '../Event/EventMgr';


interface iLaunchUIInfo {
    type: UIType,
    args: any,
}

export default class SceneMgr {

    private static _inst: SceneMgr;
    public static get inst(): SceneMgr {
        if (!this._inst) {
            this._inst = new SceneMgr();
        }
        return this._inst;
    }


    /**
     * 上一个场景名
     */
    private _lastSceneType: SceneType = SceneType.NONE;


    /**
     * 当前场景类型
     */
    private _currentSceneType: SceneType = SceneType.NONE;


    /**
     * 加载中的场景类型
     */
    private _loadingSceneType: SceneType = SceneType.NONE;

    /**
     * 场景打开参数
     */
    private _sceneParams: Object;

    /** 切换场景后需要打开的UI */
    private _launchUIs: Array<iLaunchUIInfo> = [];

    /**
     * 获取上一个场景类型
     */
    public getLastScene(): SceneType {
        return this._lastSceneType;
    }

    /**
     * 获取当前的场景类型
     */
    public getCurrentScene(): SceneType {
        return this._currentSceneType;
    }

    public get sceneParams(): Object {
        return this._sceneParams;
    }


    /**
     * 预加载场景
     * @param sceneType  
     * @param onLoaded 
     */
    public loadScene(sceneType: SceneType, params: Object = {}): void {
        if (this._loadingSceneType == sceneType) {
            cc.error(`Scene: ${SceneType[sceneType]}, is current being loading!`);
            return;
        }

        if (this._currentSceneType == sceneType) {
            cc.error(`Scene: ${SceneType[sceneType]}, is already loaded!`);
            return;
        }

        this._sceneParams = params;

        this._loadScene(sceneType);
    }


    /**
     * 加载场景
     * @param sceneType 
     * @param LoadErr 
     * @param onLoaded 
     */
    private _loadScene(sceneType: SceneType, _retryTime: number = 3): void {
        this._loadingSceneType = sceneType;

        let sceneData: SceneDataInfo = SceneDataInfo.getSceneData(sceneType);
        if (!sceneData) {
            cc.error("Scene not registerd, load scene faild!");
            return;
        }


        this._doLoadScene(sceneData);
    }

    /**
     * 开始预加载场景
     * @param sceneData 
     */
    private _doLoadScene(sceneData: SceneDataInfo, _retryTime: number = 3): void {
        let self = this;
        UIMgr.inst.open(UIType.Loading);

        cc.director.preloadScene(sceneData.sceneName, (completedCount, totalCount, item) => {
            EVENT.emit(EventId.ON_UPDATE_LOADING_PROGRESS, completedCount, totalCount)
        }, (err: Error, sceneRes: cc.SceneAsset) => {
            if (!err) {

                cc.director.loadScene(sceneData.sceneName, (err) => {

                    if (err) {
                        cc.error('场景切换失败', err);
                        return;
                    }

                    UIMgr.inst.close(UIType.Loading);

                    self._loadSceneEnd();
                });



            } else {

                cc.error('场景加载失败', err);

                if (_retryTime >= 0) {
                    EVENT.emit(EventId.ON_UPDATE_LOADING_TTP, `网络似乎不太好`)
                    // 1秒后重新加载
                    setTimeout(() => {
                        this._loadScene(sceneData.sceneType, _retryTime - 1);
                    }, 1000);
                }
                else {
                    _retryTime = 3;
                    setTimeout(async () => {
                        UIMgr.inst.close(UIType.Loading);

                        let _r = await UIFacade.showConfirm("请检查网络后重试", '重试', '返回');

                        if (_r) {
                            this._loadScene(sceneData.sceneType, _retryTime - 1);
                        }
                        else {
                            cc.error("用户选择退出游戏");
                        }

                    }, 1000);
                }
            }
        });
    }

    /**
     * 场景加载完成
     */
    private _loadSceneEnd() {
        this._lastSceneType = this._currentSceneType;
        this._currentSceneType = this._loadingSceneType;
        this._loadingSceneType = SceneType.NONE;

        // 恢复界面
        this.reviveWnd();
    }


    /**
    * 压入一个界面用于切换场景后自动打开
    * @param wndType 
    * @param arg 
    */
    public pushReviveWnd(wndType: UIType, ...args): void {
        this._launchUIs.push({ type: wndType, args: args });
    }

    /**
     * 切换场景后恢复界面
     */
    private reviveWnd(): void {
        for (let i: number = 0; i < this._launchUIs.length; ++i) {
            let info: iLaunchUIInfo = this._launchUIs[i];
            UIMgr.inst.open(info.type, ...info.args);
        }
        this._launchUIs = [];
    }



}