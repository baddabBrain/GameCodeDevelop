

/*
 * @Description: 加载管理器
 * @Author: chenguanhui
 * @Date: 2019-08-13 19:48:19
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-20 12:52:57
 */

export class LoadMgr {

    private static loadSyncCache = {};

    /**
     * 加载prefab
     * @param url 
     * @param completeCallback
     */
    public static loadPrefab(url: string, completeCallback: (error: Error, resource: any) => void = null) {
        if (!url) {
            cc.error('loadPrefab url=null')
            return;
        }

        if (LoadMgr.loadSyncCache[url] !== null && LoadMgr.loadSyncCache[url] !== undefined) {
            cc.log('loadPrefabSync is loading');
            return;
        }

        LoadMgr.loadSyncCache[url] = true;
        LoadMgr._loadResource('loadPrefab', url, cc.Prefab, completeCallback);
    }

    /**
     * 加载sprite
     * @param url 
     * @param completeCallback 
     * @param owner 
     */
    public static loadSpriteFrame(url: string, completeCallback: (error: Error, ret: any) => void = null): void {

        if (!url) {
            cc.error('loadSpriteFrame url=null')
            return;
        }

        if (url) {
            let escapedUrl = url.replace(/^resources\//, '').replace(/(.*)\.[^/]+$/, '$1');
            LoadMgr._loadResource('loadSpriteFrame', escapedUrl, cc.SpriteFrame, completeCallback);
        }
    }


    /**
     * 加载JSON
     * @param url 
     * @param completeCallback 
     * @param owner 
     */
    public static loadJSON(url: string, completeCallback: (error: Error, ret: any) => void = null): void {

        if (!url) {
            cc.error('loadJSON url=null')
            return;
        }

        if (url) {
            let escapedUrl = url.replace(/^resources\//, '').replace(/(.*)\.[^/]+$/, '$1');
            LoadMgr._loadResource('loadJSON', escapedUrl, cc.JsonAsset, completeCallback);
        }
    }

    /**
     * 加载资源
     * @param funName 
     * @param url 
     * @param type 
     * @param completeCallback 
     * @param owner 
     */
    private static _loadResource(funName: string, url: string, type: typeof cc.Asset, completeCallback: (err: Error, ret: any) => void = null): boolean {
        if (!url) return false;

        // 已经加载过了就不用再加载了
        let asset: any = cc.loader.getRes(url, type);
        if (asset !== null && typeof (asset) !== undefined) {

            delete LoadMgr.loadSyncCache[url];
            LoadMgr.loadSyncCache[url] = null;

            if (completeCallback) {
                try {
                    completeCallback(null, asset);
                } catch (e) {
                    LoadMgr.errorFunction(funName + '->loadResource()', e + ' res:' + url);
                }
            }
        } else {
            // 没有加载过就加载好了
            cc.loader.loadRes(url, type, function (err, ret) {
                delete LoadMgr.loadSyncCache[url];
                LoadMgr.loadSyncCache[url] = null;
    
                if (err) {
                    cc.error(`failed to load ${url}: ${err.message}`);
                } else {
                    if (completeCallback) {
                        try {
                            completeCallback(null, ret);
                        } catch (e) {
                            LoadMgr.errorFunction(funName + '->loadResource()', e + ' res:' + url);
                        }
                    }
                }
            });
        }
        
        return true;
    }

    /**
     * 加载远程资源
     */
    private static async _loadRemote(url: string, type?: string): Promise<any> {
        return new Promise((rs, rj) => {
            cc.loader.load(type ? { url: url, type: type } : url, function (err: Error | null, res: any) {
                if (err) {
                    rj(err);
                }
                else {
                    rs(res);
                }
            });
        })
    }

    /**
     * 加载远程图片资源
     */
    public static loadRemoteImg(url: string, type: string, onLoad?: (sf: cc.SpriteFrame) => void): cc.SpriteFrame {
        let output = new cc.SpriteFrame();
        this._loadRemote(url, type).then(tex => {
            output.setTexture(tex);
            onLoad && onLoad(output);
        })
        return output;
    }

    /**
     * 加载网络资源
     * @param path 
     * @param callback 
     * @param owner 
     */
    public static load(path: string, callback: (err, ret) => void) {

        if (!path) {
            LoadMgr.errorFunction('LoadMgr->load', 'param error');
            return;
        }

        let loadCallback = function (err, ret) {
            try {
                if (callback)
                    callback(err, ret);

            }
            catch (e) {
                LoadMgr.errorFunction('LoadMgr->load->callback', e + ' res:' + path);
            }
        }

        cc.loader.load(path, loadCallback);
    }

    /**
     * 加载目录
     * @param path 
     * @param type 
     * @param progressCallback 
     * @param completeCallback 
     */
    public static loadResourceDir(path: string, type: typeof cc.Asset,
        progressCallback: (completedCount: number, totalCount: number, item: any) => void,
        completeCallback: (error: Error, resource: any[], urls: string[]) => void) {

        if (!path) {
            LoadMgr.errorFunction('loadResourceDir', 'param error');
            return;
        }

        let progCallback = function (completedCount: number, totalCount: number, item: any) {
            try {
                if (progressCallback)
                    progressCallback(completedCount, totalCount, item);
            } catch (e) {
                LoadMgr.errorFunction('loadResourceDir->progressCallback', e + ' res:' + path);
            }

        }

        let compCallback = function (error: Error, resource: any[], urls: string[]) {
            try {
                if (completeCallback)
                    completeCallback(error, resource, urls);
            } catch (e) {
                LoadMgr.errorFunction('loadResourceDir->completeCallback', e + ' res:' + path);
            }
        }

        if (progressCallback) {
            cc.loader.loadResDir(path, type, progCallback, compCallback);
        } else {
            cc.loader.loadResDir(path, type, compCallback);
        }
    }

    /**
     * 加载多个资源
     * @param urlList 
     * @param progressCallback 
     * @param completeCallback 
     */
    public static loadResourceArray(urlList: string[], progressCallback: (completedCount: number, totalCount: number, item: any) => void,
        completeCallback?: (error: Error, resource: any[]) => void): void {

        if (!urlList || urlList.length == 0) {
            LoadMgr.errorFunction('loadResourceArray', 'param error');
            return;
        }
        let resDebug = urlList[0]
        let progCallback = function (completedCount: number, totalCount: number, item: any) {
            try {
                if (progressCallback)
                    progressCallback(completedCount, totalCount, item);

            } catch (e) {
                LoadMgr.errorFunction('loadResourceArray->progressCallback', e + ' res:' + resDebug);
            }
        }

        let compCallback = function (error: Error, resource: any[]) {
            try {
                if (completeCallback)
                    completeCallback(error, resource);
            } catch (e) {
                LoadMgr.errorFunction('loadResourceArray->completeCallback', e + ' res:' + resDebug);
            }
        }
        if (progressCallback) {
            cc.loader.loadResArray(urlList, progCallback, compCallback);
        } else {
            cc.loader.loadResArray(urlList, compCallback);
        }
    }

    private static errorFunction(funcName: string, errInfo: string) {
        cc.error(errInfo);
    }
};


// 导出方便使用
export let LOADER: LoadMgr = LoadMgr;