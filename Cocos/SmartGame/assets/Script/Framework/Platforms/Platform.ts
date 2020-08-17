import { UIFacade } from "../UI/UIFacade";
import UIMgr from "../UI/UIMgr";
import { UIType } from "../../Define/UIDef";
import EventMgr from "../Event/EventMgr";
import { EventId } from "../../Define/EventId";
import { NetApi, iloginRetInfo, iRankList } from "../../Network/NetApi";
import { Net } from "../../Network/Net";
import { LoadMgr } from "../Res/LoadMgr";
import { MoxiHelper } from "./MoxiHelper";
import MoxiModel from "../../Model/MoxiModel";
//import TableMgr from "../../Controller/TableMgr";
import { Goose } from "./Goose";
import { PlayerModel } from "../../Model/PlayerModel";

export enum PlatformType {
    None,
    WeiXin,
    TaoBao,
}

export interface MConfig {
    productionUrl: string;
    approveUrl: string;
    developmentUrl: string;
    version: number;
}

export class Platform {

    /** 平台类型 */
    private static _type: PlatformType = PlatformType.None;

    /** 服务器地址 */
    private static _serverUrl: string = "";


    /**
     * 初始化
     *
     * @static
     * @memberof Platform
     */
    public static async init() {

        if (window['wx']) {
            this._type = PlatformType.WeiXin;

            // 设置平台类型
         //   TableMgr.inst.setChannel("weixin");

            // 加载服务器的配置
            EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "获取版本信息...");
            if (window['pub_ver']) {
                // 正式版
                await this.loadRemoteConfig();
            } else {
                // 测试版
                await this.loadLoaclConfig();
            }

            // 微信平台初始化
           // await WxPlatform.initWeiXin();
        } else if (window['MoxiAct']) {
            this._type = PlatformType.TaoBao;

            //初始化moxiSDK
            let res = await MoxiHelper.init();
            if (res) {
                cc.log(res)
                MoxiModel.inst.initData(res);
                //  MoxiHelper.goShare("", 'https://game-cdn.moxigame.cn/ClickEliminate/upload/share/1.png', false);
            }

            // 设置平台类型
          //  TableMgr.inst.setChannel("taobao");


            // 处理前后台切换问题
            cc.game.on(cc.game.EVENT_HIDE, function () {
                cc.log("====> on hide <=====");
                cc.director.getScene().pauseAllActions();
            });

            cc.game.on(cc.game.EVENT_SHOW, function () {
                cc.log("====> on show <=====");
                cc.director.getScene().resumeAllActions();
            })

            // 使用平台传递的服务器地址
            this._serverUrl = res.serverUrl;
        } else {
            this._type = PlatformType.None;
            // 测试版
            this._serverUrl = "sandbox.platform.moxigame.cn/inside/clickeliminate/";
            // this._serverUrl = '10.0.0.131:11090';
        }


