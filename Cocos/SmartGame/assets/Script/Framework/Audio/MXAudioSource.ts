import AudioSourceMgr from "./AudioSoureMgr";


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
