

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html



class ScheduleCallbackInfo{
    traget:any;
    callback:any;
    interval:number;
    repeat:number;
    delay:number;
    args:any;
    realCallback:Function;
}

export class ScheduleObject {


     /**
     * shcedule列表
     */
    private _scheduleList :  Map<Function, ScheduleCallbackInfo> = new Map<Function, ScheduleCallbackInfo>();

    /**
     * @en
     * Schedules a custom selector.<br/>
     * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.
     * @zh
     * 调度一个自定义的回调函数。<br/>
     * 如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
     * @method schedule
     * @param {function} callback 回调函数。
     * @param {Number} interval  时间间隔，0 表示每帧都重复。
     * @param {Number} repeat    将被重复执行（repeat+ 1）次，您可以使用 cc.macro.REPEAT_FOREVER 进行无限次循环。
     * @param {Number} delay     第一次执行前等待的时间（延时执行）。
     * @example
     * ```typescript
     * var timeCallback = function (dt) {
     *   cc.log("time: " + dt);
     * }
     * this.schedule(timeCallback, 1);
     * ```
     */
    public schedule (callback, target : any, interval: number = 0, repeat: number = cc.macro.REPEAT_FOREVER, delay: number = 0, ...args) {

        interval = interval || 0;
        repeat = isNaN(repeat) ? cc.macro.REPEAT_FOREVER : repeat;
        delay = delay || 0;

        const scheduler = cc.director.getScheduler();

        // should not use enabledInHierarchy to judge whether paused,
        // because enabledInHierarchy is assigned after onEnable.
        // Actually, if not yet scheduled, resumeTarget/pauseTarget has no effect on component,
        // therefore there is no way to guarantee the paused state other than isTargetPaused.
        const paused = scheduler.isTargetPaused(this);

        let scheduleInfo : ScheduleCallbackInfo = new ScheduleCallbackInfo();
        scheduleInfo.callback = callback;
        scheduleInfo.traget = target;
        scheduleInfo.interval = interval;
        scheduleInfo.repeat = repeat;
        scheduleInfo.delay = delay;
        scheduleInfo.args = args;
        scheduleInfo.realCallback = (dt)=>{
            let args = (scheduleInfo.args && scheduleInfo.args.filter((a)=>{return a!=undefined;})) || [];
            let callArgs = [dt].concat(args);
            try{
                if(scheduleInfo.callback){
                    scheduleInfo.callback.call(scheduleInfo.traget, ...callArgs);
                }
            } catch(e){
                cc.error(`schedule call back fail`);
            }
           
        }
        this._scheduleList.set(callback, scheduleInfo);

        scheduler.schedule(scheduleInfo.realCallback, this, scheduleInfo.interval, scheduleInfo.repeat, scheduleInfo.delay, paused);
    }

    /**
     * @en Schedules a callback function that runs only once, with a delay of 0 or larger.
     * @zh 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
     * @method scheduleOnce
     * @see [[cc.Node.schedule]]
     * @param {function} callback  回调函数。
     * @param {Number} delay  第一次执行前等待的时间（延时执行）。
     * @example
     * ```typescript
     * var timeCallback = function (dt) {
     *   cc.log("time: " + dt);
     * }
     * this.scheduleOnce(timeCallback, 2);
     * ```
     */
    public scheduleOnce (callback, delay: number = 0) {
        this.schedule(callback, 0, 0, delay);
    }

    /**
     * @en Unschedules a custom callback function.
     * @zh 取消调度一个自定义的回调函数。
     * @method unschedule
     * @see [[cc.Node.schedule]]
     * @param {function} callback_fn  回调函数。
     * @example
     * ```typescript
     * this.unschedule(_callback);
     * ```
     */
    public unschedule (callback_fn) {
        if (!callback_fn) {
            return;
        }

        let shceduleInfo : ScheduleCallbackInfo = this._scheduleList.get(callback_fn);
        if(!shceduleInfo){
            return;
        }

        cc.director.getScheduler().unschedule(shceduleInfo.realCallback, this);

        this._scheduleList.delete(callback_fn);
    }

    /**
     * @en
     * unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
     * Actions are not affected by this method.
     * @zh 取消调度所有已调度的回调函数：定制的回调函数以及 'update' 回调函数。动作不受此方法影响。
     * @method unscheduleAllCallbacks
     * @example
     * ```typescript
     * this.unscheduleAllCallbacks();
     * ```
     */
    public unscheduleAllCallbacks () {
        this._scheduleList.clear();
        cc.director.getScheduler().unscheduleAllForTarget(this);
    }

}
