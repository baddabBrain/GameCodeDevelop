/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-14 10:43:38
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-14 10:45:08
 */


/**
 * key <---> value 字典
 */
export default class TeMap<T>{
    _data: Object = {};

    constructor(_data?: Object) {
        if (_data) {
            this._data = _data;
        }
    }

    has(key: string | number) {
        if (key == undefined || key == null) return false;
        return this._data.hasOwnProperty(key.toString());
    }
    get(key: string | number) {
        if (key == undefined || key == null) return null;
        return <T>this._data[key.toString()]
    }

    set(key: string | number, v: T) {
        this._data[key.toString()] = v;
    }

    get keys() {
        return Object.keys(this._data);
    }

    get_keys() {
        return this.keys;
    }

    del(key: string | number) {
        delete this._data[key.toString()];
    }

    rand() {
        var keys = this.keys;
        var tid = keys[Math.floor(Math.random() * keys.length)];
        return this.get(tid);
    }

    clear() {
        this._data = {};
    }

    getLength(){
        return this.keys.length;
    }
}