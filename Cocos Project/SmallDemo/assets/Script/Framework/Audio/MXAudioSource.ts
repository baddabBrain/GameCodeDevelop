import AudioSourceMgr from "./AudioSoureMgr";

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


export enum MXAudioSourceType{
    Effect,
    Music,
}

@ccclass
export default class MXAudioSource extends cc.AudioSource {

     @property({type : cc.Enum(MXAudioSourceType)})
     audioType : MXAudioSourceType = MXAudioSourceType.Effect;


     onEnable(){
        super.onEnable();
        AudioSourceMgr.inst.registerAudio(this);
     }

     onDisable() {
        super.onDisable();
        AudioSourceMgr.inst.unregisterAudio(this);
     }

}
