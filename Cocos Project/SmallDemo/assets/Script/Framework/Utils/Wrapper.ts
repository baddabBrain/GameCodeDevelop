/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-13 14:18:14
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-13 15:43:29
 */



class ScheduleInfo {
    name: string;
    cb: Function;
    tempCb: (dt) => void;
    target: any;
    repeat: number;
    repeatCur: number = 0;
}

export default class Wrapper {

    /**
     * 所有的计划任务列表
     */
    private static _scheduleList: ScheduleInfo[] = [];


    public static callFunc(selector: Function, selectorTarget?: any, data?: any): any {

        let func = function (sendData?: any) {
            try {
                if (selectorTarget) {
                    if (selector)
                        selector.call(selectorTarget, sendData);
                }
                else {
                    if (selector)
                        selector(sendData);
                }
            }
            catch (e) {
                console.error(e);
            }
        };
        return cc.callFunc(func, null, data);
    }


    public static scheduleFunction(bindTarget: any, callback: Function, interval?: number, repeat?: number, delay?: number) {

        if (!bindTarget || !bindTarget.isLive() || !callback) {
            console.error();
            return;
        }

        let msgInfo = new ScheduleInfo();
        msgInfo.target = bindTarget;
        msgInfo.name = bindTarget.getName();
        msgInfo.cb = callback;
        msgInfo.repeat = repeat;
        msgInfo.tempCb = (dt) => {
            try {
                if (msgInfo.cb && msgInfo.target.isLive()) {
                    msgInfo.cb.call(msgInfo.target, dt);
                }
                if (msgInfo.repeat !== cc.macro.REPEAT_FOREVER) {
                    ++msgInfo.repeatCur;
                    if (msgInfo.repeatCur >= msgInfo.repeat) {
                        this.unscheduleFunction(msgInfo.cb);
                    }
                }
            }
            catch (e) {
                let errInfo = bindTarget.getError(e, 'scheduleFunction');
                errInfo.customInfo = `interval?: ${interval}, repeat?: ${repeat}, delay?: ${delay}`;
                console.error(errInfo);
            }
        };

        bindTarget.schedule(msgInfo.tempCb, interval, repeat, delay);
        this._scheduleList.push(msgInfo);
    }


    public static unscheduleFunction(callback: Function) {
        for (let i = 0; i < this._scheduleList.length; i++) {
            let sche = this._scheduleList[i];
            if (sche.cb == callback) {

                if (sche.target.isLive()) {
                    let obj: cc.Component = sche.target;
                    obj.unschedule(sche.tempCb);
                }

                this._scheduleList.splice(i, 1);
                return;
            }
        }

    }


}