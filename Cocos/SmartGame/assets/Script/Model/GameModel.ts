import { SeResCheckpoint, SeEnumTaskeTaskType, SeEnumItemeItemName } from "../Table/interface";

//跟显示有关的数据，UI读这里的数据，像分数之类的更新都和动画有关，与逻辑上的数据更新不一致 by zxd
export class GameModel {

    private static _inst: GameModel = null;
    public static get inst(): GameModel {
        if (!this._inst) {
            this._inst = new GameModel();
        }
        return this._inst;
    }

    /** 游戏中的任务数据,暂时放客户端处理 */
    private _taskGameRecord: Map<SeEnumTaskeTaskType, number> = new Map<SeEnumTaskeTaskType, number>();

    private _gameType: string = null;

    /** 进入游戏的时间 */
    private _enterTime: number = null;

    /**  到结算了设为false,active的时候才可以发命令 */
    private _bGameActive = true;

    private _seed: number = 5;

    /** 开局道具 */
    private _gameStartItem: Array<boolean> = [false, false, false];

    setGameActive(bValue: boolean) {
        this._bGameActive = bValue;
    }

    isGameActive(): boolean {
        return this._bGameActive;
    }

    public setSeed(v: number): void {
        cc.log("startLevel seed:" + v);
        this._seed = v;
    }

    public getSeed(): number {
        return this._seed;
    }

    /**
     * 游戏初始化
     * 必须调一次setCurrentLevel
     */
    public init(level: string, type: string) {
    

 
        this._gameType = type;


        //设置进入的时间
        this.initEnterGameTime();

    }

    public getGameType(): string {
        return this._gameType;
    }


    /**
     * 更新进入游戏的时间
     */
    public initEnterGameTime(): void {
        this._enterTime = new Date().getTime();
    }

    public getEnterGameTime(): number {
        return this._enterTime;
    }
}
