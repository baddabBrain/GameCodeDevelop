import { LoadMgr } from './../Res/LoadMgr';
import { SceneType, SceneDataInfo } from './../../Define/SceneDef';
import { UIFacade } from '../UI/UIFacade';
import UIMgr from '../UI/UIMgr';
import { UIType } from '../../Define/UIDef';
import EventMgr from '../Event/EventMgr';
import { EventId } from '../../Define/EventId';
import { TAHelper } from '../Platforms/TAHelper';

/*
 * @Description: 场景管理器
 * @Author: chenguanhui
 * @Date: 2019-08-14 09:55:29
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-23 11:03:53
 */

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


interface iLaunchUIInfo {
    type: UIType,
    args: any,
}

@ccclass
export default class SceneMgr extends cc.Component {

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
    /** 切换场景后需要发送的事件 */
    private _launchEvents: Array<{ eventid: string, args: any }> = [];

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

        if (sceneData.extraloadRes && sceneData.extraloadRes.length > 0) {
            this._loadExtraRes(sceneData);
        } else {
            this._doLoadScene(sceneData);
        }
    }

    /**
     * 加载场景额外资源
     * @param sceneData 
     */
    private _loadExtraRes(sceneData: SceneDataInfo, _retryTime: number = 3): void {

        let resArray: Array<string> = sceneData.extraloadRes;
        if (resArray && resArray.length > 0) {
            UIMgr.inst.open(UIType.Loading);
            LoadMgr.loadResourceArray(resArray, (completeCount: number, totalCount: number, item: any) => {
                // UIFacade.showLoading(`加载中${completeCount}/${totalCount}`);
                EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_PROGRESS, completeCount, totalCount)
            }, (error: Error, resources: Array<any>) => {
                if (!error) {
                    // 开始加载场景
                    this._doLoadScene(sceneData, _retryTime);
                } else {
                    cc.error("load scene extra res fail!");
                }
            })
        }
    }


    /**
     * 开始预加载场景
     * @param sceneData 
     */
    private _doLoadScene(sceneData: SceneDataInfo, _retryTime: number = 3): void {
        let self = this;
 
        if (this._currentSceneType != SceneType.NONE) {
            UIMgr.inst.open(UIType.Loading);
        }
        let startTime:number = new Date().getTime();
        cc.director.preloadScene(sceneData.sceneName, (completedCount, totalCount, item) => {
            if (completedCount == 0 && totalCount == 0) {
                completedCount = 100;
                totalCount = 100;
            }
            EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_PROGRESS, completedCount, totalCount)
        }, (err: Error, sceneRes: cc.SceneAsset) => {
            if (!err) {
                let endTime:number = new Date().getTime();
                // 记录场景预加载时间
                TAHelper.reportEvent(`PreloadScene-${sceneData.sceneName}`, {startTime:startTime, endTime:endTime, delta:endTime - startTime});
                cc.director.loadScene(sceneData.sceneName, (err) => {

                    if (err) {
                        cc.error('场景切换失败', err);
                        return;
                    }
                    let finishedLoad:number = new Date().getTime();
                    // 记录加载时间
                    TAHelper.reportEvent(`LoadScene-${sceneData.sceneName}`, {startTime:endTime, endTime:finishedLoad, delta:finishedLoad - endTime});
                    UIMgr.inst.close(UIType.Loading);

                    self._loadSceneEnd();
                });



            } else {

                cc.error('场景加载失败', err);

                if (_retryTime >= 0) {
                    EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, `网络似乎不太好`)
                    // 1秒后重新加载
                    setTimeout(() => {
                        this._loadScene(sceneData.sceneType, _retryTime - 1);
                    }, 1000);
                }
                else {
                    _retryTime = 3;
                    setTimeout(async () => {
                        UIMgr.inst.close(UIType.Loading);

                        // let _r = await UIFacade.showConfirm("请检查网络后重试", `场景加载失败`, {
                        //     confirmText: '重试',
                        //     cancelText: '返回'
                        // });

                        let _r = await UIFacade.showConfirm("请检查网络后重试", '重试', '返回');

                        if (_r) {
                            this._loadScene(sceneData.sceneType, _retryTime - 1);
                        }
                        else {
                            // TODO
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
     * 压入一个事件用于切换场景后自动发送
     * @param eventid 
     */
    public pushReviveEvent(eventid: string, args: any): void {
        this._launchEvents.push({ eventid, args });
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

        for (let i: number = 0; i < this._launchEvents.length; i++) {
            EventMgr.inst.emit(this._launchEvents[i].eventid, this._launchEvents[i].args);
        }
        this._launchEvents = [];
    }
}

// 导出方便使用
export let SCENE: SceneMgr = SceneMgr.inst;