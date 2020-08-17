import { NetApi, iloginRetInfo } from "./NetApi";
import { NetBase } from "./NetBase";
import { SeEnumTaskeTaskType } from "../Table/interface";
import Utils from "../Framework/Utils/Utils";



export class Net extends NetBase {

    /**
     * 登录
     * @param accountName 
     */
    public static login(accountName: string, inviterId?: string): Promise<any> {
        return this.post(NetApi.Apis.login, {}, { name: accountName, inviterId: inviterId });
    }


    /**
     * 获取玩家数据
     */
    public static getInfo(): Promise<any> {
        return this.post(NetApi.Apis.getinfo, {}, {});
    }

    // /**
    //  * 游戏结算
    //  * @param levelId 
    //  * @param score 
    //  */
    // public static sendGameOver(levelId: string, isSuccess: boolean, score: number, taskActions: Map<SeEnumTaskeTaskType, number>, raceActions: validateRaceInfo): Promise<iGameOverRet> {
    //     return this.post(NetApi.Apis.sendGameOver, {}, { levelId: levelId, isSuccess: isSuccess, score: score, taskActions: JSON.stringify(Utils.map2Obj(taskActions)), raceActions: JSON.stringify(raceActions) });
    // }

    /**
     * 淘宝登录
     * @param info 
     */
    public static loginCheck(info: any, inviterId?: string): Promise<any> {
        return this.post(NetApi.Apis.logincheck, {}, { info: info, inviterId: inviterId });
    }
}



export enum ErrorCode {
    ok = 0,
    param_error = 1,
    appid_error = 2,
    session_key_error = 3,

    db_not_ready = 10,
    db_error = 11,

    account_no = 1001,
    account_passwd_error = 1002,
    account_exist = 1003,

    account_load_error = 1010,

    api_error = 2001,
    api_query_error = 2002,
    api_result_error = 2003,

    //榜单业务
    rank_error = 5000,
    rank_active_not_open = 5010,
    rank_active_not_exist = 5011,

    role_no = 10001,
    role_exist = 10004,
    role_token_error = 10005,
    role_no_mail = 10006,
    role_no_taskId = 10007,
    role_no_taskType = 10008,

    login_error = 10011,

    // 任务
    task_can_not_reward = 10031,
    task_not_found = 10032,

}
