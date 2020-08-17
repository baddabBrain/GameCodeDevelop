// import { TAHelper } from "./TAHelper";
// import EventMgr, { eventMgr } from "../Event/EventMgr";
// import { EventId } from "../../Define/EventId";
// import { UIFacade } from "../UI/UIFacade";
// import { Net } from "../../Network/Net";
// import { Platform } from "./Platform";
// import { iloginRetInfo, iRankList } from "../../Network/NetApi";
// import TableMgr from "../../Controller/TableMgr";
// import { SeResShare } from "../../Table/interface";
// import { UIType } from "../../Define/UIDef";
// import RankModel from "../../Model/RankModel";


// export enum wxBannerAdType {
//     gameover,
//     setting,
//     lessPill,
// }

// export enum wxInspireAdType {
//     lessStrength,
//     lessPill,
//     lessItem,
// }

// export class WxPlatform {

//     /** 激励广告id */
//     private static _adId: Array<string> = ['adunit-546aa1f679192dd6', 'adunit-45d4b2095156a28a', 'adunit-c446b1099651c9db'];
//     /** banner广告id */
//     private static _bannerAdId: Array<string> = ['adunit-75d41c55221910df', 'adunit-d8e84d389b106d2d', 'adunit-e9f84d6cb4817dce'];
//     /** 广告看完回调 */
//     private static _onCompleteHandler: Function;
//     /**  广告没看完回调*/
//     private static _onCloseHandler: Function;
//     /** 微信小游戏推荐组件 */
//     public static portalAd: any = null;

//     /** 打开小游戏的自定义参数 */
//     private static _channel: any = null;

//     private static _sdk: any = {};

//     public static get sdk(): any {
//         return WxPlatform._sdk;
//     }

//     public static set sdk(value: any) {
//         WxPlatform._sdk = value;
//     }

//     /** 激励广告组件 */
//     private static _LessPillAd: any = null;
//     private static _LessStrengthAd: any = null;
//     private static _LessItemAd: any = null;
//     /** banner广告组件 */
//     private static _allBannerAd: Array<any> = [];

//     /**
//      *  显示激励视频广告
//      *  onCompleteHandler  完成回调 可以给奖励
//      *  onCloseHandler  失败回调 不可以给奖励
//      */
//     public static showRewardVideoAd(adType: wxInspireAdType, onCompleteHandler: Function, onCloseHandler: Function) {
//         this._onCompleteHandler = onCompleteHandler;
//         this._onCloseHandler = onCloseHandler;
//         switch (adType) {
//             case wxInspireAdType.lessPill: {
//                 cc.log(this._adId[adType]);
//                 this._LessPillAd.show().catch(err => {
//                     UIFacade.showToast("视频正在准备中");
//                     this._LessPillAd.load().then(() => this._LessPillAd.show());
//                 });
//             }
//                 break;
//             case wxInspireAdType.lessStrength: {
//                 cc.log(this._adId[adType]);
//                 this._LessStrengthAd.show().catch(err => {
//                     UIFacade.showToast("视频正在准备中");
//                     this._LessStrengthAd.load().then(() => this._LessStrengthAd.show());
//                 });
//             }
//                 break;
//             case wxInspireAdType.lessItem: {
//                 cc.log(this._adId[adType]);
//                 this._LessItemAd.show().catch(err => {
//                     UIFacade.showToast("视频正在准备中");
//                     this._LessItemAd.load().then(() => this._LessItemAd.show());
//                 });
//             }
//                 break;
//         }

//     }

//     /**关闭广告回调 */
//     private static _onCloseVideoAd(res): void {
//         // 用户点击了【关闭广告】按钮
//         // 小于 2.1.0 的基础库版本，res 是一个 undefined
//         cc.log("关闭广告");
//         if (res && res.isEnded || res === undefined) {
//             // 正常播放结束，可以下发游戏奖励
//             this._onCompleteHandler && this._onCompleteHandler();
//         }
//         else {
//             // 播放中途退出，不下发游戏奖励
//             this._onCloseHandler && this._onCloseHandler();
//         }
//         this._onCompleteHandler = null;
//         this._onCloseHandler = null;
//     }

//     private static _onClose


//     /**
//     * 微信平台初始化
//     *
//     * @static
//     * @memberof Platform
//     */
//     public static async initWeiXin() {

