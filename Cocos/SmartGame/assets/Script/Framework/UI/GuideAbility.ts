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


@ccclass("GuideItem")
class GuideItem{
    @property({type : cc.Node, displayName:"节点"})
    target : cc.Node = null;

    @property({displayName:"配置名"})
    name : string = ''
}

@ccclass
export default class GuideAbility extends cc.Component {

    @property({type:[GuideItem], displayName:"引导节点"})
    guideItems: GuideItem[] = [];

    public getGuideItem(name : string) : cc.Node{
        for(let i : number = 0; i < this.guideItems.length; ++i){
            if(this.guideItems[i].name == name){
                return this.guideItems[i].target;
            }
        }
        return null;
    }
}
