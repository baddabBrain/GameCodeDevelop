using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public bool IsLongPressedName(string name, string typed)
        {
            int i = 0;
            int j = 0;

            //确保 输入结果的有效性
            if (name.Length > typed.Length) return false;

            //双指针
            //如果两个字符相等则 都前进一位
            //不相等则判断是否为长按字符   ，当前位置与前一位进行比较
            //相等则说明是长按字符，指针向前移动 否则不是长按字符 直接返回false
            while (i < name.Length && j < typed.Length)
            {
                if (name[i] == typed[j])
                {
                    i++;
                    j++;
                }
                //可能存在数组越界的问题
                else if (j > 0 && typed[j] == typed[j - 1])
                {
                    j++;
                }
                else
                {
                    return false;
                }
            }

            //为什么最后还需要进行一次判断
            //确保整个name字符串遍历完成
            //可能出现typed字符串遍历完成，但是name字符串只遍历了极少数的情况
            //例如 name = abc
            //     type = aaaaaabbbbb

            //如何确保   alex 
            //          alexxr 这种情况    
            //当type还没有遍历完
            //单独判断type字符串 
            while (j < typed.Length)
            {
                if (typed[j] != typed[j - 1])
                {
                    return false;
                }
                else
                {
                    j++;
                }
            }
            return i == name.Length;
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
