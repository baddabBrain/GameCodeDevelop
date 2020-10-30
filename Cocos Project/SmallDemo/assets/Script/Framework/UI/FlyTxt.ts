// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FlyTxt extends cc.Component {

    @property(cc.Label)
    lblTxt: cc.Label = null;

    @property(cc.Animation)
    flyAni: cc.Animation = null;

    public static readonly EVNENT_ON_FLY_ANI_COMPLETE : string = 'FlyTxt.EVNENT_ON_FLY_ANI_COMPLETE';


    public setTxt(txt : string, color : cc.Color) :void {
        this.lblTxt.string = txt;
        this.lblTxt.node.color = color;
    }

    public playFlyAni() : void {
        this.flyAni.play(undefined, 0);
        this.flyAni.once('finished',()=>{
            this.node.emit(FlyTxt.EVNENT_ON_FLY_ANI_COMPLETE);
        },this);

    }
}
