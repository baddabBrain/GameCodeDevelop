/*
 * @Description: 事件ID定义
 * @Author: chenguanhui
 * @Date: 2019-08-13 19:31:22
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-13 19:31:49
 */

export const EventId = {

    /**
     * 切换场景
     */
    CHANGE_SCENE: 'EventId.CHANGE_SCENE',

    /**
     * 确认框确认选择
     */
    EVENT_CONFIRM: 'EventId.EVENT_CONFIRM',

    /**
     * UI打开事件
     */
    ON_UI_OPEN: 'EventId.EVENT_ON_UI_OPEN',

    /**
     * UI关闭事件
     */
    ON_UI_CLOSE: 'EventId.EVENT_ON_UI_CLOSE',

    /**
    * 更新加载进度
    */
    ON_UPDATE_LOADING_PROGRESS: 'EventId.ON_UPDATE_LOADING_PROGRESS',

    /**
     * 更新加载提示
     */
    ON_UPDATE_LOADING_TTP: 'EventId.ON_UPDATE_LOADING_TTP',

    /** 
     * 登录返回
    */
    ON_LOGIN_RET: 'EventId.ON_LOGIN_RET',




    /**
    * 逻辑变化通知客户端更新
    */
    ON_L2C_START_GAME: "EventId.ON_L2C_START_GAME",
    ON_L2C_RESTART_GAME: "EventId.ON_L2C_RESTART_GAME",
    ON_L2C_ELIM_ERROR: "EventId._ON_L2C_ELIM_ERROR",
    ON_L2C_USE_PROP_ERROR: "EventId.ON_L2C_USE_PROP_ERROR",//使用道具失败
    ON_L2C_RESULT: "EventId.ON_L2C_RESULT",
    ON_L2C_CANTFIND: 'EventId.ON_L2C_CANTFIND',


    // 客户端内部通信

    /**
     * 重新开始游戏
     */
    ON_GAME_RESTART: 'EventId.ON_GAME_RESTART',

    /**
     * 客户端内部通知游戏结束
     */
    ON_GAME_FINISH: 'EventId.ON_GAME_FINISH',
}