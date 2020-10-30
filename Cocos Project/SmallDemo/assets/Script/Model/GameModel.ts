export enum GameStatus {
    Loading,
    Start,
    Pause,
    Stop,
}

export default class GameModel {

    private static _inst: GameModel = null;
    public static get inst(): GameModel {
        if (!this._inst) {
            this._inst = new GameModel();
        }
        return this._inst;
    }

    private _gameStatus: GameStatus = GameStatus.Loading;

    public getGameStatus(): GameStatus {
        return this._gameStatus;
    }

    public setGameStatus(value: GameStatus): void {
        if (this._gameStatus != value) {
            this._gameStatus = value;
        }
    }
}