import { UIDataInfo, LayerType, UIType } from '../../Define/UIDefs';
import UIBase, { UIShowTypes } from '../UIBase';
import CommonToast from './CommonToast';
import { EventId } from '../../Define/EventId';
import { ProcessCallback, resLoader } from '../Res/ResLoader';
import UIOpenAnimation from './UIOpenAnimation';
import UICloseAnimation from './UICloseAnimation';
import { ResUtil } from '../Res/ResUtil';
import { EVENT } from '../Event/EventMgr';

const { ccclass, property } = cc._decorator;

/** 屏幕朝向 */
export enum eOrientation {
    Landscape,
    Portrait,
}

/** UI栈结构体 */
export interface UIInfo {
    uiType: UIType;
    uiView: UIBase;
    uiArgs: any;
    preventNode?: cc.Node;
    zOrder?: number;
    isClose?: boolean;
}


@ccclass
export default class UIMgr extends cc.Component {

    //# regison  层级控制
    @property(cc.Node)
    guiLayer: cc.Node = null;

    @property(cc.Node)
    popLayer: cc.Node = null;

    @property(cc.Node)
    tipLayer: cc.Node = null;

    @property(cc.Node)
    topLayer: cc.Node = null;

    //Loading等待Icon
    @property(cc.Node)
    uiWaitNode: cc.Node = null;

    //Loading等待遮罩
    @property(cc.Node)
    waitMask: cc.Node = null;
 
    //资源加载进度
    @property(cc.Node)
    sceneWaitNode: cc.Node = null;
    //资源加载Lbl
    @property(cc.Label)
    sceneWaitLbl: cc.Label = null;
    //提示信息
    @property(cc.Prefab)
    tipsNode: cc.Prefab = null;

    @property(cc.Prefab)
    uiBack: cc.Prefab = null;
    //# regison  层级控制 

    /** Toast 提示 */
    private _tipComponnet: CommonToast = null;
    /** 保存窗口尺寸 */
    private _winSize: cc.Size;
    /** 资源加载计数器，用于生成唯一的资源占用key */
    private useCount = 0;
    /** 背景UI（有若干层UI是作为背景UI，而不受切换等影响）*/
    private BackGroundUI = 0;
    /** 是否正在关闭UI */
    private isClosing = false;
    /** 是否正在打开UI */
    private isOpening = false;
    /** UI界面缓存（key为UIId，value为UIView节点）*/
    private UICache: { [UIId: number]: UIBase } = {};
    /** UI界面栈（{UIID + UIView + UIArgs}数组）*/
    private UIStack: UIInfo[] = [];
    /** UI待打开列表 */
    private UIOpenQueue: UIInfo[] = [];
    /** UI待关闭列表 */
    private UICloseQueue: UIType[] = [];
    /** UI打开前回调 */
    public uiOpenBeforeDelegate: (uiType: number, preUIType: number) => void = null;
    /** UI打开回调 */
    public uiOpenDelegate: (uiType: number, preUIType: number) => void = null;
    /** UI关闭回调 */
    public uiCloseDelegate: (uiType: number) => void = null;

    private static _inst: UIMgr;
    public static get inst(): UIMgr {
        if (!UIMgr._inst) {
            cc.error("UIMgr not load yet!", "%s");
            return null;
        }
        return UIMgr._inst;
    }

    onLoad() {
        // 保存一份当前屏幕尺寸方便后面使用
        this.resetWinSize();

        // 单例初始化
        UIMgr._inst = this;
    }

