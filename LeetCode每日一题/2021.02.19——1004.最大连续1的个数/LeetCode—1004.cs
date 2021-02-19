using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public int LongestOnes(int[] A, int K)
        {
            int len = A.Length;

            int i = 0, j = 0;
            int res = 0;
            int num = 0;

            //左右指针分别指向滑动窗口的两端
            while (j < len)
            {
                //右指针主动移动
                //左指针被动移动
                //当滑动窗口中的0的个数（num） 大于 K 时（可以等于K），左指针移动
                //移动到窗口中的0个数小于等于K时，左指针停止移动

                if (A[j] == 0)
                {
                    //滑动窗口中0的个数++
                    num++;
                }

               
                //判断滑动窗口中的0个数是否超出限制
                while (num > K)
                {
                    if (A[i] == 0)
                    {
                        num--;
                    }
                    i++;
                }

                //判断结果  
                res = Math.Max(res, j - i + 1);
                //右指针主动移动
                j++;
                
            }
           
            return res;
        }





        /**
         * 滑动窗口基本解题思路
         * 
         * int left,right = 0;
         * while(right<nums.Length)
         * {
         *    //扩张窗口
         *    right++;
         *    
         *    //不满足
         *    while(不满足窗口条件)
         *    {
         *       //缩小窗口
         *       left --;
         *    }
         * }
         */
















        public class Node
        {
            public int val;
            public Node left;
            public Node right;
            public Node next;

            public Node() { }

            public Node(int _val)
            {
                val = _val;
            }

            public Node(int _val, Node _left, Node _right, Node _next)
            {
                val = _val;
                left = _left;
                right = _right;
                next = _next;
            }
        }


        public class TreeNode
        {
            public int val;
            public TreeNode left;
            public TreeNode right;
            public TreeNode(int x) { val = x; }
        }


    }
}
