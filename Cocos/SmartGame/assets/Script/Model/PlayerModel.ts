import { LocalStorageMgr } from "../Framework/Storage/LocalStorageMgr";
import { iloginRetInfo, iRoleInfo } from "../Network/NetApi";
import { TAHelper } from "../Framework/Platforms/TAHelper";
import { Platform, PlatformType } from "../Framework/Platforms/Platform";


export class PlayerModel {
    private static _inst: PlayerModel;
    public static get inst(): PlayerModel {
        if (!this._inst) {
            this._inst = new PlayerModel();
        }
        return this._inst;
    }

    private _openId: string = "";
    private _gameId: string = '';
    private _token: string = '';

    /** 玩家昵称 */
    private _nickName: string = null;

    private _isNew: boolean = false;

    public getToken(): string {
        return this._token;
    }

    public setGameId(val: string): void {
        this._gameId = val;
        LocalStorageMgr.setHashID(this._gameId);
    }

    public getGameId(): string {
        return this._gameId;
    }

    public getPlayerId(): string {
        return this._gameId;
    }

    public getOpenId(): string {
        return this._openId;
    }

    /**
     * 初始化玩家数据
     * @param info 
     */
    public initPlayerData(info: iloginRetInfo): void {
        let roleInfo: iRoleInfo = info.role;

        this.setGameId(roleInfo.gameId);
        this._token = info.token;
        this._openId = roleInfo.openId;

        // 上报注册事件
        if (roleInfo.isNew) {
            TAHelper.reportEvent("Register", { RegisterType: Platform.getEnterParam("inviterId") ? 2 : 1 });
        }

        //玩家昵称
        this._nickName = roleInfo.nickName;

        //新手标记
        this._isNew = roleInfo.isNew;
    }

    public getIsNew(): boolean {
        return this._isNew;
    }


    public getPlayerNickName(): string {
        return this._nickName;
    }
}