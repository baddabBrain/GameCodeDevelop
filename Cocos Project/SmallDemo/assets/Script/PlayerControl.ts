// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EVENT } from "./Framework/Event/EventMgr";
import GameModel, { GameStatus } from "./Model/GameModel";

const { ccclass, property } = cc._decorator;


//玩家移动方向
export enum PlayerDirection {
    Up,
    Down,
    Right,
    Left,
    LeftUp,
    LeftDown,
    RigthUp,
    RightDown
}

@ccclass
export default class PlayerControl extends cc.Component {

    //播放人物的移动动画组件
    @property(cc.Animation)
    playerAnim: cc.Animation = null;

    //是否按住键盘标志位
    private isHoldKey: boolean = false;

    onEnable(): void {

    }

    onDisable(): void {

    }

    onLoad() {
        //键盘按下事件监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //键盘松开事件监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    
    private onKeyDown(e): void {
        if (this.isHoldKey) {
            return;
        }
        this.isHoldKey = true;
        //四方向移动
        switch (e.keyCode) {
            case cc.macro.KEY.up:
                this.playerAnim.play("moveUp");
                break;
            case cc.macro.KEY.down:
                this.playerAnim.play("moveDown");
                break;
            case cc.macro.KEY.left:
                this.playerAnim.play("moveLeft");
                break;
            case cc.macro.KEY.right:
                this.playerAnim.play("moveRight");
                break;
        }
    }

    private onKeyUp(): void {
        this.playerAnim.stop();
        this.isHoldKey = false;
    }

    // update (dt) {}
}
