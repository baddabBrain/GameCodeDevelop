/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-13 13:54:36
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-23 10:17:48
 */

/**
* 层级管理
*/
export enum LayerType {

    /**
     * GUI层
     */
    GUI,

    /**
     * 弹出
     */
    Pop,

    /**
     * 提示
     */
    Tip,

    /**
     * 最顶层
     */
    Top
}


/**
 * UI类型定义
 */
export enum UIType {

    $Start,

    /**
     * 二次确认界面
     */
    Confirm,

    /**
     * 测试账号登录
     */
    TestAccountLogin,

    /**
     * 加载
     */
    Loading,

    /**
     * 游戏结束
     */
    GameOver,

    /**
     * 设置界面
     */
    Setting,

    /**
     * 排行榜
     */
    Rank,

    /**
     * 任务切页面板
     */
    TabTask,

    /**
     * 主页切页面板
     */
    TabMain,

    /**
     * 关卡切页面板
     */
    TabLevel,

    /**
     * 组队切页面板
     */
    TabTeam,

    $End
}


export class UIDataInfo {

    /**
     * 界面类型 
     */
    public uiType: UIType;

    /**
     * 资源路径
     */
    public uiPath: string;

    /** 屏蔽点击 */
    public preventTouch: boolean = true;

    constructor(uiType: UIType, uiPath: string,) {
        this.uiType = uiType;
        this.uiPath = uiPath;
    }

    /**
     * 获取完整资源 
     */
    public get fullPath(): string {
        var localPath: string = "UIPrefab/";
        return localPath + this.uiPath;
    }

    /**
     * 获取UI的配置信息
     * @param uiType 
     */
    public static getUIData(uiType: UIType): UIDataInfo {
        for (let i = 0; i < this._uiDataList.length; ++i) {
            if (this._uiDataList[i].uiType == uiType) {
                return this._uiDataList[i];
            }
        }
      
        return null;
    }

    //  #region注册UI界面数据
    private static _uiDataList: Array<UIDataInfo> = [
     
        new UIDataInfo(UIType.Loading, "panel/loadingPanel"),   
        new UIDataInfo(UIType.TabLevel, "tabPage/TasktestPrefab"),
        new UIDataInfo(UIType.TabMain, "tabPage/MaintestPrefab"),  
        new UIDataInfo(UIType.TabLevel, "tabPage/LeveltestPrefab"),  
        new UIDataInfo(UIType.TabTeam, "tabPage/TeamtestPrefab"),  

        // new UIDataInfo(UIType.GameOver, "JnGameOver"),
        // new UIDataInfo(UIType.Setting, "Setting"),
        // new UIDataInfo(UIType.Confirm, "common/confirm"),
        // new UIDataInfo(UIType.Rank, "Ranking/Ranking"),
    ]
    //  #region
}