//         this._sdk = window['wx'];

//         // 开启右上角分享按钮
//         this._sdk.showShareMenu()

//         // 被动转发
//         this._sdk.onShareAppMessage(() => {

//             let shareInfo: SeResShare = TableMgr.inst.getShareInfoById("S001");
//             TAHelper.reportEvent("share", { url: shareInfo.sUrl, type: shareInfo.ePos });

//             // 用户点击了“转发”按钮
//             return {
//                 title: shareInfo.sWriting,
//                 imageUrl: shareInfo.sUrl
//             }
//         }
//         )

//         // 检查版本更新
//         if (this._sdk.getUpdateManager) {
//             let updateManager = this._sdk.getUpdateManager();
//             updateManager.onUpdateReady(async () => {

//                 window['wx'].showModal({
//                     title: '新版本已经准备好，即将切换到新版~',
//                     content: '版本升级',
//                     showCancel: false,
//                     confirmText: '确定',
//                     success: () => {
//                         updateManager.applyUpdate()
//                     },
//                     fail: (err) => {

//                     }
//                 });

//             })
//         }

//         // 清除缓存目录下目前应用中未使用到的缓存资源
//         let wxDownloader = window['wxDownloader'];
//         // if (wxDownloader) {
//         //     await new Promise<any>((rs, rj) => {
//         //         wxDownloader.cleanOldCaches((err, newAsset) => {
//         //             rs(true);
//         //         });
//         //     })

//         // } else {
//         //     cc.error("wxDownloader not found!");
//         // }


//         this._sdk.onShow(this.onWXShow);
//         this._sdk.onHide(this.onWXHide);

//         this._LessPillAd = this._sdk.createRewardedVideoAd({ adUnitId: this._adId[wxInspireAdType.lessPill] })

//         this._LessPillAd.onError(err => {
//             UIFacade.showToast("视频正在准备中");
//             console.log(err);
//         })

//         this._LessPillAd.onClose(this._onCloseVideoAd.bind(this));

//         this._LessStrengthAd = this._sdk.createRewardedVideoAd({ adUnitId: this._adId[wxInspireAdType.lessStrength] })

//         this._LessStrengthAd.onError(err => {
//             UIFacade.showToast("视频正在准备中");
//             console.log(err);
//         })

//         this._LessStrengthAd.onClose(this._onCloseVideoAd.bind(this));


//         this._LessItemAd = this._sdk.createRewardedVideoAd({ adUnitId: this._adId[wxInspireAdType.lessItem] })

//         this._LessItemAd.onError(err => {
//             UIFacade.showToast("视频正在准备中");
//             console.log(err);
//         })

//         this._LessItemAd.onClose(this._onCloseVideoAd.bind(this));



//         //小游戏推荐组件实例化
//         this._createNewGamePortal();

//         //banner广告组件实例化
//         // this.initBannerAd();
//     }

//     /**
//      * 实例化推荐组件
//      */
//     private static _createNewGamePortal(): void {
//         if (this._sdk.createGamePortal) {
//             if (this.portalAd == null) {
//                 this.portalAd = WxPlatform.sdk.createGamePortal({
//                     adUnitId: 'PBgAAJLc_gkCr3HE'
//                 })
//             }
//         }
//     }

//     /**
//     * 显示推荐组件
//     */
//     public static showWXGamePortal(): void {
//         if (this.portalAd) {
//             this.portalAd.show().catch(err => {
//                 cc.log("先load")
//                 this.portalAd.load().then(() => { this.portalAd.show() })
//             })

//             // this.portalAd.load().then(() => {
//             //     this.portalAd.show();
//             // }).catch((err) => {
//             //     console.error(err);
//             // })
//         }

//     }

//     /**
//      * 初始化banner广告组件
//      */
//     public static initBannerAd(): void {
//         for (let i = 0; i < this._bannerAdId.length; i++) {
//             this.createNewBannerAd(i, new cc.Vec2(0, 0));
//         }
//     }


//     /**
//      * 根据id实例化一个banner广告
//      * @param id 
//      */
//     public static createNewBannerAd(id: wxBannerAdType, wordPos: cc.Vec2): void {

//         let bannerID: string = this._bannerAdId[id];


//         let systemInfo = this._sdk.getSystemInfoSync();
//         let vw = systemInfo.windowWidth;
//         let vh = systemInfo.windowHeight;


