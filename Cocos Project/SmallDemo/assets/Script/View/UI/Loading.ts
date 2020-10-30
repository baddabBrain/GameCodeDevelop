import UIBase from "../../Framework/UIBase";
import { EventId } from "../../Define/EventId";
import { EVENT } from "../../Framework/Event/EventMgr";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends UIBase {

    @property(cc.Label)
    lblTip: cc.Label = null;

    @property(cc.Label)
    lblProgress: cc.Label = null;

    @property(cc.Node)
    progressBG: cc.Node = null;

    @property(cc.Node)
    progressMask: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.lblProgress.string = "";
        this.lblTip.string = "";
    }

    start() {

    }

    onEnable() {
        EVENT.on(EventId.ON_UPDATE_LOADING_TTP, this.onUpdateTip, this);
        EVENT.on(EventId.ON_UPDATE_LOADING_PROGRESS, this.onUpdateProgress, this);
    }

    onDisable() {
        EVENT.off(EventId.ON_UPDATE_LOADING_TTP, this.onUpdateTip, this);
        EVENT.off(EventId.ON_UPDATE_LOADING_PROGRESS, this.onUpdateProgress, this);
    }


    onUpdateTip(val: string) {
        this.lblTip.string = val;
    }

    onUpdateProgress(cur : number, total : number){
        this.lblProgress.string = `${cur}/${total}`;
        this.progressMask.width = cur / total * this.progressBG.width;
    }
}
