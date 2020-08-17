import { HttpRequest } from "../Net/HttpRequest";
import { TdUtil } from "./TDGA";
import { TAHelper } from "./TAHelper";

export class WxWebShare {

    /**
     * 初始化分享
     */
    public static init() {
        let wx: any = window['wx'];

        HttpRequest.get("http://49.235.117.115:3000/getsign", { url: window.location.href.split('#')[0] }, {}).then((data: any) => {

            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data["appid"], // 必填，公众号的唯一标识
                timestamp: data["timestamp"], // 必填，生成签名的时间戳
                nonceStr: data["noncestr"], // 必填，生成签名的随机串
                signature: data["signature"],// 必填，签名
                jsApiList: ["onMenuShareTimeline"
                    , "onMenuShareQQ"
                    , "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
            });
            cc.log("wx config success!");
        }).catch(() => {
            cc.error("wx config fail!");
        });

        // 配置默认分享文案
        wx.ready(() => {
            this.configOnMenuShare('过街老鼠人人喊打！解气', '原则问题我们不能再忍，全抓了！一个不剩！');
        });
    }

    /**
     * 配置分享文案
     * @param title 
     * @param desc 
     * @param imgUrl 
     */
    public static configOnMenuShare(title: string, desc: string, imgUrl: string = 'http://eldn.gitee.io/hk/share.png?t=' + Date.now()) {
        let wx: any = window['wx'];

        // 分享到朋友
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            success: function () {
                cc.log("分享成功");
                TAHelper.reportEvent("share", { time: Date.now(), platform: "weixin" });
            },
            cancel: function () {
                cc.log("未分享!");
            }
        });

        //分享到QQ
        wx.onMenuShareQQ({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                cc.log("分享成功");
                TAHelper.reportEvent("share", { time: Date.now(), platform: "QQ" });
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                cc.log("未分享!");
            }
        });
    }
}