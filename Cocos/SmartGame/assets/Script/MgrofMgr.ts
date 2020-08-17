// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MgrofMgr extends cc.Component {
  

    private static _instance:MgrofMgr;
    public static Instance():MgrofMgr
    {
        if(this._instance == null)
        {
            this._instance = new MgrofMgr();
        }
        return this._instance;
    }

    start () {

    }

    public getRes():void
    {

    }

    // update (dt) {}
}
