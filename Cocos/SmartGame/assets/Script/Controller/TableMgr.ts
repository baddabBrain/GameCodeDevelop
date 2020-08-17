import TeMap from "../Framework/Sys/TeMap";
import { LoadMgr } from "../Framework/Res/LoadMgr";
// import { SeResBlock, SeEnumBlockeLevel, SeEnumBlockeProperty, SeResCombinationeffect, SeResCheckpoint, SeResGlobal, SeResTask, SeResItem, SeEnumItemeItemName, SeResTeamAward, SeResFunctionOpen, SeResProgressAward, SeResShare, SeEnumShareePos, SeResBuyItem, SeEnumBuyItemeScene, SeResRandomDrop, SeResAchievement, SeResUnlockPreview } from "../Table/interface";
import MD5 from "../Framework/Utils/MD5";

// /*
//  * @Description: 表格管理类器
//  * @Author: chenguanhui
//  * @Date: 2019-08-09 17:28:57
//  * @LastEditors: chenguanhui
//  * @LastEditTime: 2019-08-22 14:59:10
//  */


 export default class TableMgr {

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

            LoadMgr.loadJSON("Config/_filelist_", (err, jsonAsset) => {

                this._all_table_list = jsonAsset.json._files_ || [];

                this._loadTableRes(() => {
                    resolve();
                });
            });
        })
    }

    private _completeCallback !: Function;
    private _loadTableRes(callback: Function): void {

        this._completeCallback = callback;

        var loadFun: Array<Function> = [];

        //---> 表格加载初始化逻辑 S----
        // loadFun.push(this._initBlock);
        // loadFun.push(this._initComboList);
        // loadFun.push(this._initCheckPoint);
        // loadFun.push(this._initGlobal);
        // loadFun.push(this._initTask);
        // loadFun.push(this._initItems);
        // loadFun.push(this._initTeamAward);
        // loadFun.push(this._initFunctionOpen);
        // loadFun.push(this._initProgressAward);
        // loadFun.push(this._initShare);
        // loadFun.push(this._initBuyItem);
        // loadFun.push(this._initAchievement);
        // loadFun.push(this._initunlockPreview);
        //---> 表格加载初始化逻辑 E----

        this._iTotalLoad = loadFun.length;

        for (var i = 0; i < loadFun.length; i++) {
            var rkFun = loadFun[i].bind(this);
            rkFun();
        }

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
        // LoadMgr.loadJSON(url, (err, jsonAsset) => {
        //     callback && callback(err, jsonAsset);
        //     this._onInitOver();
        // });
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

//     /**
//      * 任务  Block
//      */
//     private _block: TeMap<SeResBlock> = new TeMap<SeResBlock>();

//     private _initBlock(): void {
//         this.loadTable('Config/Block', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; ++i) {
//                 let item: SeResBlock = jsonAsset.json[items[i]];
//                 this._block.set(item.sID, item);
//             }
//         });
//     }

//     public getBlockRes(id: string): SeResBlock {
//         return this._block.get(id);
//     }

//     public hasProperty(id: string, property: SeEnumBlockeProperty) {
//         let res = this._block.get(id);
//         if (res && ((res.eProperty & property) == res.eProperty)) {
//             return true;
//         }

//         return false;
//     }

//     public hasElminateRole(id: string) {
//         let res = this._block.get(id);
//         if (res && res.eProperty)
//             return true;
//         else
//             return false;
//     }

//     public hasCheckedRole(id: string, property: SeEnumBlockeProperty) {
//         let res = this._block.get(id);
//         if (res && res.eProperty == property)
//             return true;
//         else
//             return false;
//     }

//     public getElimBlocks(iCount?: number): string[] {
//         let result: string[] = [];
//         let keys = this._block.keys;
//         for (let i = 0; i < keys.length; i++) {
//             let key = keys[i];
//             let res = this._block.get(key);
//             if (res && this.hasProperty(key, SeEnumBlockeProperty.ChangGuiXiaoChu)) {
//                 result.push(key);
//                 if (iCount && result.length >= iCount) {
//                     break;
//                 }
//             }
//         }

//         return result;
//     }

//     /**
//      * 组合效果
//      */
//     private _comboList: TeMap<SeResCombinationeffect> = new TeMap<SeResCombinationeffect>();

//     private _initComboList(): void {
//         this.loadTable('Config/Combinationeffect', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; ++i) {
//                 let item: SeResCombinationeffect = jsonAsset.json[items[i]];
//                 this._comboList.set(item.sID, item);
//             }
//         });
//     }

//     public getComboEffect(combo1: number, combo2: number): string {
//         let keys = this._comboList.keys;
//         let combo: string = null;
//         for (let i = 0; i < keys.length; i++) {
//             let key = keys[i];
//             let res = this._comboList.get(key);
//             if (res && res.iComID1 == combo1 && res.iComID2 == combo2) {
//                 combo = res.sID;
//             }
//         }
//         return combo;
//     }

//     /**
//      * 关卡表
//      */
//     private _checkpoint: TeMap<SeResCheckpoint> = new TeMap<SeResCheckpoint>();
//     private _checkpointMD5: string = "";

//     private _initCheckPoint(): void {
//         this.loadTable('Config/Checkpoint', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             this._checkpointMD5 = new MD5().hex_md5(JSON.stringify(jsonAsset.json));
//             for (let i = 0; i < items.length; ++i) {
//                 let item: SeResCheckpoint = jsonAsset.json[items[i]];
//                 this._checkpoint.set(item.sID, item);
//             }
//         })
//     }

//     public getCheckPoint(id: string): SeResCheckpoint {
//         return this._checkpoint.get(id);
//     }

//     public getCheckPointMD5(): string {
//         return this._checkpointMD5;
//     }

//     public getAllLevels(): Array<SeResCheckpoint> {
//         let ret: Array<SeResCheckpoint> = [];
//         let keys: Array<string> = this._checkpoint.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             ret.push(this._checkpoint.get(keys[i]));
//         }
//         return ret;
//     }

//     public getLevelCount(): number {
//         return this._checkpoint.keys.length;
//     }

//     /**
//    * 获取下一个有奖励得关卡
//    * @param curLevel 
//    */
//     public getNextRewardLevelInfo(curLevel: number): SeResCheckpoint {
//         let maxLevel: number = TableMgr.inst.getLevelCount();
//         for (let l: number = curLevel; l < maxLevel; ++l) {
//             let info: SeResCheckpoint = TableMgr.inst.getCheckPoint(l.toString());
//             if (info && info.akReward && info.akReward.length > 0) {
//                 return info;
//             }
//         }
//         return null;
//     }



//     /**
//      * 全局配置文件
//      */
//     private _globalConfig: TeMap<SeResGlobal> = new TeMap<SeResGlobal>();

//     private _initGlobal(): void {
//         this.loadTable('Config/Global', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; ++i) {
//                 let item: SeResGlobal = jsonAsset.json[items[i]];
//                 this._globalConfig.set(item.kGlobalType, item);
//             }
//         })
//     }

//     public getGlobalConfig(key: string): string {
//         let config: SeResGlobal = this._globalConfig.get(key);
//         return config ? config.kGlobalData : "";
//     }


//     /**
//      * 任务
//      */
//     private _task: TeMap<SeResTask> = new TeMap<SeResTask>();

//     private _initTask(): void {
//         this.loadTable('Config/Task', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; ++i) {
//                 let item: SeResTask = jsonAsset.json[items[i]];
//                 this._task.set(item.sID, item);
//             }
//         })
//     }

//     public getAllTask(): Array<SeResTask> {
//         let list: Array<SeResTask> = [];
//         let keys: Array<string> = this._task.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             list.push(this._task.get(keys[i]));
//         }
//         return list;
//     }

//     public getTaskInfo(taskId: string): SeResTask {
//         let keys: Array<string> = this._task.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             let info: SeResTask = this._task.get(keys[i]);
//             if (info.sID == taskId) {
//                 return info;
//             }
//         }
//         return null;
//     }

//     /**
//      * 道具 
//      */
//     private _items: TeMap<SeResItem> = new TeMap<SeResItem>();

//     private _initItems(): void {
//         this.loadTable('Config/Item', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; ++i) {
//                 let item: SeResItem = jsonAsset.json[items[i]];
//                 this._items.set(item.kID, item);
//             }
//         })
//     }

//     public getItemInfoById(id: string): SeResItem {
//         let keys: Array<string> = this._items.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             let info: SeResItem = this._items.get(keys[i]);
//             if (info && info.kID == id) {
//                 return info;
//             }
//         }

//         return null;
//     }

//     public getItemInfo(type: SeEnumItemeItemName): SeResItem {

//         let keys: Array<string> = this._items.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             let info: SeResItem = this._items.get(keys[i]);
//             if (info && info.eItemName == type) {
//                 return info;
//             }
//         }

//         return null;
//     }

//     public getItemIdByType(type: SeEnumItemeItemName): string {
//         let itemInfo: SeResItem = this.getItemInfo(type);
//         if (itemInfo) {
//             return itemInfo.kID;
//         }
//         return "";
//     }

//     /**
//      * 队伍奖励
//      *
//      * @private
//      * @type {TeMap<SeResTeamAward>}
//      * @memberof TableMgr
//      */
//     private _teamReward: TeMap<SeResTeamAward> = new TeMap<SeResTeamAward>();

//     public _initTeamAward(): void {
//         this.loadTable('Config/TeamAward', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; ++i) {
//                 let item: SeResTeamAward = jsonAsset.json[items[i]];
//                 this._teamReward.set(item.sID, item);
//             }
//         })
//     }

//     public getTeamRewardInfo(id: string): SeResTeamAward {
//         return this._teamReward.get(id);
//     }

//     public getTeamRewardInfoByDay(day: number): SeResTeamAward {
//         let keys: Array<string> = this._teamReward.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             let info: SeResTeamAward = this._teamReward.get(keys[i]);
//             if (info && info.iDays == day) {
//                 return info;
//             }
//         }

//         return null;

//     }

//     /**
//      * 功能开放
//      */
//     private _functionOpen: TeMap<SeResFunctionOpen> = new TeMap<SeResFunctionOpen>();

//     private _initFunctionOpen(): void {
//         this.loadTable('Config/FunctionOpen', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; ++i) {
//                 let item: SeResFunctionOpen = jsonAsset.json[items[i]];
//                 this._functionOpen.set(item.eFunction, item);
//             }
//         })
//     }

//     public getAllFunctionOpen(): TeMap<SeResFunctionOpen> {
//         return this._functionOpen;
//     }

//     public getFunctionOpenByType(type: string) {
//         return this._functionOpen.get(type) || null;
//     }

//     /**
//      * 三星关卡奖励
//      */
//     private _progressAward: TeMap<SeResProgressAward> = new TeMap<SeResProgressAward>();

//     private _initProgressAward(): void {
//         this.loadTable('Config/ProgressAward', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; i++) {
//                 let item: SeResProgressAward = jsonAsset.json[items[i]];
//                 this._progressAward.set(item.iGear, item);
//             }
//         })
//     }

//     public getAllProgressAward(): TeMap<SeResProgressAward> {
//         return this._progressAward;
//     }

//     /**
//      * 分享
//      */

//     private _share: TeMap<SeResShare> = new TeMap<SeResShare>();

//     private _initShare(): void {
//         this.loadTable('Config/Share', (err, jsonAsset) => {
//             let shares: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < shares.length; i++) {
//                 let share: SeResShare = jsonAsset.json[shares[i]];
//                 this._share.set(share.sID, share);
//             }
//         })
//     }

//     public getShareInfoById(id: string): SeResShare {
//         let keys: Array<string> = this._share.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             let info: SeResShare = this._share.get(keys[i]);
//             if (info && info.sID == id) {
//                 return info;
//             }
//         }
//         return null;
//     }

//     public getShareInfo(type: SeEnumShareePos): SeResShare {
//         let keys: Array<string> = this._share.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             let info: SeResShare = this._share.get(keys[i]);
//             if (info && info.ePos == type) {
//                 return info;
//             }
//         }
//         return null;
//     }

//     public getShareIdByType(type: SeEnumShareePos): string {
//         let itemInfo: SeResShare = this.getShareInfo(type);
//         if (itemInfo) {
//             return itemInfo.sID;
//         }
//         return "";
//     }

//     /**
//      * 商店表
//      */
//     private _BuyItem: TeMap<SeResBuyItem> = new TeMap<SeResBuyItem>();

//     private _initBuyItem(): void {
//         this.loadTable('Config/BuyItem', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; i++) {
//                 let item: SeResBuyItem = jsonAsset.json[items[i]];
//                 this._BuyItem.set(item.sID, item);
//             }
//         })
//     }


//     public getBuyItemByInfo(sceneType: SeEnumBuyItemeScene, iSequence: number): SeResBuyItem {
//         let keys = this._BuyItem.keys;
//         for (let i = 0; i < keys.length; i++) {
//             let item: SeResBuyItem = this._BuyItem.get(keys[i])
//             if (sceneType == item.eScene && iSequence == item.iSequence) {
//                 return item;
//             }
//         }
//         return null;
//     }

//     /**
//      * 成就表
//      */
//     private _Achievement: TeMap<SeResAchievement> = new TeMap<SeResAchievement>();

//     private _initAchievement(): void {
//         this.loadTable('Config/Achievement', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; i++) {
//                 let item: SeResAchievement = jsonAsset.json[items[i]];
//                 this._Achievement.set(item.sID, item);
//             }
//         })
//     }

//     public getAllAchievement(): Array<SeResAchievement> {
//         let list: Array<SeResAchievement> = [];

//         let keys = this._Achievement.keys;
//         for (let i = 0; i < keys.length; i++) {
//             list.push(this._Achievement.get(keys[i]));
//         }
//         return list
//     }

//     /**
//      * 新元素预告表
//      */

//     private _unlockPreview: TeMap<SeResUnlockPreview> = new TeMap<SeResUnlockPreview>();

//     private _initunlockPreview(): void {

//         this.loadTable('Config/UnlockPreview', (err, jsonAsset) => {
//             let items: Array<string> = Object.keys(jsonAsset.json);
//             for (let i = 0; i < items.length; i++) {
//                 let item: SeResUnlockPreview = jsonAsset.json[items[i]];
//                 this._unlockPreview.set(item.sID, item);
//             }

//         })
//     }

//     public getunlockPreviewInfoByLevel(level: number): SeResUnlockPreview {
//         let keys = this._unlockPreview.keys;
//         for (let i = 0; i < keys.length; i++) {
//             let item: SeResUnlockPreview = this._unlockPreview.get(keys[i]);
//             if (item && item.iUnlockLevel >= level) {
//                 return item;
//             }
//         }
//         return null;
//     }
}