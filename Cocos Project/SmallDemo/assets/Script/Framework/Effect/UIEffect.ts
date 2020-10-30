


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIEffectType } from "./UIEffectType";
import { Handler } from "../Sys/Handler";


const {ccclass, property} = cc._decorator;


@ccclass
export default class UIEffect extends cc.Component {

    public static EVENT_ANI_COMPLETE : string = "UIEffect.EVENT_ANI_COMPLETE";

    private _ani: cc.Animation = null;

    public get ani(): cc.Animation {
        return this._ani;
    }

    private _completeCallback : Handler = null;
    private _effectType: UIEffectType = UIEffectType.None;

    public get effectType(): UIEffectType {
        return this._effectType;
    }

    public set effectType(value: UIEffectType) {
        this._effectType = value;
    }


    onLoad () {
        this._ani = this.node.getComponent(cc.Animation);
    }

    setCompleteCallback(handler : Handler){
        this._completeCallback = handler;
    }

    onAniComplete(){
        if(this._completeCallback){
            this._completeCallback.runWith([this.effectType, this.node])
        }
        this.node.emit(UIEffect.EVENT_ANI_COMPLETE);
    }

    start () {
        this.playAni();
    }

    playAni() {
        if(this._ani){
            let aniState : cc.AnimationState = this._ani.play();
            if(aniState.wrapMode != cc.WrapMode.Loop){
                this._ani.once("finished", this.onAniComplete, this);
            }
        }
    }

    public setPlayTime(time : number) : void{
        this._ani.defaultClip.speed = time / 1000 / this._ani.defaultClip.duration;
    }

    onEnable(){
        
    }

    onDisable(){
        this._ani && this._ani.off("finished", this.onAniComplete, this);
    }
}
