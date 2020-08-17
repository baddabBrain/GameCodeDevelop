// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { iRankInfo, iRankList } from "../Network/NetApi";
import { PlayerModel } from "./PlayerModel";
import { Net } from "../Network/Net";
import { UIFacade } from "../Framework/UI/UIFacade";
import EventMgr from "../Framework/Event/EventMgr";
import { EventId } from "../Define/EventId";
import { Platform, PlatformType } from "../Framework/Platforms/Platform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankModel {
    private static _inst: RankModel = null;
    private constructor() {

    }
    public static get inst(): RankModel {
        if (!this._inst) {
            this._inst = new RankModel();
        }
        return this._inst;
    }

    /**
    * 世界排行
    */
    private _wordRank: Array<iRankInfo> = [];
    private myPosInWorlds: number = -1;
    private _wxRankList: iRankList = null;


    public getMyPosInWorlds(): number {
        return this.myPosInWorlds;
    }

    public setWorldRank(worldRank: iRankList) {
        if (worldRank.code != 0) {
            return;
        }

        if (!worldRank || worldRank == null) {
            return;
        }

        if (!worldRank.info || !worldRank.info.list) {
            return;
        }

        if (Platform.getPlatType() == PlatformType.WeiXin) {
            this._wxRankList = worldRank;
        }

        let worldRankList: Array<iRankInfo> = worldRank.info.list;

        this._wordRank = worldRankList;

        this.myPosInWorlds = -1;
        for (let i = 0; i < this._wordRank.length; i++) {

            if (this._wordRank[i].unitInfo.gameId == PlayerModel.inst.getGameId()) {
                this.myPosInWorlds = i;
            }
        }

    }

    public getWorldRank(): Array<iRankInfo> {
        return this._wordRank;
    }

    public getwxRankList(): iRankList {
        return this._wxRankList;
    }

    // public async queryRankInfo() {
    //     return new Promise<boolean>((rs, rj) => {
    //         Net.getRankList(0, 200).then((data: iRankList) => {
    //             if (data.code != 0) {
    //                 UIFacade.showToast("获取世界排行失败");
    //                 rs(false)
    //             }
    //             this.setWorldRank(data);
    //             rs(true)
    //         }).catch(() => {
    //             UIFacade.showToast("获取世界排行失败");
    //             rs(false)
    //         })
    //     })
    // }

    // update (dt) {}
}
