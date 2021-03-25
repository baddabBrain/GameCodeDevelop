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

    /** 二次确认界面 */
    Confirm,

    /** 分享引导 */
    ShareGuide,

    /** 测试账号登录 */
    TestAccountLogin,

    /** 加载 */
    Loading,

    /** 设置界面 */
    Setting,

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

    /** 构造函数 */
    constructor(uiType: UIType, uiPath: string, ) {
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
    //  定义一个UIDataInfo 数组
    //  构造时传入UI类型和具体的UI路径
    private static _uiDataList: Array<UIDataInfo> = [
        new UIDataInfo(UIType.TestAccountLogin, "AccountLogin"),
        new UIDataInfo(UIType.Loading, "Loading"),
        new UIDataInfo(UIType.ShareGuide, "ShareGuide"),
        new UIDataInfo(UIType.Setting, "Setting"),
        new UIDataInfo(UIType.Confirm, "common/confirm")
    ]
    //  #region
}