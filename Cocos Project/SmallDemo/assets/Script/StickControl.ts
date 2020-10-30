// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


/**
 * 摇杆类型
 * 固定位置
 * 手指点击位置
 */
export enum StickType {
    Fixed,
    Follow,
}


@ccclass
export default class StickControl extends cc.Component {

    //移动圆
    @property(cc.Node)
    stickNode: cc.Node = null;

    //背景圆
    @property(cc.Node)
    ringNode: cc.Node = null;

    @property({ type: cc.Enum(StickType), displayName: "摇杆类型" })
    touchType: StickType = StickType.Fixed;

    //移动半径
    private _maxRadius: number = 0;

    private _stickPos: cc.Vec2 = null;

    //触摸位置   主要用于Follow模式下确定摇杆出现位置
    private _touchPos: cc.Vec2 = null;


    onLoad() {
        //1.鼠标可以拖动小圆移动
        //3.松开鼠标之后小圆回到起点位置
        //4.根据小圆的移动方向和距离  可以带动人物的移动
        this.stickMoveEnd();

        this._maxRadius = this.ringNode.width / 2;

        if (this.touchType == StickType.Follow) {
            //跟随模式下  直接隐藏 点击时再显示
            this.node.opacity = 0;
        }
    }

    start() {

    }

    onEnable(): void {
        //监听事件绑定在panel下 而不是移动圆
        this.node.on(cc.Node.EventType.TOUCH_START, this.stickMoveStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.stickMoveing, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.stickMoveEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.stickMoveEnd, this);
    }

    onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.stickMoveStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.stickMoveing, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.stickMoveEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.stickMoveEnd, this);
    }

    update(dt) { }


    /**
     * 改变摇杆类型
     * @param type 摇杆类型
     */
    private changeStickType(type: StickType): void {
        this.touchType = type;
        this.node.opacity = (type === StickType.Fixed ? 255 : 0);
    }



    /**
     * 摇杆移动开始
     */
    private stickMoveStart(e: cc.Event.EventTouch): void {
        let mousePos: cc.Vec2 = e.getLocation();
        //触摸点的世界坐标
        let touchPos: cc.Vec2 = this.node.convertToNodeSpaceAR(mousePos);

        //监听事件绑定在主节点上   监测范围较大
        if (this.touchType === StickType.Fixed) {
            //记录圆心位置
            this._stickPos = this.ringNode.getPosition();
            //获取当前移动的向量长度  点击位置（移动圆的圆心）  和原点（背景圆的圆心）
            //计算触摸点和背景圆中心点的距离
            let dis: number = this.getMag(Math.abs(this.ringNode.position.x - this.stickNode.position.x), Math.abs(this.ringNode.position.y - this.stickNode.position.y));
            if (this._maxRadius > dis) {
                this.stickNode.setPosition(touchPos);
            }
        } else {
            //确定摇杆出现的位置
            this._touchPos = touchPos;
            this.node.opacity = 255;
            //设置摇杆位置
            this.ringNode.setPosition(this._touchPos);
            this.stickNode.setPosition(this._touchPos);
        }
    }

    /**
     * 摇杆移动
     */
    private stickMoveing(e: cc.Event.EventTouch): void {
        let mousePos: cc.Vec2 = e.getLocation();
       
        let touchPos: cc.Vec2 = this.ringNode.convertToNodeSpaceAR(mousePos);

        let posX:number = this._stickPos.x + touchPos.x;
        let posY:number = this._stickPos.y + touchPos.y;
    }

    /**
     * 摇杆移动结束
     */
    private stickMoveEnd(): void {
        //拖动节点回到起始位置
      //  this.stickNode.setPosition(this.ringNode.getPosition());
        // if (this.touchType == StickType.Follow) {
        //     this.node.opacity = 0;
        // }
    }


    /**
     * 求得向量长度
     */
    private getMag(x: number, y: number): number {
        let res: number = Math.sqrt((x * x) + (y * y));
        return res;
    }

    private clampPos(): void {

    }

}