    /**
     * 打开界面并添加到界面栈中
     * @param uiType 
     * @param uiArgs 
     * @param progressCallback 
     */
    public open(uiType: UIType, uiArgs ?: any, progressCallback: ProcessCallback = null): void {

        let uiInfo: UIInfo = {
            uiType: uiType,
            uiArgs: uiArgs,
            uiView: null,
        };

        // 插入待打开队列
        if (this.isOpening || this.isClosing) {
            this.UIOpenQueue.push(uiInfo);
            return;
        }

        // 界面已经打开
        let uiIndex = this.getUIIndex(uiType);
        if (-1 != uiIndex) {
            // 直接回到该界面
            this.closeToUI(uiType, uiArgs);
            return;
        }

        // 设置UI的zOrder
        uiInfo.zOrder = this.UIStack.length + 1;
        this.UIStack.push(uiInfo);

        // 先屏蔽点击,防止加载过程中又点击别的按钮
        let dataInfo: UIDataInfo = UIDataInfo.getUIData(uiType);
        if (dataInfo.preventTouch) {
            uiInfo.preventNode = this.preventTouch(uiInfo.zOrder);
        }

        this.isOpening = true;

        // 显示loading
        this.showUIWaitAnim();

        // 预加载资源，并在资源加载完成后自动打开界面
        this.getOrCreateUI(uiType, progressCallback, (uiView: UIBase): void => {

            // 关闭loading
            this.hideUIWaitAnim();

            // 如果界面已经被关闭或创建失败
            if (uiInfo.isClose || null == uiView) {
                cc.log(`getOrCreateUI ${uiType} faile! close state : ${uiInfo.isClose} , uiView : ${uiView}`, "%s");
                this.isOpening = false;

                if (uiInfo.preventNode) {
                    uiInfo.preventNode.destroy();
                    uiInfo.preventNode = null;
                }

                return;
            }

            // 打开UI，执行配置
            this.onUIOpen(uiType, uiView, uiInfo, uiArgs);
            this.isOpening = false;
            this.autoExecNextUI();

        }, uiArgs);
    }

    /**
     * 关闭界面，一直关闭到顶部为uiId的界面，为避免循环打开UI导致UI栈溢出
     * @param uiType 要关闭到的uiId（关闭其顶部的ui）
     * @param uiArgs 打开的参数
     * @param bOpenSelf 
     */
    public closeToUI(uiType: UIType, uiArgs: any, bOpenSelf = true): void {
        let idx = this.getUIIndex(uiType);
        if (-1 == idx) {
            return;
        }

        idx = bOpenSelf ? idx : idx + 1;
        for (let i = this.UIStack.length - 1; i >= idx; --i) {
            let uiInfo = this.UIStack.pop();
            let uiType = uiInfo.uiType;
            let uiView = uiInfo.uiView;
            uiInfo.isClose = true

            // 回收屏蔽层
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }

            if (this.uiCloseDelegate) {
                this.uiCloseDelegate(uiType);
            }

            if (uiView) {
                uiView.onClose()
                if (uiView.cache) {
                    this.UICache[uiType] = uiView;
                    uiView.node.removeFromParent(false);
                } else {
                    uiView.releaseAutoRes();
                    uiView.node.destroy();
                }
            }
        }

