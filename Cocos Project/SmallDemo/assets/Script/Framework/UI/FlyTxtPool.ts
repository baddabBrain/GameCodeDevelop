import { NodePool } from "../Res/NodePool";
import FlyTxt from "./FlyTxt";
import { LayerType } from "../../Define/UIDefs";
import UIMgr from "./UIMgr";



interface iFlyTxtInfo {
    txt: string;
    pos: cc.Vec2;
    color : cc.Color;
}

export class FlyTxtPool{


    private static _flyTxtPool: NodePool;
    private static _flyList: Array<iFlyTxtInfo> = [];
    private static _flyPoolReady: boolean = false;
    private static readonly _maxShowCount: number = 3;
    private static _currentShowCount: number = 0;

    public static init(waterMark : number = 10) : void {
        if (!this._flyTxtPool) {
            this._flyTxtPool = new NodePool();
            this._flyTxtPool.setWaterMark(waterMark);
            this._flyTxtPool.init("UIPrefab/Common/FlyTxt", (err) => {
                this._flyPoolReady = true;
                this._flyNextTxt();
            });
        }
    }

    public static flyTxt(txt: string, pos: cc.Vec2, color : cc.Color): void {

        this._flyList.push({ txt: txt, pos: pos , color : color});

        if (!this._flyTxtPool) {
            this.init();
        }

        if (this._flyPoolReady) {
            this._flyNextTxt();
        }
    }

    private static _flyNextTxt(): void {
        if (this._flyList.length > 0 && this._currentShowCount < this._maxShowCount) {
            let txtInfo: iFlyTxtInfo = this._flyList.shift();
            let node: cc.Node = this._flyTxtPool.getNode();

            if (node) {
                this._currentShowCount++;
                let flyTxt : FlyTxt = node.getComponent(FlyTxt);
                flyTxt.setTxt(txtInfo.txt, txtInfo.color);
                let tipLayer : cc.Node = UIMgr.inst.getLayer(LayerType.Tip);
                tipLayer.addChild(node);
                node.setPosition(tipLayer.convertToNodeSpaceAR(txtInfo.pos));
                node.once(FlyTxt.EVNENT_ON_FLY_ANI_COMPLETE, () => {
                    this._currentShowCount--;
                    this._flyTxtPool.freeNode(node);
                    this._flyNextTxt();
                });
                flyTxt.playFlyAni();

            }
        }
    }
}