//         let _windowS = cc.view.getDesignResolutionSize();
//         wordPos.y = (_windowS.height - wordPos.y) / _windowS.height * vh;


//         let banner: any = this._sdk.createBannerAd({
//             adUnitId: bannerID,
//             style: {
//                 left: 0,
//                 top: 0,
//                 width: vw - 30,
//             },
//         })

//         let systemTop = systemInfo.safeArea.top;
//         // let offset = systemTop && systemTop > 20 ? 50 : 0;
//         let offset = this._sdk.getMenuButtonBoundingClientRect().top + 50;
//         banner.onResize(() => {
//             banner.style.left = 15 + 0.1
//             banner.style.top = wordPos.y + 0.1 + offset
//         })


//         banner.onError(err => {
//             console.log(err);
//             banner = null;
//         })

//         if (this._allBannerAd[id]) {
//             this._allBannerAd[id].destroy();
//         }

//         this._allBannerAd[id] = banner;
//     }

//     /**
//      * 根据id创建并显示一个banner
//      * @param id 
//      */
//     public static showBannerAdById(id: wxBannerAdType, wordPos: cc.Vec2): void {
//         this.createNewBannerAd(id, wordPos);
//         if (this._allBannerAd[id]) {
//             this._allBannerAd[id].show();
//         } else {
//             console.log("no such type banner exist")
//         }
//     }

//     /**
//      * 根据id隐藏并销毁banner
//      */
//     public static hideBannerAd(id: wxBannerAdType): void {
//         if (this._allBannerAd[id]) {
//             this._allBannerAd[id].hide();
//             this._allBannerAd[id].destroy();
//         }
//     }

//     private static onWXShow(res: any): void {
//         cc.director.getScene().resumeAllActions();
//         console.log("onWxShow");
//         console.log(res.query);


//         // 点击邀请连接进入 弹出加入队伍提示窗口
//         // TeamCtrl.inst.checkInvite(res.query['inviterId']);
//     }

//     private static onWXHide(): void {
//         cc.director.getScene().pauseAllActions();
//         console.log("onWxHide");
//     }


//     private static _wxCode: string = "";
//     private static _wxSubscriptSetting: any = null;
//     public static async wxlogin() {

//         // 登录
//         EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "获取登录数据...");
//         let isLoginSuccess: boolean = await new Promise<any>((rs, rj) => {
//             this._sdk.login({
//                 success: (res: any) => {
//                     cc.log(res);
//                     if (res.code) {
//                         this._wxCode = res.code;
//                         // 登录成功
//                         rs(true);
//                     }
//                 },
//                 fail: (e: any) => {
//                     EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "wx.login失败！");
//                     cc.error('wx.login failed', e)
//                     rs(false);
//                 }
//             });
//         })

//         // 登录失败
//         if (!isLoginSuccess) {
//             await UIFacade.showConfirm("登录失败,请检查网络连接");
//             this._sdk.exitMiniProgram({
//                 complete: () => {
//                     cc.error('登录失败！');
//                 },
//             });
//             return;
//         }

//         EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "向游戏服务器发起登录...");
//         await Net.wxlogin(this._wxCode, Platform.getEnterParam("inviterId")).then((data: iloginRetInfo) => {

//             this.getUserEnterInfo();
//             EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "登录成功！");
//             EventMgr.inst.emit(EventId.ON_LOGIN_RET, data);

//         }).catch(() => {
//             EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "游戏服务器登录失败！");
//             UIFacade.showToast('登录失败');
//         })

//     }

//     /**
//      * 上报微信用户来源
//      */
//     public static getUserEnterInfo(): void {
//         let obj = this._sdk.getLaunchOptionsSync();

//         console.log("获取打开参数")
//         console.log(obj.query);

//         let _channel: any = obj.query.channel || null;
//         TAHelper.reportEvent("wxEnterScene", { sceneId: obj.scene, query: _channel });

//         let referrerInfo = obj.referrerInfo;
//         console.log(referrerInfo);
//         if (referrerInfo && referrerInfo.appId) {
//             let extraData: any = referrerInfo.extraData || null;
//             TAHelper.reportEvent("wxSourceFrom", { appId: referrerInfo.appId, extraData: extraData, query: _channel });
//         }

//     }

