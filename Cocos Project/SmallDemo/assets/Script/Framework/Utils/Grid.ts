const { ccclass } = cc._decorator;

export enum GridType {
    /**
     * 障碍物
     */
    Barrier,

    /**
     * 正常
     */
    Normal
}



/** 寻路算法中的格子类 */
@ccclass
export default class Grid {

    //格子如何划分
    //如何抽象到二维数值中
    private _width: number = 0;
    private _height: number = 0;
    //格子的X轴坐标（世界坐标）
    public posX: number = 0;
    //格子的Y轴坐标
    public posY: number = 0;
    //最终的寻路消耗  f = g + h
    public fDis: number = 0;
    //距离起点的距离
    public gDis: number = 0;
    //距离终点的距离
    public hDis: number = 0;
    //当前格子的父对象
    public parent: Grid = null;
    //当前格子在二维数组中的X索引
    public xIndex: number = 0;
    //Y索引
    public yIndex: number = 0;
    //格子种类
    public type: GridType = GridType.Normal;
    //寻路权重
    public cost: number = 0;


    /**
     * 
     * @param x X索引
     * @param y Y索引
     * @param width 格子宽度
     * @param height 格子长度
     * @param orginPoint 整个二维数组的起点（世界坐标）
     * @param type 格子类型
     */
    constructor(x: number, y: number, width?: number, height?: number, orginPoint?: cc.Vec2, type?: GridType, cost = 1) {
        this.xIndex = x;
        this.yIndex = y;
        this.posX = x * width + orginPoint.x;
        this.posY = orginPoint.y - y * height;
        this._width = Math.round(width);
        this._height = Math.round(height);
        if (type) {
            this.type = type;
        }
        this.cost = cost;
    }

}
