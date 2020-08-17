import { EventObject } from "./EventObject";

/*
 * @Description: 全局事件管理器
 * @Author: chenguanhui
 * @Date: 2019-08-13 19:00:12
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-19 19:46:37
 */

export default class EventMgr extends EventObject {
    private static _inst : EventMgr;
    public static get inst(): EventMgr {
        return EventMgr._inst ||(EventMgr._inst = new EventMgr());
    }

    private constructor() {
        super();
    }
}

// 导出方便调用
//export let  eventMgr : EventMgr = EventMgr.inst;