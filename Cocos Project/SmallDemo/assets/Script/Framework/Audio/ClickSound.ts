import MXAudioSource from "./MXAudioSource";

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
