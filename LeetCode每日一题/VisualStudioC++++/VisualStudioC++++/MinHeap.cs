using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VisualStudioC____
{
    //小根堆
    class MinHeap
    {
        //1.取出堆顶元素
        //2.插入元素   存入堆的最末尾  然后更新整个堆的顺序
        //3.


        //小根堆实际是按照完全二叉树顺序存储的数组集合
        private List<int> res = new List<int>();

        /**
         * 插入操作    
         * 将新元素插入到数组的最后，然后再更新整个堆的顺序
         */
        public void Insert(int value)
        {
            res.Add(value);
            int index = res.Count - 1;
        }
    }
}