        this.updateUI();
        this.UIOpenQueue = [];
        this.UICloseQueue = [];
        bOpenSelf && this.open(uiType, uiArgs);
    }


    resetWinSize() {
        this._winSize = cc.view.getVisibleSize();
    }

    /**
     * 获取层
     * @param nLayerType 层级类型
     */
    public getLayer(nLayerType: LayerType): cc.Node {

        let layer: cc.Node = null;

        switch (nLayerType) {
            case LayerType.GUI:
                layer = this.guiLayer;
                break;
            case LayerType.Pop:
                layer = this.popLayer;
                break;
            case LayerType.Tip:
                layer = this.tipLayer;
                break;
            case LayerType.Top:
                layer = this.topLayer;
                break;
            default:
                cc.error("Unkonw layer type!", "%s");
                break;
        }

        return layer;
    }

    /**
     * 添加到指定的层级
     * @param nLayerType 要添加到的层类型
     * @param node 被添加的节点
     */
    public add2Layer(nLayerType: LayerType, node: cc.Node): void {
        if (!node) {
            cc.error("node is not valid!", "%s");
            return;
        }

        let layer: cc.Node = this.getLayer(nLayerType);
        if (!layer) {
            cc.error("add to layer is not found!", "%s");
            return;
        }

        layer.addChild(node);
    }

    /** 关闭所有界面 */
    public closeAll() {
        // 不播放动画，也不清理缓存
        for (const uiInfo of this.UIStack) {
            uiInfo.isClose = true;
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }
            if (uiInfo.uiView) {
                uiInfo.uiView.onClose();
                uiInfo.uiView.releaseAutoRes();
                uiInfo.uiView.node.destroy();
            }
        }
        this.UIOpenQueue = [];
        this.UICloseQueue = [];
        this.UIStack = [];
        this.isOpening = false;
        this.isClosing = false;
    }

    /** 清理界面缓存 */
    public clearCache(): void {
        for (const key in this.UICache) {
            let ui = this.UICache[key];
            if (cc.isValid(ui.node)) {
                if (cc.isValid(ui)) {
                    ui.releaseAutoRes();
                }
                ui.node.destroy();
            }
        }
        this.UICache = {};
    }


    public isTopUI(uiType : UIType): boolean {
        if (this.UIStack.length == 0) {
            return false;
        }
        return this.UIStack[this.UIStack.length - 1].uiType == uiType;
    }

    public getUI(uiType: UIType): UIBase {
        for (let index = 0; index < this.UIStack.length; index++) {
            const element = this.UIStack[index];
            if (uiType == element.uiType) {
                return element.uiView;
            }
        }
        return null;
    }

    public isUIOpen(uiType: UIType) : boolean{
        return this.getUI(uiType) != null;
    }

    public getTopUI(): UIBase {
        if (this.UIStack.length > 0) {
            return this.UIStack[this.UIStack.length].uiView;
        }
        return null;
    }

    /**
     * 显示UI加载等待动画
     * @param showMask 
     * @param maxWaitTime 
     */
    public showUIWaitAnim(showMask: boolean = true, maxWaitTime: number = 15) {
        this.uiWaitNode && (this.uiWaitNode.active = true);
        this.waitMask && (this.waitMask.active = true);
        if (showMask) {
            this.waitMask && (this.waitMask.opacity = 30);
        } else {
            this.waitMask && (this.waitMask.opacity = 0);
        }
    }

    /**
     * 隐藏UI加载等待动画
     */
    public hideUIWaitAnim() {
        this.uiWaitNode && (this.uiWaitNode.active = false);
        this.waitMask && (this.waitMask.active = false);
    }


    /**
     * 显示场景加载等待界面
     * @param txt 
     */
    public showSceneLoadUI(txt: string): void {
        if (this.sceneWaitNode) {
            this.sceneWaitNode.active = true;
            this.sceneWaitLbl.string = txt;
        }
    }

    /**
     * 隐藏场景加载等待界面
     */
    public hideSceneLoadUI(): void {
        if (this.sceneWaitNode) {
            this.sceneWaitNode.active = false;
        }
    }

    /**
     * 显示一个toast
     * @param content 
     */
    public showToast(content: string): void {
        if (content == null || content == undefined) {
            return;
        }

        if (!this._tipComponnet) {
            let tips = cc.instantiate(this.tipsNode).getComponent(CommonToast);
            tips.node.parent = this.getLayer(LayerType.Tip);
            this._tipComponnet = tips;
        }
        this._tipComponnet.showTips(content);
    }


    public get winSize(): cc.Size {
        return this._winSize;
    }

    /**
    * 关闭当前界面
    * @param uiType 要关闭的界面
    */
    public close(uiType : UIType) : void{
        let uiCount = this.UIStack.length;
        let uiInfo: UIInfo;

        if(!(uiType > UIType.$Start && uiType < UIType.$End)){
            cc.error("unknown ui type to close!", "%s");
            return;
        }
        
        // 插入待关闭队列
        if (uiCount < 1 || this.isClosing || this.isOpening) {
            this.UICloseQueue.push(uiType);
            return;
        }
        
        for (let index = this.UIStack.length - 1; index >= 0; index--) {
            let ui : UIInfo = this.UIStack[index];
            if (ui.uiType === uiType) {
                uiInfo = ui;
                this.UIStack.splice(index, 1);
                break;
            }
        }

        // 找不到这个UI
        if (uiInfo === undefined) {
            return;
        }
      

        this.isClosing = true;
        // 关闭当前界面
        let uiId = uiInfo.uiType;
        let uiView = uiInfo.uiView;
        uiInfo.isClose = true;


        // 回收遮罩层
        if (uiInfo.preventNode) {
            uiInfo.preventNode.destroy();
            uiInfo.preventNode = null;
        }

        if (null == uiView) {
            this.isClosing = false;
            return;
        }
    

        let preUIInfo = this.UIStack[uiCount - 2];
        // 处理显示模式
        this.updateUI();
        let close = () => {

            // 显示之前的界面
            if (preUIInfo && preUIInfo.uiView && this.isTopUI(preUIInfo.uiType)) {
                // 如果之前的界面弹到了最上方（中间有肯能打开了其他界面）
                preUIInfo.uiView.node.active = true
                // 回调onTop
                preUIInfo.uiView.onTop(uiId, uiView.onClose());
            } else {
                uiView.onClose();
            }

            if (this.uiCloseDelegate) {
                this.uiCloseDelegate(uiId);
            }
            if (uiView.cache) {
                this.UICache[uiId] = uiView;
                uiView.node.removeFromParent(false);
                cc.log(`uiView removeFromParent ${uiInfo.uiType}`);
            } else {
                uiView.releaseAutoRes();
                uiView.node.destroy();
                cc.log(`uiView destroy ${uiInfo.uiType}`);
            }
            this.isClosing = false;
            this.autoExecNextUI();

            // 发送UI关闭事件
            EVENT.emit(EventId.ON_UI_CLOSE, uiType);
        }

        // 播放UI关闭动画，如果有得话
        let closeAni : UICloseAnimation = uiView.node.getComponent(UICloseAnimation);
        if(closeAni){
            uiView.isPlayOpenAni = true;
            let aniState : cc.AnimationState = closeAni.play();
            if(aniState.wrapMode == cc.WrapMode.Loop){
                cc.error("UI close animation should be a loop animation!", "%s");
            }
            closeAni.on("finished", ()=>{
                close();
            }, this, false);
        } else {
            close();
        }
    }

    /** 替换栈顶界面 */
    public replace(uiType: number, uiArgs: any) {
        this.close(this.UIStack[this.UIStack.length - 1].uiType);
        this.open(uiType, uiArgs);
    }

    private getUIIndex(uiType: UIType): number {
        for (let index = 0; index < this.UIStack.length; index++) {
            const element = this.UIStack[index];
            if (uiType == element.uiType) {
                return index;
            }
        }
        return -1;
    }


    /**
     * 添加防触摸层
     * @param zOrder 屏蔽层的层级
     */
    private preventTouch(zOrder: number) {
        let node : cc.Node = ResUtil.instantiate(this.uiBack);
        node.name = 'preventTouch';
        node.setContentSize(cc.winSize);
        node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventCustom) {
            event.stopPropagation();
        }, node);
        let child = this.getLayer(LayerType.Pop);
        child.addChild(node, zOrder);
        return node;
    }

    /**
     * 自动执行下一个待关闭或待打开的界面
     */
    private autoExecNextUI() {
        // 逻辑上是先关后开
        if (this.UICloseQueue.length > 0) {
            let uiType = this.UICloseQueue[0];
            this.UICloseQueue.splice(0, 1);
            this.close(uiType);
        } else if (this.UIOpenQueue.length > 0) {
            let uiQueueInfo = this.UIOpenQueue[0];
            this.UIOpenQueue.splice(0, 1);
            this.open(uiQueueInfo.uiType, uiQueueInfo.uiArgs);
        }
    }


    /**
     * 自动检测资源预加载组件，如果存在则加载完成后调用completeCallback，否则直接调用
     * @param completeCallback 资源加载完成回调
     */
    private autoLoadRes(uiView: UIBase, completeCallback: () => void) {
        // 暂时先省略
        completeCallback();
    }

    /** 生成唯一的资源占用key */
    private makeUseKey(): string {
        return `UIMgr_${++this.useCount}`;
    }

    /**
    * 根据界面显示类型刷新显示
    */
    private updateUI() {
        let hideIndex: number = 0;
        let showIndex: number = this.UIStack.length - 1;
        for (; showIndex >= 0; --showIndex) {
            let mode = this.UIStack[showIndex].uiView.showType;
            // 无论何种模式，最顶部的UI都是应该显示的
            this.UIStack[showIndex].uiView.node.active = true;
            if (UIShowTypes.UIFullScreen == mode) {
                break;
            } else if (UIShowTypes.UISingle == mode) {
                for (let i = 0; i < this.BackGroundUI; ++i) {
                    if (this.UIStack[i]) {
                        this.UIStack[i].uiView.node.active = true;
                    }
                }
                hideIndex = this.BackGroundUI;
                break;
            }
        }
        // 隐藏不应该显示的部分UI
        for (let hide: number = hideIndex; hide < showIndex; ++hide) {
            this.UIStack[hide].uiView.node.active = false;
        }
    }

    /**
     * 异步加载一个UI的prefab，成功加载了一个prefab之后
     * @param nUIType 界面id
     * @param processCallback 加载进度回调
     * @param completeCallback 加载完成回调
     * @param uiArgs 初始化参数
     */
    private getOrCreateUI(nUIType: number, processCallback: ProcessCallback, completeCallback: (uiView: UIBase) => void, uiArgs: any): void {

        // 如果找到缓存对象，则直接返回
        let uiView: UIBase = this.UICache[nUIType];
        if (uiView) {
            completeCallback(uiView);
            return;
        }

        // 获取UI配置数据
        let dataInfo: UIDataInfo = UIDataInfo.getUIData(nUIType);
        if (!dataInfo || !dataInfo.fullPath) {
            cc.log(`getOrCreateUI ${nUIType} faile, prefab conf not found!`);
            completeCallback(null);
            return;
        }
        let uiPath: string = dataInfo.fullPath;

        let useKey = this.makeUseKey();
        resLoader.loadRes(uiPath, processCallback, (err: Error, prefab: cc.Prefab) => {

            // 检查加载资源错误
            if (err) {
                cc.log(`getOrCreateUI loadRes ${nUIType} faile, path: ${uiPath} error: ${err}`);
                completeCallback(null);
                return;
            }

            // 检查实例化错误
            let uiNode: cc.Node = cc.instantiate(prefab);
            if (null == uiNode) {
                cc.log(`getOrCreateUI instantiate ${nUIType} faile, path: ${uiPath}`);
                completeCallback(null);
                resLoader.releaseRes(uiPath, cc.Prefab);
                return;
            }

            // 检查组件获取错误
            uiView = uiNode.getComponent(UIBase);
            if (null == uiView) {
                cc.log(`getOrCreateUI getComponent ${nUIType} faile, path: ${uiPath}`);
                uiNode.destroy();
                completeCallback(null);
                resLoader.releaseRes(uiPath, cc.Prefab);
                return;
            }

            // 设置ui大小
            let canvasSize : cc.Size = UIMgr.inst.getCanvasSize();
            uiView.node.width = canvasSize.width;
            uiView.node.height = canvasSize.height;

            // 异步加载UI预加载的资源
            this.autoLoadRes(uiView, () => {
                uiView.init(uiArgs, nUIType);
                completeCallback(uiView);
                uiView.autoReleaseRes({ url: resLoader.getResKeyByUrl(uiPath, cc.Prefab), type: cc.Prefab, use: useKey }, false);
            })

        }, useKey);
    }

    public getCanvasSize() : cc.Size{
        return new cc.Size(this.node.width, this.node.height);
    }

    /**
     * UI被打开时回调，对UI进行初始化设置，刷新其他界面的显示，并根据
     * @param nUIType 哪个界面被打开了
     * @param uiView 界面对象
     * @param uiInfo 界面栈对应的信息结构
     * @param uiArgs 界面初始化参数
     */
    private onUIOpen(nUIType: number, uiView: UIBase, uiInfo: UIInfo, uiArgs: any) {
        if (null == uiView) {
            return;
        }

        // 激活界面
        uiInfo.uiView = uiView;
        uiView.node.active = true;
        uiView.node.zIndex = uiInfo.zOrder || this.UIStack.length;

        if(uiView.quickClose){
            let backGround = uiView.node.getChildByName('background');
            if (!backGround) {
                backGround = new cc.Node()
                backGround.name = 'background';
                backGround.setContentSize(cc.winSize);
                uiView.node.addChild(backGround, -1);
            }
            backGround.targetOff(cc.Node.EventType.TOUCH_START);
            backGround.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventCustom) => {
                event.stopPropagation();
                this.close(nUIType);
            }, backGround);
        } 

        // 添加到场景中
        this.add2Layer(uiView.showLayer, uiView.node);

        // 刷新其他UI
        this.updateUI();

        // 从那个界面打开的
        let fromUIID = 0;
        if (this.UIStack.length > 1) {
            fromUIID = this.UIStack[this.UIStack.length - 2].uiType;
        }

        // 打开界面之前回调
        if (this.uiOpenBeforeDelegate) {
            this.uiOpenBeforeDelegate(nUIType, fromUIID);
        }

        // 执行onOpen回调
        uiView.onOpen(fromUIID, uiArgs);


        // 播放UI打开动画，如果有得话
        let onAniOverFunc : Function = () =>{
            uiView.isPlayOpenAni = false;
            uiView.onOpenAniOver();
            if (this.uiOpenDelegate) {
                this.uiOpenDelegate(nUIType, fromUIID);
            }
             
            // 通知UI打开事件
            EVENT.emit(EventId.ON_UI_OPEN, nUIType);
        }

        let openAni : UIOpenAnimation = uiView.node.getComponent(UIOpenAnimation);
        if(openAni){
            uiView.isPlayOpenAni = true;
            let aniState : cc.AnimationState = openAni.play();
            if(aniState.wrapMode == cc.WrapMode.Loop){
                cc.error("UI open animation should not be a loop animation!");
            }
            openAni.once("finished", ()=>{
                onAniOverFunc();
            }, this);
        } else {
            onAniOverFunc();
        }

    }
}