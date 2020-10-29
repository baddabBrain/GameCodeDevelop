using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public int SumNumbers(TreeNode root)
        {
            int res = 0;
            if (root == null) return 0;
            return Helper(root, res);
        }

        public int Helper(TreeNode root, int res)
        {
            //递归的终止条件
            // 当前节点为空
            if (root == null) return 0;

            //本次递归需要进行什么操作
            //累加数字 
            res = res * 10 + root.val;           

            //? 为什么要单独判断 左右节点都为空的情况
            //如果去掉这一段  则整个递归只有一个返回值 0；
            //当前节点的左右节点都为空时，则当前节点为叶子节点，这一条路已经走到了尽头 需要返回累加的结果
            // 如果当前节点为叶子节点。则累加。
            if (root.left == null && root.right == null)
            {
                return res;
            }

            //本次递归需要给上层递归的什么返回值
            // 如果当前节点非叶子节点，则继续计算器下一个节点的和。
            //累加的结果 *10
            return Helper(root.left, res) + Helper(root.right, res);
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
