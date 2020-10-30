// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SceneBase from "../../Framework/Scene/SceneBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends SceneBase {

    //切换至游戏场景时脚本，主要用于初始化游戏场景的相关内容


    // LIFE-CYCLE CALLBACKS:

    onLoad() { }

    onEnable(): void {

    }

    onDisable(): void {

    }
    start() {

    }

    // update (dt) {}
}
