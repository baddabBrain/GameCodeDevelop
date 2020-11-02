/*
 * @Description: Toast提示
 * @Author: chenguanhui
 * @Date: 2019-08-20 18:50:43
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-20 20:26:55
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class CommonToast extends cc.Component {
    @property(cc.Node) item:cc.Node=null;s
    private _isOpening:boolean=false;
    private _runTime = 0;
    
    /**
     * 列队控制弹出速度与顺序
     */
    private _tipList=[];
    private openTime:number=0;
    private minOpenTime:number=3;
    private maxOpenTime:number=17;
    private isOpeningCount:boolean=false;
    private showingNext:boolean=false;
    private nowItem:cc.Node=null;
    private lastItem:cc.Node=null;
    private label:cc.Label=null;

    
    public get isOpening(){
        return this._isOpening;
    }

    /**
     * 显示一个Tips
     * @param content 
     */
    public showTips(content: string){
        try{
            this.freshWidth(content);
            this._tipList.push(content);
            if(this._tipList.length==1&&this._isOpening==false){
                this.showingNext=true;
                this.item.width = content.length*40 + 20;
                this._showNext();
            }else{
                if(this._tipList.length>2){
                    let tipMap={};
                    for(let i=0;i<this._tipList.length;i++){
                        if(tipMap[this._tipList[i]]||( this.label&&this._tipList[i]==this.label.string)){
                            this._tipList.splice(i,1);
                            if(this._tipList.length<=2){
                                break;
                            }else{
                                i--;
                            }
                        }else{
                            tipMap[this._tipList[i]]=1;
                        }
                    }
                }
                if(this._tipList.length>0&&this._isOpening==false&&this.isOpeningCount==false&&this.showingNext==false){
                    this.showingNext=true;
                    
                    this._showNext();
                }
            }
            
        }
        catch(e){
            if(this.node){
                this.node.active=false;
            }
            cc.log("ShowTips",e);
        }

        
    }

    private freshWidth(contents:string):void{
        this.item.width = contents.length*40 + 20;
    }

    /**
     * 打开下一个提示
     */
    private _showNext(){
        if(!this.nowItem){
            this.nowItem=cc.instantiate(this.item);
            this.nowItem.parent=this.node;
            this.nowItem.active = true;
            let open=this._showOneTip(this._tipList[0]);
            if(open){
                this._tipList.shift();
                this.openTime=0;
            }
            this.showingNext=false;
        }else{
            cc.log('tip存在');
            this.showingNext=false;
        }
    }

    private _showOneTip(content: string){
        cc.log("ShowOneTip");
        
        if(this._isOpening){
            cc.log("不能同时打开多个提示");
            return false;
        }else if(!this.nowItem){
            cc.log("当前tip已销毁");
            return false;
        }

        this.isOpeningCount=true;
        this._isOpening=true;
        let labelNode:cc.Node=this.nowItem.getChildByName("Label");
        if(labelNode){
            let label:cc.Label=labelNode.getComponent(cc.Label);
            if(label){
                this.label = label;
                label.string = content;
                label.getComponent(cc.Label)['_updateRenderData'](true);
                
            }else{
                cc.log("tip   找不到label");
            }
        }else{
            cc.log("tip   找不到 node   label");
        }
        this.nowItem.opacity=0;
        this.nowItem.runAction(cc.spawn(cc.moveBy(0.15,cc.v2(0,60)),cc.fadeIn(0.2)));
        return true;
    }

    private _removeTips(){
        if(this.lastItem){
            this.lastItem.stopAllActions();
            this.lastItem.removeFromParent();
        }
        this.lastItem=this.nowItem;
        this.nowItem=null;
        if(this.lastItem){
            if(this._tipList.length>0){
                this.lastItem.runAction(cc.sequence(cc.spawn(cc.moveBy(0.25,cc.v2(0,80)),cc.sequence(cc.delayTime(0.1),cc.fadeOut(0.15).easing(cc.easeQuadraticActionIn()))) ,cc.removeSelf(true)));
            }else{
                this.lastItem.runAction(cc.sequence(cc.spawn(cc.moveBy(0.25,cc.v2(0,80)),cc.fadeOut(0.25)),cc.removeSelf(true)));
            }
        }

        this._isOpening=false;
        if(this._tipList.length>0){
            this.showingNext=true;
            this._showNext();
        }
    }

    /**
     * 如果列表里有，控制短时间内关闭
     * @param dt 
     */
    update(dt){

        this._runTime += dt;
        if(this._runTime  < 0.1){
            return;
        }
        this._runTime = 0;
        
        try{
            if(this._isOpening && this.isOpeningCount){
                this.openTime++;
                if(this.openTime>this.maxOpenTime){
                    this.isOpeningCount=false;
                    this._removeTips();
                    return;
                }else if(this._tipList.length>0&&this.openTime>this.minOpenTime){
                    this.isOpeningCount=false;
                    this._removeTips();
                    return;
                }
            }
        }catch(e){
            if(this.node){
                this.node.active=false;
            }
            cc.log("ShowTips",e);
        }
        
    }
}
