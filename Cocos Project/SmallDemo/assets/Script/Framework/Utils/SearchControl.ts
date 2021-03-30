import { EventId } from "../../Define/EventId";
import { EVENT } from "../Event/EventMgr";
import Grid, { GridType } from "./Grid";
import MinHeap from "./MinHeap";




//不是正方形的格子如何划分
//当起止点无效时如何处理
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
    private orginPoint: cc.Vec2 = new cc.Vec2(-590, 720);
    //寻路地图的宽（索引）
    private mapWidth: number = 0;
    //寻路地图的高（索引）
    private mapHeight: number = 0;
    //每个格子的宽
    private _gridWidth: number = 0;
    //每个格子的高
    private _gridHeight: number = 0;
    //最小堆
    private _minHeap: MinHeap = new MinHeap();

    private _startXIndex: number = 0;
    private _startYIndex: number = 0;
    private _endXIndex: number = 0;
    private _endYIndex: number = 0;


    /**
     * 初始化二维格子数组
     * @param width 
     * @param height 
     */
    public initMap(width: number, height: number): void {
        this.mapHeight = height;
        this.mapWidth = width;

        this._gridWidth = this.worldWidth / this.mapWidth;
        this._gridHeight = this.worldHeight / this.mapHeight;

        let mapInfo: Array<Array<number>> = [
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 2, 1, 1, 1, 1, 1, 3, 3, 3, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 0, 0, 1, 1, 3, 3, 3, 3, 0, 0, 1, 1, 4, 4, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 0, 0, 1, 4, 4, 4, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 0, 0, 1, 4, 4, 4, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 0, 1, 1, 1, 4, 4, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 0, 1, 1, 1, 4, 4, 0, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 4, 4, 0, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 2, 0, 0, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        for (let i = 0; i < width; i++) {
            this.grids[i] = [];
            for (let j = 0; j < height; j++) {
                let grid: Grid = new Grid(i, j, this._gridWidth, this._gridHeight, this.orginPoint, GridType.Normal);
                if (mapInfo[i][j] == 0) {
                    grid.type = GridType.Barrier;
                    grid.cost = 100;
                    EVENT.emit(EventId.ON_CREATE_BARRIER, grid.posX, grid.posY);
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
        //取得起点位置在二维数组中的具体格子索引
        this._startXIndex = this.compareFloorOrRound((startPos.x - this.orginPoint.x), this._gridWidth);
        this._startYIndex = this.compareFloorOrRound((this.orginPoint.y - startPos.y), this._gridHeight);
        //取得终点位置在二维数组中的具体格子索引
        this._endXIndex = this.compareFloorOrRound((endPos.x - this.orginPoint.x), this._gridWidth);
        this._endYIndex = this.compareFloorOrRound((this.orginPoint.y - endPos.y), this._gridHeight);

        //判断起止点是否有效
        if (this._startXIndex < 0 || this._startXIndex >= this.mapWidth || this._startYIndex < 0 || this._startYIndex >= this.mapHeight ||
            this._endXIndex < 0 || this._endXIndex >= this.mapWidth || this._endYIndex < 0 || this._endYIndex >= this.mapHeight) {
            console.warn("起止点位置超出地图！");
            return null;
        }

        let startGrid: Grid = this.grids[this._startXIndex][this._startYIndex];
        let endGrid: Grid = this.grids[this._endXIndex][this._endYIndex];

        //在寻路之前先把起止点位置都修正成有效的点，避免死路
        //当起点错误时，寻找距离起点最近的一个有效点，移动到该点后再继续寻路
        if (startGrid.type == GridType.Barrier) {
            startGrid = this.searchVaildPoint(startGrid);
        }

        //当终点错误时，寻找距离终点最近的一个有效点，移动到该点后结束
        if (endGrid.type == GridType.Barrier) {
            //在closeList中从后往前返回最近的有效点？ 而不是在终点周围寻找？
            //closeList中的点在寻路开始前无法确定
            endGrid = this.searchVaildPoint(endGrid);
        }

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


    //自定义排序方法A
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

    //寻找当前点周围的最近的有效点
    //如果周围点没有合适的点，递归寻找直到找到合适的位置
    //当终点无效时能否直接使用closeList[length-1]的点？
    public searchVaildPoint(curGrid: Grid): Grid {
        let curX: number = curGrid.xIndex;
        let curY: number = curGrid.yIndex;

        if (curX < 0 || curX >= this.mapWidth || curY < 0 || curY >= this.mapHeight) {
            return;
        }

        let leftupGrid: Grid = this.grids[curX - 1][curY - 1];
        let upGrid: Grid = this.grids[curX][curY - 1];
        let rightupGrid: Grid = this.grids[curX + 1][curY - 1];
        let leftGrid: Grid = this.grids[curX - 1][curY];
        let rightGrid: Grid = this.grids[curX + 1][curY];
        let leftdownGrid: Grid = this.grids[curX - 1][curY + 1];
        let downGrid: Grid = this.grids[curX][curY + 1];
        let rightdownGrid: Grid = this.grids[curX + 1][curY + 1];

        let curList: Array<{ grid: Grid, dis: number }> = [];

        if (leftupGrid.type == GridType.Normal) {
            curList.push({ grid: leftupGrid, dis: 14 });
        }
        if (upGrid.type == GridType.Normal) {
            curList.push({ grid: upGrid, dis: 10 });
        }
        if (rightupGrid.type == GridType.Normal) {
            curList.push({ grid: rightupGrid, dis: 14 });
        }
        if (leftGrid.type == GridType.Normal) {
            curList.push({ grid: leftGrid, dis: 10 });
        }
        if (rightGrid.type == GridType.Normal) {
            curList.push({ grid: rightGrid, dis: 10 });
        }
        if (leftdownGrid.type == GridType.Normal) {
            curList.push({ grid: leftdownGrid, dis: 14 });
        }
        if (downGrid.type == GridType.Normal) {
            curList.push({ grid: downGrid, dis: 10 });
        }
        if (rightdownGrid.type == GridType.Normal) {
            curList.push({ grid: rightdownGrid, dis: 14 });
        }

        if (curList.length > 0) {
            //排序
            curList.sort(this.sortVaildList);
            return curList[0].grid;
        }
        else {
            //如果最近的点全部都无效 如何进行第二轮
            //递归？  存在栈溢出
            //二次寻找的时候去重问题
            let durX: number = this._endXIndex - curGrid.xIndex;
            let durY: number = this._endYIndex - curGrid.yIndex;

            if (durX > 0 && durY > 0) {
                return this.searchVaildPoint(leftGrid);
            }
            else if (durX < 0 && durY < 0) {
                return this.searchVaildPoint(rightGrid);
            }
            else {
                return this.searchVaildPoint(downGrid);
            }
        }
    }

    /**
     * 自定义排序B
     */
    private sortVaildList(infoA: { grid: Grid, dis: number }, infoB: { grid: Grid, dis: number }): number {
        if (infoA.dis >= infoB.dis) {
            return 1;
        }
        else {
            return -1;
        }
    }

}
