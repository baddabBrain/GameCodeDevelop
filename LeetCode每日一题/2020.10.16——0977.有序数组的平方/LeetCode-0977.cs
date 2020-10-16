using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public int[] SortedSquares(int[] A)
        {

            int length = A.Length;
            int[] res = new int[length];
            if (length == 0) return res;

            int i = 0;
            int j = length - 1;
            int k = length - 1;

            //平方后再排序？
            //递增数组  判断绝对值？
            //双指针？ 一个指向第一个元素  一个指向最后一个元素
            //第一个元素和最后一个元素的绝对值一定大于或小于其他元素
            while (i <= j)
            {
                int end = A[j] * A[j];
                int start = A[i] * A[i];
                if (end > start)
                {
                    res[k] = end;
                    j--;
                }
                else
                {
                    res[k] = start;
                    i++;
                }
                k--;
            }

            return res;

        }


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
