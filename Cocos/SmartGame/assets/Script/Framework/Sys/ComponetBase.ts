

/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-13 19:07:40
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-13 19:11:15
 */

import ICallbackOwner from "./ICallbackOwner";
const {ccclass, property} = cc._decorator;

/** Component 封装 
*/
@ccclass
export default class ComponentBase extends cc.Component  implements ICallbackOwner
{
 
    public isLive():boolean{
        if(!this) return false;
        if(!this.node) return false;
        if(!this.node.isValid) return false;
        if(!this.isValid) return false;
        return true;
    }

    public getName():string{
        if(!this.isLive()) return 'destroy';
        else return this.name;
    }
}