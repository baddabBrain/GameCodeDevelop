import { UIFacade } from "../UI/UIFacade";
import MoxiModel, { EmailType } from "../../Model/MoxiModel";

export class MoxiHelper {


    private static _sdk: any;


    /**
     * 初始化
     */
    public static init(): Promise<any> {
        let sdk: any = window['MoxiAct'];
        if (!sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }

        this._sdk = new sdk();
        return new Promise((rs, rj) => {
            this._sdk.init({
                success: function (res) {
                    cc.log('初始化成功', res);
                    rs(res);
                },
                fail: function (res) {
                    cc.log('初始化失败', res)
                    rj(res);
                },
                reloadData: function (res) {
                    rs(res);
                    MoxiModel.inst.initData(res);
                    cc.log('回参同初始化成功', res)
                    cc.log('界面状态发生改变,需刷新用户信息')
                }
            })
        })
    }


    /**
     * 问题反馈跳转到小程序
     */
    public static ProblemFeedBack(): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        cc.log("跳转到问题反馈")
        this._sdk.goMiniApp("contactMoxi");
    }

    /**
     * 联系商家跳转到小程序
     */
    public static ContactMerchant(): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        cc.log("跳转到联系商家")
        this._sdk.goMiniApp("contactShopper");
    }

    /**
     * 背包跳转到小程序
     */
    public static Bag(): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        cc.log("跳转到背包")
        this._sdk.goPltPage("myPrize");
    }

    /**
     * 玩法说明跳转到小程序
     */
    public static GameShows(): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        cc.log("跳转到玩法说明")
        this._sdk.goPltPage("rule");
    }

    /**
     * 抽奖跳转到小程序
     */
    public static Lottery(): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            UIFacade.showToast("敬请期待");
            return;
        }
        cc.log("跳转到抽奖")
        this._sdk.goPltTask("draw");
    }


    public static Collection(): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            UIFacade.showToast("敬请期待");
            return;
        }
        cc.log("跳转到collect")
        this._sdk.goPltTask("collect");
    }
 
    /**
     * 上报分数
     * @param addStar 
     */
    public static upLoadScore(resultInfo: { score: string, sign: string }): Promise<any> {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        return new Promise((rs, rj) => {
            this._sdk.uploadScore({ score: parseInt(resultInfo.score), sign: resultInfo.sign }, {
                success: function (res) {
                    cc.log(res);
                    cc.log(res.money);
                    cc.log("上报分数成功")
                    rs(res.money);
                },
                fail: function (res) {
                    cc.log("上报分数失败")
                    rj()
                }
            })
        })
    }


    /**
     *  跳转到分享
     */
    public static goShare(title: string, imgUrl: string, flag: boolean): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        cc.log("跳转到分享")
        let authInfo: any = MoxiModel.inst.getAuthInfo();
        let path: string = `pages/loading/loading?inviteUid=${authInfo.pltId}&inviteGameid=${authInfo.userId}`;  //小程序那自己拼不用传了
        cc.log(path);
        this._sdk.goPltTask("share", {
            title: "动动手指点一点，轻松消除，集星星抽奖品",
            // path: path,
            imageUrl: "https://game-cdn.moxigame.cn/resource/download/d513b670476231bdf00dc7e6e88b0d19.png",
            flag: flag,
            success: function () {
            },
            fail: function () {
            }
        });
    }

    /**
     * 点商品跳转到指定商品
     */
    public static goBaoBei(num_id: string): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        cc.log(num_id)
        cc.log("跳转到指定商品")
        this._sdk.goMiniApp("baobeiDetail", { num_iid: num_id });
    }

    /**
     * 复制文字
     */
    public static copy(text: string): Promise<any> {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        return new Promise((rs, rj) => {
            this._sdk.copy(text, (result) => {
                rs(true)
            })
        })
    }

    /**
     * 跳转到直播间
     */
    public static goLiveingRoom(): void {
        if (!this._sdk) {
            cc.error('Moxi SDK not load yet !');
            return;
        }
        if (MoxiModel.inst.getLiveInfo().url) {
            let url: string = MoxiModel.inst.getLiveInfo().url;
            cc.log("跳转到直播间 " + url);
            this._sdk.goMiniApp("taoLive", { liveUrl: url })
        } else {
            UIFacade.showToast("未找到直播地址");
        }
    }

} 