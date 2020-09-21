using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        public int sum = 0;
        public TreeNode ConvertBST(TreeNode root)
        {

            if (root == null) return root;

            //累加所有大于它的节点的值
            //二叉搜索树  左节点<根节点<右节点
            //将二叉搜索树按照递减的顺序添加到数组中
            //每个节点只需要加上该节点索引之前的所有数即可


            //降序顺序   右根左


            //首先递归到最右的节点
            //最右节点最大  不需要修改 ，修改根节点和左节点
            ConvertBST(root.right);
            //此时根节点为 最右的子节点 _right
            //最右左节点为空  右节点也为空
            //此时_right 即为当前递归的根节点
            //将根节点的值累加起来
            sum += root.val;
            root.val = sum;
            ConvertBST(root.left);
            return root;
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
