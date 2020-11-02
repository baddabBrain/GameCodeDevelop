

/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-15 17:31:56
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-19 14:07:49
 */

export class HttpRequest {

   /**
    * 发送http get请求
    * @param url 
    * @param params 
    * @param headers 
    * @param timeout 
    */
    public static get(url: string, params: any, headers: Object = { "Content-Type": "application/json" }, timeout: number = 5): Promise<{}> {
        return this._doHttp(this._combURL(url, params), {}, headers, "GET", timeout);
    }

    /**
     * 发送http post 请求
     * @param url 
     * @param params 
     * @param data 
     * @param header 
     * @param timeout 
     */
    public static post(url: string, params: Object, data: Object, header: Object = { "Content-Type": "application/json" }, timeout: number = 5): Promise<{}> {
        return this._doHttp(this._combURL(url, params), data, header, "POST", timeout);
    }

    /**
     * 发送请求
     * @param url 
     * @param headers 
     * @param params 
     * @param method 
     * @param cb 
     */
    private static _doHttp(url: string, data: Object, headers: Object, method: string, timeout: number): Promise<{}> {


        let promise: Promise<{}> = new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            xhr.responseType = "text";

            xhr.onreadystatechange = () => {
                cc.log(`HttpMgr, onReadyStateChange, readyState=${xhr.readyState}, status=${xhr.status}`);
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                    cc.log(`HttpMgr, onReadyStateChange, responseText=${xhr.responseText}`);

                    let res: any = {};
                    try {
                        res = JSON.parse(xhr.responseText);
                    } catch (e) {
                        cc.error(e);
                    }

                    this._removeXhrEvent(xhr);

                    resolve(res);
                }
            };


            xhr.ontimeout = () => {
                cc.warn(`${url}, request ontimeout`);
                this._removeXhrEvent(xhr);

                reject();
            };


            xhr.onerror = () => {
                cc.warn(`${url}, request onerror`);
                this._removeXhrEvent(xhr);

                reject();
            };

            xhr.onabort = () => {
                cc.warn(`${url}, request onabort`);
                this._removeXhrEvent(xhr);

                reject();
            };

            cc.log(`HttpMgr, doHttp url=${url}, method=${method}`);

            xhr.open(method, url, true);

            if (headers) {
                this._setHttpHeaders(xhr, headers);
            }

            if (cc.sys.isNative) {
                this._setHttpHeaders(xhr, { "Accept-Encoding": "gzip,deflate" });
            }

            if (data && typeof data === "object") {
                xhr.send(JSON.stringify(data));
                // xhr.send(this._combData(data));
            } else {
                xhr.send();
            }

        });

        return promise;
    }

    /**
     * 组合url
     * @param {string} url 
     * @param {Object} data 请求数据
     */
    private static _combURL(url: string, data: Object): string {
        url += '?';
        Object.keys(data).forEach((key: string) => {
            url += `${key}=${data[key]}&`;
        });
        return url.slice(0, url.length - 1);
    }


     /**
     * 组合data
     * @param {string} url 
     * @param {Object} data 请求数据
     */
    private static _combData( data: Object): string {
        let url : string = '';
        Object.keys(data).forEach((key: string) => {
            url += `${key}=${data[key]}&`;
        });
        return url.slice(0, url.length - 1);
    }

    /**
     * 移除事件
     * @param xhr 
     */
    private static _removeXhrEvent(xhr: XMLHttpRequest) {
        xhr.ontimeout = null;
        xhr.onerror = null;
        xhr.onabort = null;
        xhr.onreadystatechange = null;
    }

    /**
     * 设置hhtp请求头
     * @param xhr 
     * @param headers 
     */
    private static _setHttpHeaders(xhr: XMLHttpRequest, headers): void {
        for (let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }
    }
}

