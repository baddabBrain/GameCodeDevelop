import UIMgr from "./UIMgr";
import { UIType } from "../../Define/UIDef";
import { EventId } from "../../Define/EventId";
import EventMgr from "../Event/EventMgr";

/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-20 18:48:38
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-20 19:33:32
 */


 export class UIFacade {

    /**
     * 显示一个Toast
     * @param txt 
     */
    public static showToast(txt : string){
        UIMgr.inst.showToast(txt);
    }

    /**
     * 显示confirm
     */
    public static async showConfirm(content:string, confirmBtnTxt:string = "确认", cancelBtnTxt : string = "取消"):Promise<boolean>{
        return new Promise((rs,rj)=>{
            UIMgr.inst.open(UIType.Confirm, {content : content,confirmBtnTxt : confirmBtnTxt, cancelBtnTxt : cancelBtnTxt});
            EventMgr.inst.once(EventId.EVENT_CONFIRM,(isConfirm : boolean)=>{
                rs(isConfirm)
            });
        });
    }

    /**
     * 显示加载进度
     * @param title 
     */
    public static showLoading(title : string) : void{
        UIMgr.inst.showSceneLoadUI(title);
    }


    /**
     * 隐藏加载进度
     */
    public static hideLoading() : void{
        UIMgr.inst.hideSceneLoadUI();
    }
 }