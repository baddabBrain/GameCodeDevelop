

/*
 * @Description: 场景类型定义
 * @Author: chenguanhui
 * @Date: 2019-08-14 10:10:31
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-23 11:22:11
 */

import { SceneType } from "./Define";





 /**
  * 场景的配置信息
  */
 export class SceneDataInfo{


    /**
     * 场景类型
     */
    public sceneType : SceneType;

    /**
     * 场景名字， 加载场景的时候使用
     */
    public sceneName : string;
    
    /**
     * 进入场景前需要额外预加载的资源
     */
    public extraloadRes : Array<string> = [];


    /**
     * 
     * @param sceneType 场景类型
     * @param scenenPath 场景名字
     * @param extraLoadRes 进入场景前需要额外预加载的资源
     */
    constructor(sceneType : SceneType, scenenPath : string, extraLoadRes : Array<string> = []){
        this.sceneType = sceneType;
        this.sceneName = scenenPath;
        this.extraloadRes = extraLoadRes;
    }

    /**
     * 获取配置的场景信息
     * @param sceneType 
     */
    public static getSceneData(sceneType : SceneType) : SceneDataInfo{
        for (let i = 0; i < this._sceneDataList.length; ++i) {
            if (this._sceneDataList[i].sceneType == sceneType) {
                return this._sceneDataList[i];
            }
        }
        return null;
    }


    //  #region 注册场景数据
    private static _sceneDataList : Array<SceneDataInfo> = [
        new SceneDataInfo(SceneType.Bootstrap, "BootStrap"),
        new SceneDataInfo(SceneType.Game, "Game"),
    ];
    // #endregion
     
   
 }