//     /**
//     * 获取用户授权信息
//     */

//     private static _authButton: any = null;
//     public static async getUserAuthorized() {

//         // 获取授权信息
//         let isAuthorized: boolean = await new Promise((rs, rj) => {
//             this._sdk.getSetting({
//                 withSubscriptions: true,
//                 success: (res: any) => {
//                     cc.log(res.authSetting);
//                     this._wxSubscriptSetting = res.subscriptionsSetting;
//                     rs(res.authSetting['scope.userInfo']);
//                 },
//                 fail: (e) => {
//                     EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "wx.getSetting失败！");
//                     cc.error("wx.getSetting fail", e);
//                     rj(false);
//                 }
//             });
//         });

//         //微信平台
//         let systemInfo = this._sdk.getSystemInfoSync();
//         let vw = systemInfo.windowWidth;
//         let vh = systemInfo.windowHeight;

//         // creator平台
//         let _pos = cc.v2(750 / 2 - 266 / 2, 400);
//         cc.log("wxClubBtn", "_pos0", _pos);
//         let _windowS = cc.view.getDesignResolutionSize();
//         _pos.x = _pos.x / _windowS.width * vw;
//         _pos.y = (_windowS.height - _pos.y) / _windowS.height * vh;
//         let _btnW = 266 / _windowS.width * vw;
//         let _btnH = 88 / _windowS.height * vh;


//         //   let rankList: iRankList = RankModel.inst.getwxRankList();


//         if (!isAuthorized) {
//             let isAccept: boolean = await new Promise((rs, js) => {
//                 this._authButton = this._sdk.createUserInfoButton({
//                     type: 'image',
//                     text: '发起求助',
//                     image: "https://game-cdn.moxigame.cn/ClickEliminate/upload/authorizationLogin.png",
//                     style: {
//                         width: _btnW,
//                         height: _btnH,
//                         left: _pos.x,
//                         top: _pos.y - 50
//                     }
//                 });

//                 // EventMgr.inst.once(EventId.ON_UI_CLOSE, this._onWxRankClose, this);
//                 EventMgr.inst.once(EventId.ON_UI_CLOSE, this._onRankClose, this);
//                 this._authButton.onTap((res) => {
//                     if (res.userInfo) {
//                         cc.log("授权成功");
//                         this._authButton.destroy();
//                         this._authButton = null;
//                         // Platform.showPlatformRank(rankList);
//                         RankModel.inst.queryRankInfo();
//                         rs(true);
//                     } else {
//                         EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "用户拒绝授权！");
//                         cc.error('用户拒绝授权');
//                         rs(false);
//                     }
//                 })
//             });
//         }
//         else {
//             // Platform.showPlatformRank(rankList);
//             RankModel.inst.queryRankInfo();
//         }

//         let data = await new Promise<any>((rs) => {
//             this._sdk.getUserInfo({
//                 success: (data: any) => {
//                     cc.log('wx.getUserInfo success!');
//                     rs(data);
//                 },
//                 fail: (e) => {
//                     EventMgr.inst.emit(EventId.ON_UPDATE_LOADING_TTP, "wx.getUserInfo 失败！");
//                     cc.error('wx.getUserInfo fail!');
//                     rs(null);
//                 }
//             });
//         });

//         if (!data) {
//             this._sdk.exitMiniProgram();
//         }

//         await Net.wxUpdateUserInfo(data.encryptedData, data.iv).then((data: iloginRetInfo) => {
//             this.getUserEnterInfo();

//         }).catch(() => {
//             UIFacade.showToast('登录失败');
//         })

//     }

//     private static _onWxRankClose(type: UIType): void {
//         if (type == UIType.wxRank) {
//             if (this._authButton) {
//                 this._authButton.destroy();
//                 this._authButton = null;
//             }
//         }
//     }

//     private static _onRankClose(type: UIType): void {
//         if (type == UIType.Rank) {
//             if (this._authButton) {
//                 this._authButton.destroy();
//                 this._authButton = null;
//             }
//         }
//     }

//     /**
//      * 打开客服会话
//      */
//     public static openCSC(): void {

//         if (!this._sdk.openCustomerServiceConversation) {
//             UIFacade.showToast("您的微信版本过低，建议升级~");
//             return;
//         }
//         this._sdk.openCustomerServiceConversation({});
//     }
// }