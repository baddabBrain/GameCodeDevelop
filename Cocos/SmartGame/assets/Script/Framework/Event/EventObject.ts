import Utils from "../Utils/Utils";


 /**
  * 事件回调信息
  */
 class CallbackEventInfo{
    type:string;
    name:string='';
    callback:any;
    realCallback:any;
    target:any;
    useCapture:boolean;
    args : any;
}


export class EventObject extends cc.EventTarget{

    public constructor() {
        super();
    }


    /**
     * 事件列表
     */
    private _eventList :{[key:string]:CallbackEventInfo[] } = {};


     /**
     * 响应事件
     * @param type 
     * @param callback 
     * @param target 
     * @param useCapture 
     */
    public on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean, ...args): T{

        if(this.findEvent(type, callback, target) != -1){
            return callback;
        }

        if(this._eventList[type] === undefined){
            this._eventList[type] = [];
        }

        let callInfo = new CallbackEventInfo();
        if(target instanceof cc.Component){
            let cpn :  cc.Component = <cc.Component>target;
            if(!Utils.isComponentLive(cpn)){
                cc.error('component is not live!');
                return;
            }
            callInfo.name = cpn.node.name;
        }



        callInfo.type=type;
        callInfo.callback=callback;
        callInfo.target=target;
        callInfo.useCapture=useCapture;
        callInfo.args = args;
        callInfo.realCallback = (...emitArgs)=>{
            let target = callInfo.target;
            try{
                let args = (callInfo.args && callInfo.args.filter((a)=>{return a!=undefined;})) || [];
                let emitArr = (emitArgs && emitArgs.filter((a)=>{return a!=undefined;})) || [];
                let callArgs = args.concat(emitArr);
                if (callInfo.callback && target){
                    if (target instanceof cc.Component){
                        let cpn : cc.Component = <cc.Component>target;
                        if (Utils.isComponentLive(cpn)){
                            callInfo.callback.call(target, ...callArgs);
                        }
                    }else{
                        callInfo.callback.call(target, ...callArgs);
                    }
                } else if(callInfo.callback){
                    callInfo.callback(...callArgs);
    
                }
            } catch(e){
                cc.error("EVENT.on callback faild!" + e);
            }
        }
        this._eventList[type].push(callInfo);
        

        if(super['on'])
            super['on'](type, callInfo.realCallback, target);
        else
           cc.error('新引擎版本 EventTarget 没on函数')

        if (target && target.__eventTargets)
            target.__eventTargets.push(this);

        return callback;
    }


    
     /**
      * 事件响应关闭
      * @param type 
      * @param callback 
      * @param target 
      */
     public off(type: string, callback?: Function, target?: any): void{
         if(!callback){
             delete this._eventList[type];
             super.off(type,undefined,undefined);
             return;
         }

         let idx = this.findEvent(type, callback, target);
         if(idx == -1)
             return;
         let eventArray = this._eventList[type];
         
         super.off(type, eventArray[idx].realCallback, target);
 
         eventArray.splice(idx, 1); 

         if(eventArray.length <= 0){
             delete this._eventList[type];
         }
     }

     /**
      * 关闭所有属于该对向的事件响应
      * @param target 
      */
     public targetOff(target : any) : void{
        if(!target || !this._eventList || Object.keys(this._eventList).length <= 0){
            return;
        }

        let eventKeys : string[] = Object.keys(this._eventList);
        for(let i : number = eventKeys.length - 1; i >= 0; --i){

            let type : string = eventKeys[i];
            let eventArray = this._eventList[type];

            if(!eventArray ||eventArray.length == 0){
                continue;
            }

            for(let j : number = eventArray.length - 1; j >= 0; --j){
                if(eventArray[j].target == target){
                    eventArray.splice(j, 1);
                }
            }

            if(eventArray.length <= 0){
                delete this._eventList[type];
            }
        }

        super.targetOff(target);
     }

    

    /**
     * 查找事件
     * @param type 
     * @param callback 
     * @param target 
     */
    private findEvent(type: string, callback?: Function, target?: any) : number{
        let eventArray = this._eventList[type];
        if(!eventArray ||eventArray.length == 0)
            return -1;
        for(let i=0;i<eventArray.length; i++){
            if(eventArray[i].callback===callback &&eventArray[i].target == target){
                return i;
            }
        }
        return -1;
    }

}