        // 初始化Goose SDK
        if (CC_BUILD) {
            Goose.init();
        }
    }

    /**
     * 加载本地配置文件
     *
     * @private
     * @static
     * @memberof Platform
     */
    private static async loadLoaclConfig() {
        // 测试版
        await new Promise<any>((rs, rj) => {
            LoadMgr.loadJSON("config", (err, jsonAsset) => {
                if (!err) {
                    let config: MConfig = jsonAsset.json;
                    this._serverUrl = config.developmentUrl;
                    rs(true);
                } else {
                    cc.error("load config fail!");
                    UIFacade.showToast("加载配置文件失败！");
                    rj(false);
                }
            });
        })
    }

    /**
     * 加载远程配置
     *
     * @private
     * @static
     * @memberof Platform
     */
    private static async loadRemoteConfig() {
        await new Promise<any>((rs, rj) => {
            let remoteUrl: string = "https://game-cdn.moxigame.cn/ClickEliminate/config/config.json?v=" + Date.now();
            cc.loader.load(remoteUrl, (err, jsonAsset) => {
                if (!err) {
                    let config: MConfig = jsonAsset;
                    if (window['pub_ver'] > config.version) {
                        // 体验版   
                        this._serverUrl = config.approveUrl;
                    } else {
                        // 正式版本
                        this._serverUrl = config.productionUrl;
                    }
                    EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "获取版本信息成功！");
                    rs(true);
                } else {
                    cc.error("load config fail!");
                    EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "获取版本信息失败！");
                    UIFacade.showToast("加载配置文件失败！");
                    rj(false)
                }
            });
        });

    }

    /**
     * 分享
     *
     * @static
     * @param {string} title 转发标题，不传则默认使用当前小游戏的昵称。
     * @param {string} imageUrl 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4
     * @param {*} [query] 查询字符串，从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。	
     * @param {*} string
     * @memberof Platform
     */
    public static share(title: string, imageUrl: string, query?: string): void {

        switch (this._type) {
            case PlatformType.WeiXin:
             //   WxPlatform.sdk.shareAppMessage({ title: title, imageUrl: imageUrl, query: query });
                break;
            case PlatformType.TaoBao: {
                MoxiHelper.goShare(title, imageUrl, true);
            }
                break;
            default: {
                UIFacade.showToast('不支持分享的平台！');
            }
                break;
        }

    }


    /**
     * 获取进入参数
     * @param {string} name 参数名
     */
    public static getEnterParam(name: string) {

        switch (this._type) {
            case PlatformType.WeiXin: {
              //  let obj = WxPlatform.sdk.getLaunchOptionsSync();
            //   if (obj && obj.query) {
              //      return obj.query[name];
             //   }
            }
                break;

            case PlatformType.TaoBao: {
                if (name == "inviterId") {
                    return MoxiModel.inst.getInviterId();
                }
            }
                break;
            default: {
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
                    r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return decodeURIComponent(r[2]);
                }
            }
                break;
        }

        return undefined;
    }

    /**
     * 获取平台类型
     *
     * @static
     * @returns {PlatformType}
     * @memberof Platform
     */
    public static getPlatType(): PlatformType {
        return this._type;
    }

    /**
     * 登录
     *
     * @static
     * @returns
     * @memberof Platform
     */
    public static async login() {
        switch (this._type) {
            case PlatformType.WeiXin:
               // await WxPlatform.wxlogin();
                break;
            case PlatformType.TaoBao:
                await this.taobaologin();
                break;
            default:
                // 打开测试账号输入界面
                UIMgr.inst.open(UIType.TestAccountLogin);
                break;
        }
    }


    public static getServerAddr(): string {
        return this._serverUrl;
    }

    /**
     * 淘宝登录
     *
     * @private
     * @static
     * @memberof Platform
     */
    private static async taobaologin() {
        await Net.loginCheck(MoxiModel.inst.getAuthInfo(), Platform.getEnterParam("inviterId")).then((data: iloginRetInfo) => {
            EventMgr.inst.emit(EventId.ON_LOGIN_RET, data);
        }).catch(() => {
            cc.log(MoxiModel.inst.getAuthInfo())
            UIFacade.showToast('登录失败');
        })
    }


    /**
     * 显示平台排行榜
     *
     * @static
     * @memberof Platform
     */
    public static showPlatformRank(wordRank: iRankList): void {
        switch (this._type) {
            case PlatformType.WeiXin:
                // WxPlatform.sdk.getOpenDataContext().postMessage({
                //     cmd: "ranklist",
                //     wordRank: wordRank,
                //     gameId: PlayerModel.inst.getGameId(),
                // })
                // console.log("rankList..")
                // console.log(wordRank)
                break;
        }
    }

    /**
     * 向微信服务器上传新的过关数
     * @param level 
     */
    public static updateScore(level: string): void {
        switch (this._type) {
            case PlatformType.WeiXin: {
                // WxPlatform.sdk.getOpenDataContext().postMessage({
                //     cmd: "set",
                //     score: level,
                // })
            }
        }
    }


    /**
     * 初始化微信开放数据域
     *
     * @static
     * @param {string} openId
     * @memberof Platform
    //  */
    // public static postWxInit(openId: string): void {
    //     switch (this._type) {
    //         case PlatformType.WeiXin: {
    //             let openDataContext = WxPlatform.sdk.getOpenDataContext();
    //             openDataContext.postMessage({
    //                 cmd: "init",
    //                 openId: openId
    //             });

    //             let shareCanvas = openDataContext.canvas;
    //             if (shareCanvas) {
    //                 // shareCanvas.width = cc.winSize.width;
    //                 shareCanvas.height = cc.winSize.height;
    //                 console.debug("sharecanvas : width:" + shareCanvas.width + ", height:" + shareCanvas.height);
    //             }
    //         }
    //             break;
    //     }

    // }

    // /**
    // * 微信复制到剪切板
    // */
    // public static wxClipData(str: string): boolean {
    //     let success = false;
    //     WxPlatform.sdk.setClipboardData({
    //         data: str,
    //         success(res) {
    //             success = true;
    //         }
    //     })
    //     return success
    // }

    // public static showWxFriendsRank(): void {
    //     switch (this._type) {
    //         case PlatformType.WeiXin:
    //             WxPlatform.sdk.getOpenDataContext().postMessage({
    //                 cmd: "friendsList",
    //             })
    //             break;
    //     }
    // }

    // public static showWxWorldRank(): void {
    //     switch (this._type) {
    //         case PlatformType.WeiXin:
    //             WxPlatform.sdk.getOpenDataContext().postMessage({
    //                 cmd: "worldList",
    //             })
    //             break;
    //     }
    // }

    // /**
    //  * 微信发送一次性订阅消息
    //  */
    // public static wxRequestSubscribeMessage(): void {
    //     let fullstrengthId: string = "feodUyipwuPxtcHOXtWMM8oA2iJ4BraWtj79CEsp17A";
    //     let getStrengthRewardId: string = "3sgvvoMaQFGhYdvPaVkPRHb-fNa-oV_rFC3s0VHPNnM";
    //     // console.log(this._wxSubscriptSetting);
    //     // if (this._wxSubscriptSetting.itemSettings && this._wxSubscriptSetting.itemSettings[strengthId] == 'accept') {
    //     //     console.log("已经订阅了");
    //     //     return;
    //     // }

    //     let tmplIds: Array<string> = [fullstrengthId, getStrengthRewardId];
    //     WxPlatform.sdk.requestSubscribeMessage({
    //         tmplIds: tmplIds,
    //         success: (res) => {
    //             // console.log(res[fullstrengthId], res[getStrengthRewardId]);
    //             if (res[fullstrengthId] == 'accept' || res[getStrengthRewardId] == 'accept') {
    //                 cc.log("客户端订阅成功！");
    //                 Net.sendSubscribeMessage(tmplIds).then(() => {
    //                     cc.log("服务器订阅成功！");
    //                 }).catch(() => {
    //                     cc.error("服务器订阅失败！")
    //                 });
    //             }
    //         },
    //         fail: (res) => {
    //             console.log(res);
    //             UIFacade.showToast("订阅失败");
    //         }
    //     })
    // }


    // /**
    //  * 微信刷新授权信息
    //  */
    // public static wxUpdateSubScript(): void {
    //     WxPlatForm.sdk.getSetting({
    //         withSubscriptions: true,
    //         success: (res) => {
    //             this._wxSubscriptSetting = res.subscriptionsSetting;
    //         }
    //     })
    // }


    // public static showVideoAd(adType: wxInspireAdType, onCompleteHandler: Function, onCloseHandler: Function): void {
    //     switch (this._type) {
    //         case PlatformType.WeiXin:
    //             WxPlatform.showRewardVideoAd(adType, onCompleteHandler, onCloseHandler);
    //             break;
    //     }
    // }



    // /**
    //  * 显示推荐组件
    //  */
    // public static showGamePortal(): void {

    //     switch (this._type) {
    //         case PlatformType.WeiXin:
    //             WxPlatform.showWXGamePortal();
    //             break;
    //     }
    // }

    // /**
    //  * 打开客服会话
    //  */
    // public static openCSC(): void {
    //     switch (this._type) {
    //         case PlatformType.WeiXin:
    //             WxPlatform.openCSC();
    //             break;
    //         case PlatformType.TaoBao: {
    //             MoxiHelper.ProblemFeedBack();
    //         }
    //             break;
    //         default: {
    //             UIFacade.showToast("敬请期待");
    //         }
    //             break;
    //     }
    // }

}