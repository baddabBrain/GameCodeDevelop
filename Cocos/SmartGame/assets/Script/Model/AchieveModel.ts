// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventMgr from "../Framework/Event/EventMgr";
import { EventId } from "../Define/EventId";
import { achieveList } from "../Network/NetApi";



const { ccclass, property } = cc._decorator;

@ccclass
export default class AchieveModel {
    private static _inst: AchieveModel = null;
    private constructor() {

    }

    public static get inst(): AchieveModel {
        if (!this._inst) {
            this._inst = new AchieveModel();
        }
        return this._inst;
    }

    private _achieveList: Array<achieveList> = [];

    public setAchieveData(list: Array<achieveList>): void {
        if (list && JSON.stringify(this._achieveList) != JSON.stringify(list)) {
            this._achieveList = list;
      
        }
    }

    public getAllAchievementData(): Array<achieveList> {
        return this._achieveList;
    }

    public getAchievementData(achieveId: string): achieveList {
        for (let i = 0; i < this._achieveList.length; i++) {
            if (this._achieveList[i].acId == achieveId) {
                return this._achieveList[i];
            }
        }
        return null;
    }
}
