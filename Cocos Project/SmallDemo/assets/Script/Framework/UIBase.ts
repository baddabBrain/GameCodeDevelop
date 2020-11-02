import { UIDataInfo, LayerType } from '../Define/UIDefs';

/*
 * @Description: UI基类
 * @Author: chenguanhui
 * @Date: 2019-08-13 13:47:44
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-22 09:50:22
 */

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIType } from '../Define/UIDefs';
import UIMgr from './UI/UIMgr';
import Utils from './Utils/Utils';
import ResKeeper from './Res/ResKeeper';

const { ccclass, property } = cc._decorator;


/** 界面展示类型 */
export enum UIShowTypes {
    UIFullScreen,       // 全屏显示，全屏界面使用该选项可获得更高性能
    UIAddition,         // 叠加显示，性能较差
    UISingle,           // 单界面显示，只显示当前界面和背景界面，性能较好
};

@ccclass
export default class UIBase extends ResKeeper {

    /** 界面显示类型 */
    @property({ type: cc.Enum(UIShowTypes), displayName:"显示类型"})
    showType: UIShowTypes = UIShowTypes.UISingle;

    /** 快速关闭 */
    @property
    quickClose: boolean = true;

    /** 显示层级 */
    @property({type:cc.Enum(LayerType)})
    showLayer : LayerType = LayerType.Pop;

     /** 缓存选项 */
     @property
     cache: boolean = false;

     @property
     maskOpacity : number = 255;
 
     public uiType: UIType;

    /**
     * UI配置数据
     */
    public dataInfo : UIDataInfo;

    /**
     * 打开参数
     */
    public _para : any = null;

    /**
     * 是否在播放动画
     */
    public isPlayOpenAni : boolean = false;

    /** 界面id */
    public UIid: number = 0;

    /**
     * 关闭界面
     */
    protected close(): void {
        UIMgr.inst.close(this.uiType);
    }


      /**
     * 当界面被创建时回调，生命周期内只调用
     * @param args 可变参数
     */
    public init(args, uiType:UIType): void {
        // 先保存一份
        this._para = Utils.clone(args);
        this.uiType = uiType

    }

    /**
     * 当界面被打开时回调，每次调用Open时回调
     * @param fromUI 从哪个UI打开的
     * @param args 可变参数
     */
    public onOpen(fromUI: UIType, args): void {

    }

    /**
     * 每次界面Open动画播放完毕时回调
     */
    public onOpenAniOver(): void {

    }

    /**
     * 当界面被关闭时回调，每次调用Close时回调
     * 返回值会传递给下一个界面
     */
    public onClose(): any {

    }

    /**
     * 当界面被置顶时回调，Open时并不会回调该函数
     * @param preID 前一个ui
     * @param args 可变参数，
     */
    public onTop(preID: number, ...args): void {

    }



}
