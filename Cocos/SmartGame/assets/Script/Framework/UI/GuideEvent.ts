import EventMgr from "../Event/EventMgr";
import { EventId } from "../../Define/EventId";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

enum eSendChance{
    open,
    close,
}


@ccclass
export default class GuideEvent extends cc.Component {

    @property({ displayName:"派发事件"})
    params : string = ''

    @property({ type: cc.Enum(eSendChance),displayName:"派发时机"})
    sendChance : eSendChance = eSendChance.open;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.sendChance == eSendChance.open){
            EventMgr.inst.emit(EventId.ON_GUIDE_NEXT_TRIGGER, this.params);
        }
    }

    onDestroy(){
        if(this.sendChance == eSendChance.close){
            EventMgr.inst.emit(EventId.ON_GUIDE_NEXT_TRIGGER, this.params);
        }
    }
}
