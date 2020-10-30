// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass("TabProperty")
class TabProperty {

    @property(cc.Sprite)
    tab: cc.Sprite = null;

    @property(cc.SpriteFrame)
    select: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    unselect: cc.SpriteFrame = null;
}

@ccclass
export default class TabControl extends cc.Component {

    @property([TabProperty])
    tabs: Array<TabProperty> = [];

    @property(cc.Component.EventHandler)
    clickHandler: cc.Component.EventHandler = null;

    @property()
    selectIdx: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
       
        // 设置默认选择
        if(this.selectIdx >= 0 && this.selectIdx < this.tabs.length){
            this.setSelect(this.selectIdx);
        }
    }


    onEnable() {
        for (let pro of this.tabs) {
            pro.tab.node.on(cc.Node.EventType.TOUCH_END, this.onTabClick, this);
        }
    }

    onDisable() {
        for (let pro of this.tabs) {
            pro.tab.node.off(cc.Node.EventType.TOUCH_END, this.onTabClick, this);
        }
    }

    start() {

    }

    private setSelect(nIndex : number) : void{
        for(let i : number = 0; i < this.tabs.length; ++i){
            if(i == nIndex){
                // 设置为选中
                this.tabs[i].tab.spriteFrame = this.tabs[i].select;

                // 其他设置为未选中
                for (let other of this.tabs) {
                    if(other == this.tabs[i] ){
                        continue;
                    }
                    other.tab.spriteFrame = other.unselect;
                }

                break;
            }
        }
    }

    private getTargetIndex(target : cc.Node) : number{
        for(let i : number = 0; i < this.tabs.length; ++i){
            if(this.tabs[i].tab.node == target){
                return i;
            }
        }
        return -1;
    }

    private onTabClick(event: cc.Event) {
        let targetIdx : number = this.getTargetIndex(event.target);
        if(targetIdx != -1){
            this.setSelect(targetIdx);
            this.clickHandler && this.clickHandler.emit([targetIdx]);
        }
    }

    // update (dt) {}
}
