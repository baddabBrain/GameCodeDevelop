/*
 * File: StateMachine.ts
 * Project: Tools
 * Description: 简单的状态机
 * File Created: Friday, 20th March 2020 2:14:20 pm
 * Author: chenguanhui (chenguanhui@moxigame.cn)
 * -----
 * Last Modified: Friday, 20th March 2020 2:26:30 pm
 * -----
 * Copyright <<2020>> - 2020 moxigame
 */

module MX.Tools {

    export class State<T>{
        public readonly stateName : T;
        public readonly onStart : Function;
        public readonly onStop : Function;

        constructor( stateName : T,  onStart : Function,  onStop : Function) {
            this.onStart = onStart;
            this.onStop = onStop;
            this.stateName = stateName;
        }
    }

    export class StateMachine<T>{
        
        private readonly  _stateDictionary : Map<T, State<T>>;
        private _currentState : State<T>;

        constructor(){
            this._stateDictionary = new Map<T, State<T>>();
        }

        public get currentState() : T{
            return this._currentState.stateName;
        }

        public set currentState(value : T){
            this.setState(value);
        }

        public addState(stateName : T,  onStart : Function, onStop : Function) : void{
            this._stateDictionary.set(stateName, new State(stateName, onStart, onStop));
        }

        public setState( newState : T) : void{
            if (this._currentState != null && this._currentState.onStop != null){
                this._currentState.onStop();
            }

            this._currentState = this._stateDictionary.get(newState);

            if (this._currentState.onStart != null){
                this._currentState.onStart();
            }
        }
    }

}