// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventId } from "./Define/EventId";
import { EVENT } from "./Framework/Event/EventMgr";
import Grid from "./Framework/Utils/Grid";
import SearchControl from "./Framework/Utils/SearchControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends cc.Component {


    @property(cc.Node)
    moveNode: cc.Node = null;

    @property(cc.Prefab)
    barrierPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        EVENT.on(EventId.ON_CREATE_BARRIER, this.createBarrier, this);
    }

    start() {
        SearchControl.Inst.initMap(24, 24);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onClick, this);
    
    }

    private onClick(e: cc.Event.EventTouch): void {
        let pos: cc.Vec2 = this.node.convertToNodeSpaceAR(e.getLocation());
        let moveList: Array<Grid> = SearchControl.Inst.searchMinPath(this.moveNode.getPosition(), pos);
        if (moveList != null) {
            let curTween = cc.tween(this.moveNode);
            for (let i: number = 0; i < moveList.length; i++) {
                let curPos: cc.Vec2 = new cc.Vec2(moveList[i].posX, moveList[i].posY);
                curTween.to(0.6, { position: new cc.Vec3(curPos.x, curPos.y, 0) });
            }
            curTween.start();
        }
    }

    private createBarrier(x: number, y: number): void {
        let barrierNode: cc.Node = cc.instantiate(this.barrierPrefab);
        this.node.addChild(barrierNode);
        barrierNode.setPosition(x, y);
    }




    // update (dt) {}
}
