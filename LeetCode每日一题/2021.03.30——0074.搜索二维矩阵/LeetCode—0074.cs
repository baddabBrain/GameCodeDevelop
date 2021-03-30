using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public bool SearchMatrix(int[][] matrix, int target)
        {
            //Tips1:暴力穷举
            //Tips2:利用升序特性
            //Tip3:二分查找


        }

        // :Tips1: 暴力穷举法   O(N^2)
        // {
        //     int col = matrix.Length;
        //         int row = matrix[0].Length;

        //         for(int i = 0;i<col;i++)
        //         {
        //             for(int j = 0;j<row;j++)
        //             {
        //                 if(matrix[i][j] == target)
        //                 {
        //                     return true;
        //                 }
        //             }
        //         }

        //         return false;
        // }


        // Tips2：利用升序特性     O(N)
        // {
        //        //从左到右  从上到下 全部都是升序
        //         //右上角  or  左下角 开始
        //         int i = matrix.Length -1;
        //         int j = 0;
        //         while(i>=0 && j< row)
        //         {   
        //             if(matrix[i][j] > target)
        //             {
        //                 i--;
        //             }
        //             else if(matrix[i][j] < target)
        //             {
        //                 j++;
        //             }
        //             else{
        //                 return true;
        //             }
        //         }

        //         return false;
        // }



        //Tips3:二分查找
        //{
        //    //将二维数组  看做是以为一维数组
        //    //一维数值的总length = row * col
        //    int col = matrix[0].Length;
        //    int row = matrix.Length;

        //    int left = 0;
        //    int right = col * row -1;
        //    while(left<=right)
        //    {
        //        int mid = left + (right - left)/2;
        //        if(matrix[mid/col][mid%col] > target)
        //        {
        //            right = mid -1;
        //        }
        //        else if(matrix[mid/col][mid%col] <target)
        //        {
        //            left = mid +1;
        //        }
        //        else{
        //            return true;
        //        }

        //    }
        //    return false;
        // }


















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
