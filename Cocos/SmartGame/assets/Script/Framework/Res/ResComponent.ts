import { autoResInfo } from "../UIBase";
import { resLoader, CompletedCallback } from "./ResLoader";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResComponent extends cc.Component {

    /** 该组件关闭时自动释放的资源 */
    protected autoRes: autoResInfo[] = [];

    /** 该组件资源占用key */
    protected useKey: string = null;

    /**
     * 获取该组件的资源占用key
     */
    public getUseKey(): string {
       return "";
    }

    /**
    * 加载资源，通过此接口加载的资源会在组件被销毁时自动释放
    * 如果同时有其他地方引用的资源，会解除当前组件对该资源的占用
    * @param url 要加载的url
    * @param type 类型，如cc.Prefab,cc.SpriteFrame,cc.Texture2D
    * @param onCompleted 
    */
    public loadRes(url: string, type: typeof cc.Asset, onCompleted: CompletedCallback) {
        let useStr = this.getUseKey();
        resLoader.loadRes(url, type, (error: Error, res) => {
            if (!error) {
                this.autoRes && this.autoRes.push({ url: url, type: type });
            }
            onCompleted && onCompleted(error, res);
        }, useStr);
    }

    /**
     * 释放资源，组件销毁时在UIMgr中调用
     */
    public releaseAutoRes() {
        // TODO: 暂时释放资源了

        // for (let index = 0; index < this.autoRes.length; index++) {
        //     const element = this.autoRes[index];
        //     resLoader.releaseRes(element.url, element.type, element.use || this.getUseKey());
        // }
    }

    /**
     * 往一个组件加入一个自动释放的资源
     * @param resConf 资源url和类型
     */
    public autoReleaseRes(resConf: autoResInfo) {
        this.autoRes.push(resConf);
    }


     /**
     * 分帧执行 Generator 逻辑
     * Refrences : https://www.jianshu.com/p/7f8fa125cd4f
     * @param generator 生成器
     * @param duration 持续时间（ms）
     *          每次执行 Generator 的操作时，最长可持续执行时长。
     *          假设值为8ms，那么表示1帧（总共16ms）下，分出8ms时间给此逻辑执行
     */
    protected executePreFrame(generator: Generator, duration: number = 1) {
        return new Promise((resolve, reject) => {
            let gen = generator;
            // 创建执行函数
            let execute = () => {

                // 执行之前，先记录开始时间戳
                let startTime = new Date().getTime();

                // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
                for (let iter = gen.next(); ; iter = gen.next()) {

                    // 判断是否已经执行完所有 Generator 的小代码段
                    // 如果是的话，那么就表示任务完成
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }

                    // 每执行完一段小代码段，都检查一下是否
                    // 已经超过我们分配给本帧，这些小代码端的最大可执行时间
                    if (new Date().getTime() - startTime > duration) {

                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        this.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };

            // 运行执行函数
            execute();
        });
    }
}
