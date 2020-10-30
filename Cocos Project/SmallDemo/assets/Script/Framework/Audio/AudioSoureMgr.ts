import MXAudioSource, { MXAudioSourceType } from "./MXAudioSource";
import { LocalStorageMgr } from "../Storage/LocalStorageMgr";
import { LocalKey } from "../../Define/LocalKey";

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

@ccclass
export default class AudioSourceMgr{

    private static _inst : AudioSourceMgr = null;

    public static get inst() : AudioSourceMgr{
        if(!this._inst){
            this._inst  = new AudioSourceMgr();
        }
        return this._inst;
    }
   
    private _allAudios : Array<MXAudioSource> = [];
    private _audioVolum : Map<MXAudioSourceType, number> = new Map<MXAudioSourceType, number>();
    private _audioSwitch : Map<MXAudioSourceType, boolean> = new Map<MXAudioSourceType, boolean>();

    public init() : void {
        // 读取配置
        let effectVolumeStr : string = LocalStorageMgr.getItem(LocalKey.AudioVolumeEffect, true);
        if(effectVolumeStr){
            this._audioVolum.set(MXAudioSourceType.Effect, parseInt(effectVolumeStr));
        }

        let effectMuteStr : string = LocalStorageMgr.getItem(LocalKey.AudioVolumeEffectMute, true);
        if(effectMuteStr){
            this._audioSwitch.set(MXAudioSourceType.Effect, effectMuteStr == "yes" ? true : false);
        }

        let musicVolumeStr : string = LocalStorageMgr.getItem(LocalKey.AudioVolumeMusic, true);
        if(musicVolumeStr){
            this._audioVolum.set(MXAudioSourceType.Music, parseInt(musicVolumeStr));
        }

        let musicMuteStr : string = LocalStorageMgr.getItem(LocalKey.AudioVolumeMusicMute, true);
        if(musicMuteStr){
            this._audioSwitch.set(MXAudioSourceType.Music, musicMuteStr == "yes" ? true : false);
        }
    }

    /**
     * 注册一个audioSource
     * @param audio 
     */
    public registerAudio(audio : MXAudioSource) : void{
        this._allAudios.push(audio);

        // 读取音量设置
        let audioVolume : number = this._audioVolum.get(audio.audioType);
        if(audioVolume){
            audio.volume = audioVolume;
        }

        // 读取开关设置
        let audioMuted : boolean = this._audioSwitch.get(audio.audioType);
        // if(audioMuted == true){
        //     //audio.playOnLoad = false;
        //     audio.mute = true;
        //     //audio.stop();
        // }
        // else{
        //     audio.mute = false;
        // }
        this._muteOne(audio,audioMuted);
    }

    /**
     * 卸载一个AudioSource
     * @param audio 
     */
    public unregisterAudio(audio : MXAudioSource) : void{
        for(let i : number = 0; i < this._allAudios.length; ++i){
            if(this._allAudios[i] == audio){
                this._allAudios.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 设置背景音乐音量 
     * @param v 
     */
    public setMusicVolume(v : number, isSave : boolean = false) : void {
        this._setVolume(v, MXAudioSourceType.Music);
        this._audioVolum.set(MXAudioSourceType.Music, v);
        isSave && LocalStorageMgr.setItem(LocalKey.AudioVolumeMusic, v.toString(), true);
    } 

    /**
     * 设置音效音量
     * @param v 
     */
    public setEffectVolume(v : number, isSave : boolean = false) : void{
        this._setVolume(v, MXAudioSourceType.Effect);
        this._audioVolum.set(MXAudioSourceType.Effect, v);
        isSave && LocalStorageMgr.setItem(LocalKey.AudioVolumeEffect, v.toString(), true);
    }

    /**
     * 背景音乐静音开关
     * @param isMute 
     */
    public muteAllMusic(isMute : boolean, isSave : boolean = false) : void {
        this._audioSwitch.set(MXAudioSourceType.Music, isMute);
        this._mute(MXAudioSourceType.Music, isMute);
        isSave && LocalStorageMgr.setItem(LocalKey.AudioVolumeMusicMute, isMute ? "yes" : "no", true);
    }


    /**
     * 音效静音开关
     * @param isMute 
     */
    public muteAllEffect(isMute : boolean, isSave : boolean = false) : void {
        this._audioSwitch.set(MXAudioSourceType.Effect, isMute);
        this._mute(MXAudioSourceType.Effect, isMute);
        isSave && LocalStorageMgr.setItem(LocalKey.AudioVolumeEffectMute, isMute ? "yes" : "no", true);
    }

    /**
     * 获取接口
     */
    public isMusicMute(){
        return this._audioSwitch.get(MXAudioSourceType.Music);
    }

    public isEffectMute(){
        return this._audioSwitch.get(MXAudioSourceType.Effect);
    }


    private _mute(type : MXAudioSourceType, isMute : boolean) : void {
        for(let i : number = 0; i < this._allAudios.length; ++i){
            let audio : MXAudioSource = this._allAudios[i];
            if(audio.audioType == type){
                // if(isMute){
                //     audio.pause();
                // } else {
                //     audio.resume();
                // }
                this._muteOne(audio,isMute);
            }
        }
    }

    private _muteOne(audio:MXAudioSource,isMute:boolean){
        audio.mute = isMute;
    }

    private _setVolume(v : number, type : MXAudioSourceType) : void {
        for(let i : number = 0; i < this._allAudios.length; ++i){
            let audio : MXAudioSource = this._allAudios[i];
            if(audio.audioType == type){
                audio.volume = v;
            }
        }
    }
}
