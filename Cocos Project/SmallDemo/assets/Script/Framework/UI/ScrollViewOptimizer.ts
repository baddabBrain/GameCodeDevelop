
/*
 * @Description: ScrollView优化器
 * @Author: chenguanhui
 * @Date: 2019-08-14 16:18:52
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-16 10:11:30
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollViewOptimizer extends cc.Component {

    @property(cc.Prefab)
    itemTemplate: cc.Prefab = null;

    /**
     * item之间的间隔
     */
    @property
    spacing: number = 0;

    /**
     * view中能显示多少行
     */
    @property
    visibleRowCount: number = 5;

    /**
     * 除显示外额外多缓存得行数
     */
    @property
    extraCahe: number = 2;


    /**
     * 每行有多少个item
     */
    @property
    colCount: number = 1;

    private scrollView: cc.ScrollView;

    private content: cc.Node;


    /**
     * 缓存多少行
     */
    private cacheRow: number = 0;

    /**
     * 存储实际创建的项数组
     */
    private items: Array<cc.Node> = [];

    /**
     * 单个item的高度
     */
    private itemHeight: number = 0;

    /**
     * 单个item的宽度
     */
    private itemWidth: number = 0;

    /**
     * 初始创建的item个数
     */
    private spawnCount: number = 0;

    /**
     * 缓存区域
     */
    private bufferZone: number = 0;

    /**
     * 是否初始化
     */
    private isInit: boolean = false;

    /**
     * 是否可以更新
     */
    private canUpdateFrame: boolean = true;

    /**
     * 列表数据
     */
    private data: Array<any> = [];

    /**
     * item更新回调通知函数
     */
    private itemUpdateFunc: Function;

    /**
     * 根据数据长度计算的总行数
     */
    private totalRow: number;

    /**
     * 上次滑动到的y坐标
     */
    private lastContentPosY: number;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // 缓存多少行
        this.cacheRow = this.visibleRowCount + this.extraCahe;
        this.visibleRowCount = Math.ceil(this.visibleRowCount);

        // 计算itemTemplete的宽高
        const item: cc.Node = cc.instantiate(this.itemTemplate);
        this.itemHeight = item.height;
        this.itemWidth = item.width;

        // 初始化的item个数
        this.spawnCount = this.cacheRow * this.colCount;

        // 缓存区域高度(一半)
        this.bufferZone = this.cacheRow * (this.itemHeight + this.spacing) / 2;

        this.scrollView = this.node.getComponent(cc.ScrollView);
        this.content = this.scrollView.content;
        this.content.on(cc.Node.EventType.POSITION_CHANGED, this._updateContentView.bind(this));
    }


    /**
     * 重置数据
     * @param data 
     * @param callBack 
     */
    setData(data: Array<any>, callBack: Function): void {
        this.isInit = false;
        this.canUpdateFrame = true;
        this.isInit = this.initialize(data, callBack);
    }

    /**
     * 列表初始化
     * @param data 
     * @param callBack 
     */
    private initialize(data: Array<any>, callBack: Function): boolean {
        if (!callBack || !data || data.length === 0 || !this.itemTemplate || !this.scrollView) {
            cc.log('初始化失败，请检查所有必要参数');
            return false;
        }

        this.data = data;
        this.itemUpdateFunc = callBack;
        this.totalRow = Math.ceil(data.length / this.colCount);
        this.lastContentPosY = 0;

        this.content.removeAllChildren();

        // layout组件会使item的位置无法正确更新，先移除
        if (this.content.getComponent(cc.Layout)) {
            this.content.removeComponent(cc.Layout);
        }

        // 获取整个content的高度和宽度
        this.content.height = this.totalRow * (this.itemHeight + this.spacing) + this.spacing;
        this.content.width = this.colCount * (this.itemWidth + this.spacing) + this.spacing;

        // 创建item实例
        let row : number = 0;
        for (let i : number = 0; i < this.spawnCount; i += this.colCount) {
            const itemY : number = -this.itemHeight * (0.5 + row) - this.spacing * (row + 1);
            for (let j : number = 0; j < this.colCount; j++) {
                
                const itemId : number = i + j;
                let item: cc.Node = null;

                // items有就直接拿，否则创建新的放进去
                if (itemId >= this.items.length) {
                    item = cc.instantiate(this.itemTemplate);
                    this.items.push(item);
                } else {
                    item = this.items[itemId];
                }

                this.content.addChild(item);

                // 设置该item的坐标和itemId, itemId是指item显示的第几个数据
                //（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
                const itemX : number = (j + 0.5) * this.itemWidth + this.spacing * (j + 1) - this.content.width / 2;
                item.setPosition(itemX, itemY);
                item['itemId'] = itemId;

                // 当前列有数据显示，没有就隐藏
                if (itemId >= this.data.length) {
                    item.active = false;
                } else {
                    item.active = true;
                    this.itemUpdateFunc(itemId, item, this.data[itemId]);
                }
            }
            row++;
        }
        
        return true;
    }


    /**
     * 返回item在ScrollView空间的坐标值
     * @param item 
     */
    getPositionInView(item: cc.Node) {
        const worldPos: cc.Vec2 = item.parent.convertToWorldSpaceAR(item.position);
        const viewPos: cc.Vec2 = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

    /**
     * content位置改变时调用，根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
     */
    private _updateContentView() {

        // we don't need to do the math every frame   
        if (!this.isInit || !this.canUpdateFrame) {
            return;
        }
        
        this.canUpdateFrame = false;

        const items: Array<cc.Node> = this.items;
        const isDown: boolean = this.scrollView.content.y < this.lastContentPosY;

        // offset为缓冲区高度，item总是上移或下移一个缓冲区高度
        // BufferZone和-BufferZone为ScrollView中，缓冲区上边界和下边界的位置
        const offset: number = (this.itemHeight + this.spacing) * this.cacheRow;
        let newY: number = 0;

        for (let i: number = 0; i < items.length; i += this.colCount) {
            const viewPos: cc.Vec2 = this.getPositionInView(items[i]);
            if (isDown) {
                newY = items[i].y + offset;
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    for (let j = 0; j < this.colCount; j++) {
                        const index : number = j + i;
                        items[index].y = newY;
                        const itemId : number = items[index]['itemId'] - this.spawnCount;
                        items[index]['itemId'] = itemId;
                        if (itemId >= 0) {
                            items[index].active = true;
                            this.itemUpdateFunc(itemId, items[index], this.data[itemId]);
                        } else {
                            items[index].active = false;
                        }
                    }
                }
            } else {
                newY = items[i].y - offset
                if (viewPos.y > this.bufferZone && newY > -this.content.height) {
                    for (let j = 0; j < this.colCount; j++) {
                        const index = j + i;
                        items[index].y = newY;
                        const itemId = items[index]['itemId'] + this.spawnCount;
                        items[index]['itemId'] = itemId;
                        if (itemId < this.data.length) {
                            items[index].active = true;
                            this.itemUpdateFunc(itemId, items[index], this.data[itemId]);
                        } else {
                            items[index].active = false;
                        }
                    }
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
        this.canUpdateFrame = true;
    }


}
