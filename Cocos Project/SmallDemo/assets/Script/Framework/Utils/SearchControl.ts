import Grid, { GridType } from "./Grid";




const { ccclass } = cc._decorator;

/** 寻路控制器 */
@ccclass
export default class SearchControl {

    private static _instance: SearchControl;

    public static get Inst() {
        if (this._instance == null) {
            this._instance = new SearchControl();
        }
        return this._instance;
    }

    //格子二维数组
    public grids: Array<Array<Grid>> = [];
    //开启列表
    private _openList: Array<Grid> = [];
    //关闭列表
    private _closeList: Array<Grid> = [];
    //结果列表
    private _resultList: Array<Grid> = [];
    //整张地图的宽
    private worldWidth: number = 1226;
    //整张地图的高
    private worldHeight: number = 1500;
    //地图的原点
    private orginPoint: cc.Vec2 = new cc.Vec2(-587, 802);
    //寻路地图的宽（索引）
    private mapWidth: number = 0;
    //寻路地图的高（索引）
    private mapHeight: number = 0;


    /**
     * 初始化二维格子数组
     * @param width 
     * @param height 
     */
    public initMap(width: number, height: number): void {
        this.mapHeight = height;
        this.mapWidth = width;
        //单个格子的长和宽
        let gridWidth: number = this.worldWidth / this.mapWidth;
        let gridHeight: number = this.worldHeight / this.mapHeight;
        let mapInfo: Array<Array<number>> = []

        for (let i = 0; i < width; i++) {
            this.grids[i] = [];
            for (let j = 0; j < height; j++) {
                let grid: Grid = new Grid(i, j, gridWidth, gridHeight, this.orginPoint, GridType.Normal);
                if (mapInfo[i][j] == 0) {
                    grid.type = GridType.Barrier;
                    grid.cost = 100;
                }
                this.grids[i].push(grid);
            }
        }
    }

    /**
     * 返回最短路径
     * @param startPos 
     * @param endPos 
    */
    public searchMinPath(startPos: cc.Vec2, endPos: cc.Vec2): Array<Grid> {
        this._resultList = [];

        //只能取得一个格子的具体位置  建筑物所占的位置可能包括障碍物点和正常点

        //取得起点位置在二维数组中的具体格子索引
        let startXIndex: number = this.compareFloorOrRound((startPos.x - this.orginPoint.x), 51);
        let startYIndex: number = this.compareFloorOrRound((this.orginPoint.y - startPos.y), 63);
        //取得终点位置在二维数组中的具体格子索引
        let endXIndex: number = this.compareFloorOrRound((endPos.x - this.orginPoint.x), 51);
        let endYIndex: number = this.compareFloorOrRound((this.orginPoint.y - endPos.y), 63);


        //判断起止点是否有效
        if (startXIndex < 0 || startXIndex >= this.mapWidth || startYIndex < 0 || startYIndex >= this.mapHeight ||
            endXIndex < 0 || endXIndex >= this.mapWidth || endYIndex < 0 || endYIndex >= this.mapHeight) {
            console.warn("起止点位置超出地图！");
            return null;
        }

        let startGrid: Grid = this.grids[startXIndex][startYIndex];
        let endGrid: Grid = this.grids[endXIndex][endYIndex];

        // //判断是不是障碍物点
        // if (startGrid.type == GridType.Barrier || endGrid.type == GridType.Barrier) {
        //     console.warn("起止点位置类型错误！");
        //     return null;
        // }

        //清空上一次相关数据
        this._closeList = [];
        this._openList = [];

        startGrid.parent = null;
        startGrid.fDis = 0;
        startGrid.hDis = 0;
        startGrid.gDis = 0;

        //将起点放入关闭列表中
        this._closeList.push(startGrid);

        while (true) {
            //得到起点周围的八个点
            //左上
            this.gridToOpenList(startGrid.xIndex - 1, startGrid.yIndex - 1, 14, startGrid, endGrid);
            //上
            this.gridToOpenList(startGrid.xIndex, startGrid.yIndex - 1, 10, startGrid, endGrid);
            //右上
            this.gridToOpenList(startGrid.xIndex + 1, startGrid.yIndex - 1, 14, startGrid, endGrid);

            //左
            this.gridToOpenList(startGrid.xIndex - 1, startGrid.yIndex, 10, startGrid, endGrid);
            //右
            this.gridToOpenList(startGrid.xIndex + 1, startGrid.yIndex, 10, startGrid, endGrid);

            //右下
            this.gridToOpenList(startGrid.xIndex - 1, startGrid.yIndex + 1, 14, startGrid, endGrid);
            //下
            this.gridToOpenList(startGrid.xIndex, startGrid.yIndex + 1, 10, startGrid, endGrid);
            //左下
            this.gridToOpenList(startGrid.xIndex + 1, startGrid.yIndex + 1, 14, startGrid, endGrid);

            if (this._openList.length == 0) {
                console.warn("死路");
                return null;
            }

            //在开启列表中选出f值最小的点
            this._openList.sort(this.Sort);
            this._closeList.push(this._openList[0]);
            //将值最小的点作为新的起点
            startGrid = this._openList[0];
            this._openList.splice(0);

            if (startGrid == endGrid) {
                //找到路径
                this._resultList.push(endGrid);
                while (endGrid.parent != null) {
                    this._resultList.push(endGrid.parent);
                    endGrid = endGrid.parent;
                }
                this._resultList.reverse();
                return this._resultList;
            }
        }
    }


    //自定义排序方法
    //算出三种不同路径  不一定是最短路径 再从路径中随机选择一条
    private Sort(gridA: Grid, gridB: Grid): number {
        if (gridA.fDis >= gridB.fDis) {
            return 1;
        }
        else {
            return -1;
        }
    }


    //把临近的点放入到开启列表中
    private gridToOpenList(xIndex: number, yIndex: number, gDis: number, parent: Grid, endGrid: Grid): void {
        let x: number = xIndex;
        let y: number = yIndex;

        if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
            return;
        }

        let curGrid: Grid = this.grids[xIndex][yIndex];

        if (curGrid == null || curGrid.type == GridType.Barrier || this._closeList.indexOf(curGrid) != -1 || this._openList.indexOf(curGrid) != -1) {
            return;
        }

        //记录父对象
        curGrid.parent = parent;
        //计算G值
        curGrid.gDis = gDis + parent.gDis;
        curGrid.hDis = 10 * Math.sqrt((endGrid.posX - curGrid.posX) * (endGrid.posX - curGrid.posX) + (endGrid.posY - curGrid.posY) * (endGrid.posY - curGrid.posY));
        // curGrid.hDis = Math.abs(endGrid.xIndex - curGrid.xIndex) * 10 + Math.abs(endGrid.yIndex - curGrid.yIndex) * 10;
        curGrid.fDis = curGrid.gDis + curGrid.hDis * curGrid.cost;

        this._openList.push(curGrid);
    }

    /**
     * 判断向上取整和向下取整
     * @param value 被除数
     * @param divisor 除数
     */
    public compareFloorOrRound(value: number, divisor: number): number {
        let floor: number = Math.floor(value / divisor);
        let round: number = Math.round(value / divisor);
        let cur: number = value / divisor;

        //距离哪个值的绝对值小就返回哪个值
        return Math.abs(cur - floor) > Math.abs(cur - round) ? round : floor;
    }
}
