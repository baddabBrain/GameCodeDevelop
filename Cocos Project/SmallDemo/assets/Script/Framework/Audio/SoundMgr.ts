import { LocalKey } from "../../Define/LocalKey";

export class SoundMgr {


    private static _voiceDegree: number = 0;   //从0到10  表示音量的大小

    static clips: { [audioId: string]: cc.AudioClip } = {};

    static init(audioNode: cc.Node) {

        // 生成Clips
        for (let child of audioNode.children) {
            let clip = child.getComponent(cc.AudioSource).clip;
            if (!clip) {
                throw new Error(`SoundMgr  [${child.name}] Clip 为空`);
            }
           // cc.log('SoundMgr', 'AddAudio', child.name)
            this.clips[child.name] = clip;
        }
        let voicDegree = cc.sys.localStorage.getItem(LocalKey.SoundVolum) as number | null;

        if (voicDegree || voicDegree === 0) {
            this._voiceDegree = voicDegree;
        } else {
            this._voiceDegree = 10;
        }

       // cc.log('voiceDegree', this._voiceDegree)
        cc.audioEngine.setEffectsVolume(this._voiceDegree / 10);
        cc.audioEngine.setMusicVolume(this._voiceDegree / 10);
        this.musicId = -1;
    }

    /**
     * 播放音效
     * @param audioId 
     * @param loop 
     */
    static playEffect(audioId: string, loop: boolean = false) {
        if (this._voiceDegree === 0) {
            return;
        }
        let clip = this.clips[audioId];
        if (CC_DEV && !clip) {
            throw new Error('播放了不存在的音效: ' + audioId);
        }
        cc.audioEngine.playEffect(clip, loop);
    }


    /**
     * 播放音乐
     * @param audioId 
     * @param loop 
     */
    private static musicId = -1;
    static playMusic(audioId: string, loop: boolean = true) {
        if (this._voiceDegree === 0) {
            return;
        }
        let clip = this.clips[audioId];
        if (CC_DEV && !clip) {
            throw new Error('播放了不存在的音乐: ' + audioId);
        }
        this.musicId = cc.audioEngine.playMusic(clip, loop)
    }

    /**
     * 停止音乐
     */
    static stopMusic() {
        cc.audioEngine.stopMusic();
    }

    /**
     * 设置音乐大小 目前只可以设置静音
     * @param degree|表示声音的大小0表示静音
     * */
    static controlVoice(degree: number) {
        if (degree < 0 || degree > 10) {
            throw new Error("[controlVoice]传入了不合法的参数");
        }
        this._voiceDegree = degree;
        cc.audioEngine.setEffectsVolume(this._voiceDegree / 10);
        cc.audioEngine.setMusicVolume(this._voiceDegree / 10);
    }

    static get SoundDgree(): number {
        return this._voiceDegree;
    }


    /**
     * 返回音乐的状态
     */
    static getVoiceStatus(): number {
        return this._voiceDegree;
    }
}