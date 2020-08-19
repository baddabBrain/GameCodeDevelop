using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {


        }


        //高度平衡二叉树   ————左子树高度 和右子树高度 相差不超过1  即 Math.Abs(left,right) <=1
        //判断整个二叉树是否为高度平衡二叉树
        //1.判断当前子树是否为平衡树
        //2.判断当前子树的左子树是否为平衡树
        //3.判断当前子树的右子树是否为平衡树
        public static bool IsBalanced(TreeNode root)
        {
            if (root == null) return true;


            return Height(root) == -1 ? false : true;
        }


        //当节点root 左 / 右子树的高度差 <2 ：则返回以节点root为根节点的子树的最大高度，即节点 root 的左右子树中最大高度加 1 （ max(left, right) + 1 ）
        //当节点root 左 / 右子树的高度差 ≥2 ：则返回 -1 ，代表 此子树不是平衡树 。

        //递归终止条件：
        //当越过叶子节点时，返回高度 0 ；
        //当左（右）子树高度 left== -1 时，代表此子树的 左（右）子树 不是平衡树，因此直接返回 -1 ；

        public static int Height(TreeNode root)
        {
            if (root == null) return 0;

            int left = Height(root.left);
            if (left == -1) return false;
            int right = Height(root.right);
            if (right == -1) return false;

            return Math.Abs(left - right) <= 1 ? Math.Max(left, right) + 1 : -1;

        }



        //方法二
        public bool isBalanced(TreeNode root)
        {
            if (root == null) true;

            return Math.Abs(Height(root.left) - Height(root.right)) <= 1 && IsBalanced(root.left) && IsBalanced(root.right);
        }

        public int Height(TreeNode root)
        {
            if (root == null) return 0;
            return Math.Max(Height(root.left), Height(root.right)) + 1;
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
