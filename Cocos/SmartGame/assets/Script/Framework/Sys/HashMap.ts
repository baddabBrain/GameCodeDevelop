/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-14 10:44:39
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-14 10:44:54
 */

export default class HashMap<T>{
    _data = {};

    constructor(_data?: Object) {
        if (_data) {
            this._data = _data;
        }
    }

    get(key: string | number) {
        return <Array<T>>this._data[key] || []
    }

    add(key: string | number, v: T) {
        if (!this._data[key]) {
            this._data[key] = [];
        }

        this._data[key].push(v);
    }

    set(key: string | number, v: Array<T>) {
        this._data[key] = v;
    }

    get keys() {
        return Object.keys(this._data);
    }

    del(key: string | number) {
        delete this._data[key];
    }

    clear() {
        this._data = {};
    }
}