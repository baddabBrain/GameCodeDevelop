import MXAudioSource from "./MXAudioSource";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickSound extends MXAudioSource {


    onEnable(){
        super.onEnable();
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
    }

    onDisable(){
        super.onDisable();
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouch, this);
    }

    private onTouch(){
        this.play();
    }

    // update (dt) {}
}
