export class NetApi {

    /**
     * 服务器地址
     */
    // public static baseURL: string = 'sandbox.platform.moxigame.cn/inside/clickeliminate/';
    // public static baseURL : string = '127.0.0.1:11090';

    /**
     * Api地址
     */
    public static Apis: { [key: string]: string } = {
        "login": '/game/local/login',
        'getTaskList': '/task/local/getTaskList',
        'getTaskReward': '/task/local/getTaskReward',
        'startLevel': '/game/local/startLevel',
        'sendGameOver': '/game/local/sendGameOver',
        'getStrength': '/game/local/getStrength',
        'getLevelReward': '/task/local/getLevelReward',
        'getTeamInfo': '/Team/local/getTeamInfo',
        'kickTeamMembers': '/Team/local/kickTeamMembers',
        'quitTeam': '/Team/local/quitTeam',
        'joinTeam': '/Team/local/joinTeam',
        'getTeamReward': '/Team/local/getTeamReward',
        'useProp': '/game/local/useProp',
        'wxlogin': '/weichat/local/wxlogin',
        'gmcommand': '/game/local/gmcommand',
        'getPropEmails': '/task/local/getPropEmails',
        'logincheck': '/game/local/logincheck',
        'getroleitems': '/game/local/getroleitems',
        'deletemail': '/task/local/deletemail',
        'getRankList': '/rank/local/getRankList',
        'getUserEmails': '/task/local/getUserEmails',
        'optmail': '/game/local/optmail',
        'getActivityLevelReward': '/task/local/getActivityLevelReward',
        'continueGame': '/game/local/continueGame',
        'getAdvAward': '/task/local/getAdvAward',
        'sendSubscribeMessage': '/weichat/local/wxAddSubscribeMessage',
        'BuyItem': '/game/local/buyItem',
        'getAchievementList': '/achievement/local/getAchievementList',
        'getAchievementAward': '/achievement/local/getAchievementAward',
        'wxUpdateUserInfo': '/weichat/local/wxUpdateUserInfo',
    }
}



export interface iRoleInfo {
    openId: string;
    gameId: string;
    gameInfo: any;
    gameCount: number;
    newMails: Array<any>;
    mailInfos: Array<any>;
    invateRewardCnt: number;
    avatarUrl: string;
    nickName: string;
    isNew: boolean;
    teamRewarded: Array<number>;
    activityLevel: number;
}

export interface iloginRetInfo {
    code: number;
    lastSaveTime: number;
    localTime: 1572341114108;
    role: iRoleInfo;
    token: string;
}


export interface iUnitInfo {
    avatarUrl: string,
    gameId: string,
    level: number,
    nickName: string,
}

export interface iRankInfo {
    idx: number,
    location: string,
    pltId: string,
    rankId: string,
    roleId: string,
    score: number,
    time: number,
    _idx: string,
    unitInfo: iUnitInfo,
}

export interface iRankList {
    code: number,
    info: { list: Array<iRankInfo> },
}



export interface ifMailContent {
    type: eMailFunctionType,
    date: number,
    title: string;
    content: string;
    rewardItems: Array<string>;
    read: boolean;
    claimed: boolean;
    extra?: any;
}
/**
 * 邮件功能类型
 */
export enum eMailFunctionType {
    /** 分享奖励体力 */
    ShareRewardStrength,
    /** 淘宝平台奖励提示 */
    TaobaoRewardTip,
}

export interface iContinueGame {
    code: number,
    items: { [itemId: string]: number };
}

export interface iAdvAward {
    code: number,
    items: { [itemId: string]: number };
    getItems: Array<{ itemId: string, count: number }>,
}

export interface achieveList {
    acId: string,
    awardStages: Array<number>,
    completeVaule: number,
    isUnlock: boolean,
}

export interface iAchievementInfo {
    code: number,
    taskList: Array<achieveList>,
}
