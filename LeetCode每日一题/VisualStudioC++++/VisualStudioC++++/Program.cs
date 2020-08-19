using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VisualStudioC____
{
    class Program
    {
        static void Main(string[] args)
        {
        }

        public static int WiggleMaxLength(int[] nums)
        {
            //1.原数组进行排序 —— 插入
            //2. 找到数组中的中位数    将小于中位数的元素加入到数组A中  大于中位数的元素添加到数组B中
            //    按照ABABABAB的顺序添加到最终的数组中        时间复杂度O（n）   空间复杂度O（n）
            int length = nums.Length;
            int[] left = new int[];
            int[] right = new int[];
            return 0;
        }
    }
}
