import TeMap from "../Framework/Sys/TeMap";
import MD5 from "../Framework/Utils/MD5";
import { resLoader } from "../Framework/Res/ResLoader";
import { SeResUnit } from "../Table/interface";

/*
 * @Description: 表格管理类器
 * @Author: chenguanhui
 * @Date: 2019-08-09 17:28:57
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-22 14:59:10
 */


class TableMgr {

    private static _inst: TableMgr;
    public static get inst(): TableMgr {
        if (!this._inst) {
            this._inst = new TableMgr();
        }
        return this._inst;
    }

    // 禁止外部构造对象
    private constructor() {

    }

    private _channelName: string = '';
    private _all_table_list: string[] = [];
    private _isLoaded: boolean = false;
    private _iTotalLoad: number = 0;
    private _iLoadNum: number = 0;

    /**
     * 设置渠道
     *
     * @param {string} channelName
     * @memberof TableMgr
     */
    public setChannel(channelName: string): void {
        this._channelName = channelName;
    }

    async loadTableRes(): Promise<void> {

        if (this._isLoaded) {
            return;
        }
        this._isLoaded = true;

        return new Promise((resolve) => {

            resLoader.loadRes("Config/_filelist_", cc.JsonAsset, (err, jsonAsset) => {

                this._all_table_list = jsonAsset.json._files_ || [];

                this._loadTableRes(() => {
                    resolve();
                });
            });
        })
    }


    private select_channel_file(url: string) {
        var index1 = url.lastIndexOf('/');
        var fname = url.slice(index1 + 1);
        var plt_fname = fname + '_' + this._channelName;
        if (this._all_table_list.indexOf(plt_fname + '.json') >= 0) {
            return url.slice(0, index1 + 1) + plt_fname;
        }
        else {
            return url;
        }
    }

    private loadTable(url: string, callback: Function): void {
        url = this.select_channel_file(url);
        let self = this;
        cc.loader.loadRes(url, cc.JsonAsset, (err, jsonAsset) => {
            if (err) {
                cc.error(`failed to load ${url}: ${err}`);
            } else {
                if (callback) {
                    try {
                        callback(null, jsonAsset);
                    } catch (e) {
                        cc.error('loadTable->', e + ' res:' + url);
                    }
                }
            }
            self._onInitOver();
        });
    }

    private _onInitOver(): void {
        if (this._iLoadNum >= this._iTotalLoad) {
            console.error('资源加载数量对不上了，注意修改');
            return;
        }

        //var value = this._iLoadNum / this._iTotalLoad;
        this._iLoadNum++;

        if (this._iLoadNum >= this._iTotalLoad) {
            this._completeCallback && this._completeCallback();
        }
    }

    private _completeCallback !: Function;
    private _loadTableRes(callback: Function): void {

        this._completeCallback = callback;

        var loadFun: Array<Function> = [];

        //---> 表格加载初始化逻辑 S----
        loadFun.push(this._initUnit);
        //---> 表格加载初始化逻辑 E----

        this._iTotalLoad = loadFun.length;

        for (var i = 0; i < loadFun.length; i++) {
            var rkFun = loadFun[i].bind(this);
            rkFun();
        }

    }



    /**
     * 单位表格
     */
    private _units: TeMap<SeResUnit> = new TeMap<SeResUnit>();

    private _initUnit(): void {
        this.loadTable('Config/Unit', (err, jsonAsset) => {
            let items: Array<string> = Object.keys(jsonAsset.json);
            for (let i = 0; i < items.length; ++i) {
                let item: SeResUnit = jsonAsset.json[items[i]];
                this._units.set(item.sID, item);
            }
        });
    }

    public getUnitInfo(id: string): SeResUnit {
        return this._units.get(id);
    }

}

export let TABLE : TableMgr = TableMgr.inst;