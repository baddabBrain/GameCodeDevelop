/**
 * 最大堆
 */
export default class MaxHeap {

    //存放元素的数组（以完全二叉树顺序存储的数组）
    private heap: Array<number>;
    //堆中存放的元素个数
    private count: number = 0;

    //构造函数
    constructor(nums?: Array<number>) {
        if (nums) {
            this.heap = new Array<number>();
            for (let i: number = 0; i < nums.length; i++) {
                this.heap.push(nums[i]);
                this.count++;
                this.siftUp();
            }
        } else {
            this.heap = new Array<number>();
            this.count = 0;
        }
    }

    /**
     * 获取堆中元素的个数
     */
    public getLength(): number {
        return this.count;
    }

    public isEmpty(): boolean {
        return this.count > 0;
    }

    /**
     * 添加元素
     * @param value 添加的元素
     * 默认添加到数组的末尾 插入之前的元素是有序的 此时需要自下而上调整
     */
    public Push(value: number): void {
        this.heap[this.count++] = value;
        this.siftUp();
    }

    /**
     * 删除最大的元素（堆顶元素）
     * 默认删除的是堆顶元素，删除之前的元素是有序的，此时需要自上而下的调整
     */
    public Pop(): void {
        if (this.count < 1) {
            console.log("堆为空");
            return;
        }
        //把堆底元素赋值给堆顶元素
        this.heap[0] = this.heap[this.count - 1];
        this.heap.splice(this.count - 1);
        this.count--;
        this.siftDown();
    }

    //返回堆顶元素
    public Peek(): number {
        return this.heap[0];
    }


    /**
     * 自底向上的调整
     */
    public siftUp(): void {
        if (this.count < 2) {
            console.log("堆中元素只有1个,不需要进行调整");
            return;
        }

        let curIndex: number = this.count - 1;
        let parentIndex: number = Math.floor((curIndex - 1) / 2);
        while (parentIndex >= 0) {
            //当前元素值小于父节点元素值
            if (this.heap[curIndex] <= this.heap[parentIndex]) {
                break;
            }
            let temp: number = this.heap[curIndex];
            this.heap[curIndex] = this.heap[parentIndex];
            this.heap[parentIndex] = temp;
            //交换完成之后，当前节点向上移动一层
            curIndex = parentIndex;
            parentIndex = Math.floor((curIndex - 1) / 2);
        }
    }

    /**
     * 自顶向下调整
     * 下沉过程中需要先比较左子树和右子树节点大小，取出较小者，再与当前节点进行判断
     */
    public siftDown() {
        let curIndex: number = 0;
        let minIndex: number;
        //至少存在左子树
        while ((minIndex = Math.floor(curIndex * 2 + 1)) < this.count) {
            //存在右子树
            if (this.heap[minIndex] < this.heap[minIndex + 1] && minIndex + 1 < this.count) {
                //取左右子树中较大者
                minIndex++;
            }
            if (this.heap[curIndex] >= this.heap[minIndex]) {
                //当前节点小于左右子树（不符合下沉条件）
                break;
            }
            else {
                let temp: number = this.heap[curIndex];
                this.heap[curIndex] = this.heap[minIndex];
                this.heap[minIndex] = temp;
                //交换完成之后，向下移动一层
                curIndex = minIndex;
            }

        }
    }

}
