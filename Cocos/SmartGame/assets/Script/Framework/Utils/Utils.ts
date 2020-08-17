import { UIType } from "../../Define/UIDef";

/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-13 15:08:24
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-21 19:46:50
 */

export default class Utils {

    /**
     * 检证一个节点是否有效
     * @param node 
     */
    static verifyNode(node: cc.Node): boolean {
        return (node !== undefined && node !== null && node.isValid);
    }


    /**
     * 检证一个组件是否有效
     * @param component 
     */
    static verifyComponent(component: cc.Component): boolean {
        if (component === undefined || component === null) return false;
        if (!component.isValid) return false;
        if (!component.node) return false;
        if (!component.node.isValid) return false;
        return true;
    }

    /**
     * 组件是否存活
     */
    public static isComponentLive(cpn: cc.Component): boolean {
        if (!cpn) return false;
        if (!cpn.node) return false;
        if (!cpn.node.isValid) return false;
        if (!cpn.isValid) return false;
        // if(cpn.__isDestroy)return false;
        return true;
    }


    /**
     * 获取url参数
     * @param {string} name 参数名
     */
    public static getUrlParams(name: string) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    }


    /**
     * 多边形是否包含坐标
     * @param polygon 
     * @param x 
     * @param y 
     */
    public static containsPointPolygon(polygon, x, y) {
        var vertices = polygon;
        var nn = polygon.length;
        var prevIndex = nn - 2;
        var inside = false;
        for (var ii = 0; ii < nn; ii += 2) {
            var vertexY = vertices[ii + 1];
            var prevY = vertices[prevIndex + 1];
            if ((vertexY < y && prevY >= y) || (prevY < y && vertexY >= y)) {
                var vertexX = vertices[ii];
                if (vertexX + (y - vertexY) / (prevY - vertexY) * (vertices[prevIndex] - vertexX) < x)
                    inside = !inside;
            }
            prevIndex = ii;
        }
        return inside;
    }



    /**
     * 获取插槽的boudingboxAttchment Polygon
     * @param spine 
     * @param slotName 
     * @param offset 
     */
    public static getBoundingBoxAMPolygon(parent: cc.Node, spine: sp.Skeleton, slotName: string): any {
        let slot = spine.findSlot(slotName);
        let polygon: any;
        if (slot) {
            let attachment = slot.getAttachment();
            if (attachment) {
                if (attachment instanceof sp['spine'].BoundingBoxAttachment) {
                    let boundingBox = attachment;
                    let spineUtil = sp['spine'].Utils;
                    polygon = spineUtil.newFloatArray(boundingBox.worldVerticesLength);
                    boundingBox.computeWorldVertices(slot, 0, boundingBox.worldVerticesLength, polygon, 0, 2);
                    let nn = polygon.length;
                    for (let ii = 0; ii < nn; ii += 2) {
                        let worldPos: cc.Vec2 = parent.convertToWorldSpaceAR(new cc.Vec2(polygon[ii], polygon[ii + 1]));
                        polygon[ii] = worldPos.x;
                        polygon[ii + 1] = worldPos.y;
                    }
                }
            }
        }
        return polygon;
    }


    /**
     * spine 停留在某一帧
     * @param sp 
     * @param nFrame 
     */
    public static stopSpineAtFrame(sp: sp.Skeleton, aniName: string, time: number): void {

        if (!sp || !aniName) {
            return;
        }

        let ani: any = sp.findAnimation(aniName);
        if (!ani) {
            return;
        }

        sp.paused = false;
        let entry: any = sp.setAnimation(0, aniName, false);
        if (!entry) {
            return;
        }

        sp.timeScale = 0;
        entry.trackTime = time;
    }

    /**
    * @method 深复制一个Object对象
    * @param source 需要深复制的对象
    * @return 返回一个新的对象
    * @log func、date、reg 和 err 类型不能正常拷贝
    */
    public static deepCopy(source: Object): Object {
        const newObject = {};
        for (const key of Object.keys(source)) {
            newObject[key] = typeof source[key] === 'object' ? this.deepCopy(source[key]) : source[key];
        }
        return newObject;
    }



    /**
    * 转换时间格式
    * 用法：format(ms,'yyyy-MM-dd hh:mm:ss')
    * @param time 毫秒数
    * @param fmt 要转换的时间格式
    */
    public static formatDate(time, fmt) {
        let d = new Date(time);
        let o = {
            "M+": d.getMonth() + 1,               //月份
            "d+": d.getDate(),                    //日
            "h+": d.getHours(),                   //小时
            "m+": d.getMinutes(),                 //分
            "s+": d.getSeconds(),                 //秒
            "q+": Math.floor((d.getMonth() + 3) / 3), //季度
            "S": d.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /**
     * 获取格式化时间
     * @param time {number} 时间戳 单位毫秒
     * @returns XX秒前 | XX分钟前 | XX小时前 | XX天前 | XX年前
     */
    public static getFormatTime(time: number) {
        if (time > 0) {
            time = (new Date().getTime() - time) / 1000;
            if (time < 0) {
                return `刚刚`;
            } else if (time >= 0 && time < 60) {
                return `${Math.floor(time)}秒前`;
            } else if (time < (60 * 60)) {
                return `${Math.floor(time / 60)}分钟前`;
            } else if (time < (60 * 60 * 24)) {
                return `${Math.floor(time / 60 / 60)}小时前`;
            } else if (time < (60 * 60 * 24 * 365)) {
                return `${Math.floor(time / 60 / 60 / 24)}天前`;
            } else {
                return `${Math.floor(time / 60 / 60 / 24 / 365)}年前`;
            }
        }
    }


    /**
     * 数组元素叠加 [1,2,3,4,,] -> [1,3,6,10,,,,]
     * @param arr 
     */
    public static overAddArr(arr: Array<number>): Array<number> {
        if (!arr || arr.length <= 0) {
            return [];
        } else {
            let temp: Array<number> = [];
            for (let i = 0; i < arr.length; i++) {
                if (i == 0) {
                    temp[i] = arr[i];
                } else {
                    temp[i] = temp[i - 1] + arr[i];
                }
            }
            return temp;
        }
    }

    /**
     * 获取数组中最接近的值得index
     * @param random 随机数
     * @param weightArray 权重数组
     * @returns {number}
     */
    public static getRandomIndex(random: number, weightArray: Array<number>): number {
        let index: number = 0;
        if (random <= weightArray[0]) {
            return 0;
        } else if (random >= weightArray[weightArray.length - 1]) {
            index = weightArray.length - 1;
            return index;
        } else {
            for (let i = 0; i < weightArray.length; i++) {
                if (random <= weightArray[i]) {
                    index = i;
                } else if (random > weightArray[i] && random <= weightArray[i + 1]) {
                    index = i + 1;
                    break
                } else if (random > weightArray[i] && random <= weightArray[i + 1]) {
                    index = i + 1;
                    break;
                }
            }
        }
        return index;
    }


    /**
     * 带权随机函数
     * @param valueArr 
     * @param weightArr 
     */
    public static getRandWeightIndex(weightArr: Array<number>): number {
        weightArr = this.overAddArr(weightArr);
        let totalWeight: number = weightArr[weightArr.length - 1];
        let random: number = Math.random() * totalWeight;
        let arrIndex: number = this.getRandomIndex(random, weightArr);
        return arrIndex;
    }


    public static getDistance(s: cc.Vec2, e: cc.Vec2): number {
        return s.sub(e).mag();
    }


    /**
     *  1000=1K
        1000K=1M
        1000M=1B
        1000B=1T
        1000T=1P
        1000P=1E
        1000E=1Z
        1000Z=1Y
     * @param num 
     */
    public static formatCNY(num: number, digits: number) {
        const si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "K" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" },
            { value: 1E21, symbol: "Z" },
            { value: 1E24, symbol: "Y" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    // #regin start 服务器时间部分

    private static _initServerTime: number = 0;
    private static _initLocalTime: number = 0;

    /**
     * 初始化服务器时间
     * @param val 
     */
    public static initServerTime(val: number): void {
        this._initServerTime = val;
        this._initLocalTime = Date.now();
    }

    /**
     * 获取服务器当前时间
     */
    public static getServerTime(): number {
        return this._initServerTime + (Date.now() - this._initLocalTime);
    }

    // #regin eng 服务器时间部分

    public static clone(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(this.clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = this.clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    }


    /**
     * 通过ui类型字符串获取ui类型枚举值
     */
    public static getViewType(uiTypeName: string): UIType {
        for (let i = UIType.$Start + 1; i < UIType.$End; ++i) {
            if (UIType[i] == uiTypeName) {
                return i;
            }
        }
        return undefined;
    }


    /**
     * 创建并初始化一个二维数组
     * @param rowCount 
     * @param colCount 
     * @param defaultValue 
     */
    public static createMatrix(rowCount: number, colCount: number, defaultValue: number = 0): Array<Array<number>> {

        let ret: Array<Array<number>> = new Array<Array<number>>();

        for (let i: number = 0; i < rowCount; ++i) {
            ret[i] = new Array<number>();
            for (let j: number = 0; j < colCount; ++j) {
                ret[i][j] = defaultValue;
            }
        }

        return ret;
    }

    /**
     * Map 转 Object
     * @param aMap 
     */
    public static map2Obj(aMap: Map<any, any>): Object {
        let obj = Object.create(null);
        aMap.forEach((value, key, map) => {
            obj[key] = value;
        })
        return obj;
    }

    /**
     * Object 转 Map
     * @param obj 
     */
    public static obj2map(obj: Object): Map<any, any> {
        let map = new Map();
        for (let k of Object.keys(obj)) {
            map.set(k, obj[k]);
        }
        return map;
    }

    /**
     *阿拉伯数字转中文数字
     *
     * @static
     * @param {number} num
     * @returns {string}
     * @memberof Utils
     */
    public static arab2char(num : number) : string{
        let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; 
        let unit = ["", "十", "百", "千", "万"];
        let getWan = (temp) => {
        　　let strArr = temp.toString().split("").reverse();
        　　let newNum = "";
        　　for (var i = 0; i < strArr.length; i++) {
          　　newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        　　}
         　 return newNum;
       }
       let overWan = Math.floor(num / 10000);
       let noWan = num % 10000;
       let noWanStr : string = "";
       if (noWan.toString().length < 4) {
        　　　noWanStr = "0" + noWan;
    　　}
       return overWan ? getWan(overWan) + "万" + getWan(noWanStr) : getWan(num);

    }
}