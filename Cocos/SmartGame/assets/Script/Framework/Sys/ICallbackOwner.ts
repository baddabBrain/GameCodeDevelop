/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-13 19:01:58
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-13 19:03:37
 */


 /**
  * 回调函数持有者 提供安全检测
  */
export default interface ICallbackOwner{
    /**
     * 持有者是否有效
     */
    isLive() : boolean;
    
    /**
     * 持有者名字
     */
    getName() : string;
}
