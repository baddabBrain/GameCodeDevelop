
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export enum EmailType {
    putongjiangli,
    email,
    compensation,
}

export enum SeEnumtaskeType {  //淘宝的任务
    HeXiaoCiShu = 0,
    ShouQuanDingWei = 1,
    ShouQuanDengLu = 2,
    WanChengDuiHuan = 3,
    HuoQuDaoJu = 4,
    YouXiJiFen = 5,
    ShouCiXiaoFei = 6,
    DanBiXiaoFei = 7,
    LiuLanShangPin = 8,
    ShouCangShangPin = 9,
    ZhuanPanChouJiang = 10,
    GuanZhuDianPu = 11,
    ShouCiCanYu = 12,
}

export const shopImgType = {
    logo: 'logo',
    watermark: 'watermark',
    loadingicon: 'loadingicon',
    banner: 'banner',
    notice: 'notice',
}

export default class MoxiModel {

    private static _inst: MoxiModel;

    public static get inst(): MoxiModel {
        if (!this._inst) {
            this._inst = new MoxiModel();
        }
        return this._inst;
    }

    /** 用户信息 */
    private _userInfo: any;

    /** 授权信息 */
    private _authInfo: any;

    /** 任务信息 */
    private _taskInfo: any = null;

    /** 活动信息 */
    private _activeInfo: { startTime: number, endTime: number } = null;

    /** 商家轮播图 */
    private _AdSprites: Array<{ num_id: string, url: string, title: string }> = [];

    /** 直播信息 */
    private _liveInfo: { url: string, startTime: number, endTime: number } = null;

    /** 商家配置图片 */
    private _shopImg: { logo: string, watermark: string, loadingicon: string, banner: string, notice: string } = null;

    /** 商家店铺名称 */
    private _shopName: string = null;

    /** 不显示在列表内的商家任务 */
    private needntShow: Array<SeEnumtaskeType> = [
        SeEnumtaskeType.ShouCiXiaoFei,
        SeEnumtaskeType.DanBiXiaoFei,
        SeEnumtaskeType.GuanZhuDianPu,
    ];

    public initData(res: any): void {
        if (!res) {
            return;
        }

        // 任务数据
        if (res.taskInfo) {
            this._taskInfo = res.taskInfo;
            cc.log(this._taskInfo);
        }

        // 商家轮播图
        if (res.bannerList) {
            this.initAdSprite(res.bannerList);
        }

        // 用户信息
        if (res.userInfo) {
            this._userInfo = res.userInfo;
        }

        // 授权信息
        this._authInfo = res.authInfo;

        // 活动信息
        if (res.activeInfo) {
            this._activeInfo = res.activeInfo;
        }

        //直播信息
        if (res.activeInfo.live) {
            this._liveInfo = res.activeInfo.live;
        }

        //商家店铺名称

        if (res.shopInfo) {
            this._shopName = res.shopInfo.title;
            this._shopImg = res.shopInfo.imgs;
        }
    }

  

  

    private initAdSprite(Ad_Data: Map<number, any>) {
        Ad_Data.forEach((value, key) => {
            this._AdSprites.push({ num_id: value.num_iid, url: value.pic_url, title: value.title });
        })
    }


    public getAdSprite(): Array<{ num_id: string, url: string, title: string }> {
        return this._AdSprites;
    }

    public getRandomAdSprite(): { num_id: string, url: string, title: string } {
        if (this._AdSprites && this._AdSprites.length > 0) {
            let random: number = Math.floor(Math.random() * this._AdSprites.length);
            cc.log(random);
            return this._AdSprites[random];
        }
        return null
    }


    public getUserInfo(): any {
        return this._userInfo;
    }


    public getAuthInfo(): any {
        return this._authInfo;
    }

    public getInviterId(): any {
        cc.log("inviteGameid:" + this._userInfo.inviteGameid);
        return this._userInfo.inviteGameid;
    }

    public getAvatarUrl(): any {
        return this._userInfo.avatarUrl;
    }


    /**
     * 获取活动持续的天数
     *
     * @returns {number}
     * @memberof MoxiModel
     */
    public getActivityLastDays(): number {
        if (this._activeInfo && this._activeInfo.startTime && this._activeInfo.endTime) {
            let lastTime: number = this._activeInfo.endTime - this._activeInfo.startTime;
            let days: number = Math.ceil(lastTime / (1000 * 60 * 60 * 24));
            // 最长7天
            days = Math.min(days, 7);
            // 最短1天
            days = Math.max(days, 1);
            return days;
        }

        cc.error("没有找到活动的持续时间信息");
        return 1;
    }

    public getActiveInfo(): { startTime: number, endTime: number } {
        return this._activeInfo;
    }


    public getConsumeMoney(): number {
        let money: number = null;
        if (this._taskInfo) {
            for (let i = 0; i < this._taskInfo.length; i++) {
                let task: any = this._taskInfo[i];
                if (task) {
                    if (task.res.eType == SeEnumtaskeType.DanBiXiaoFei) {
                        cc.log(task.state.iTargetValue)
                        money = task.state.iTargetValue;
                    }
                }
            }
        }

        return money;
    }

    public getCurrentMoney(): number {
        let money: number = null;
        if (this._taskInfo) {
            for (let i = 0; i < this._taskInfo.length; i++) {
                let task: any = this._taskInfo[i];
                if (task) {
                    if (task.res.eType == SeEnumtaskeType.DanBiXiaoFei) {
                        cc.log(task.state.value)
                        money = task.state.value;
                    }
                }
            }
        }

        return money;
    }

    public getLiveInfo(): { url: string, startTime: number, endTime: number } {
        return this._liveInfo;
    }

    /**
     * 获取关注店铺信息
     */
    public getFollowInfo(): boolean {
        cc.log("获取关注信息..")
        let isFollowed: boolean = null;
        if (this._taskInfo) {
            for (let i = 0; i < this._taskInfo.length; i++) {
                let task: any = this._taskInfo[i];
                if (task) {
                    if (task.res.eType == SeEnumtaskeType.GuanZhuDianPu) {
                        isFollowed = task.state.get;
                        break;
                    }
                }
            }
        }
        return isFollowed;
    }

   
    public getShopName(): string {
        return this._shopName;
    }

    public getShopImg(type: string): string {
        if (this._shopImg != null) {
            return this._shopImg[type];
        }
        return null;
    }

    //获取进度条任务
    public getRewarDProgressInfo(): any {
        let rewardTask: Array<any> = [];
        if (this._taskInfo) {
            for (let i = 0; i < this._taskInfo.length; i++) {
                let task = this._taskInfo[i];
                if (task) {
                    if (task.sGroup == "achieve") {
                        rewardTask.push(task);
                    }
                }
            }

            rewardTask.sort((a, b) => {
                return a.state.iTargetValue - b.state.iTargetValue;
            })
        }


        return rewardTask;
    }

    //获取当前勋章数
    public getMedalNumber(): number {
        let rewardTask = this.getRewarDProgressInfo();
        if (rewardTask.length > 0) {
            return rewardTask[rewardTask.length - 1].state.value;
        } else {
            return null
        }
    }
}

