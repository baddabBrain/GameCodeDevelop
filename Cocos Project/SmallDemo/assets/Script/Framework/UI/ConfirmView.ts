import UIBase from "../UIBase";
import EventMgr from "../Event/EventMgr";
import { EventId } from "../../Define/EventId";



// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ConfirmView extends UIBase {

    @property(cc.Label)
    lblContent: cc.Label = null;

    @property(cc.Label)
    confirmTxt: cc.Label = null;

    @property(cc.Label)
    cancelTxt: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
       // {showTxt : showTxt,title : title,seleData : seleData}
    //    content:string, confirmBtnTxt:string, cancelBtnTxt : string, datas:any
        this.renderView(this._para.content,this._para.confirmBtnTxt,this._para.cancelBtnTxt);
    }

    private renderView(content:string,confirmText:string,cancelText:any):void{
        this.lblContent.string = content;
        // this.confirmTxt.string = confirmText;
        // this.cancelTxt.string = cancelText;
    }

    private onBtnCloseClick() : void{
        this.close();
        EventMgr.inst.emit(EventId.EVENT_CONFIRM,false);
    }

    private onClickButton1():void{
        //取消
        this.close();
        EventMgr.inst.emit(EventId.EVENT_CONFIRM,false);
    }

    private onClickButton2():void{
        //确认
        this.close();
        EventMgr.inst.emit(EventId.EVENT_CONFIRM,true);
    }

    // update (dt) {}
}
