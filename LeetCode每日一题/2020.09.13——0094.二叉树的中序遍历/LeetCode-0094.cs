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



        public List<int> InorderTraversal(TreeNode root)
        {
            List<int> res = new List<int>();
            Stack<ColorNode> sta = new Stack<ColorNode>();
            ColorNode node = new ColorNode(root, true);

            sta.Push(node);

            //中序遍历的顺序为 左根右
            //所以入栈顺序应为 右根左  弹出顺序才能为左根右
            while (sta.Count > 0)
            {
                ColorNode temp = sta.Pop();
                if (temp == null) continue;

                if (temp._visited == true)
                {
                    sta.Push(new ColorNode(temp._node.right, true));
                    sta.Push(new ColorNode(temp._node, false));
                    sta.Push(new ColorNode(temp._node.left, true));
                }
                else
                {
                    res.Add(temp._node.val);
                }
            }
        }


        //public List<int> InorderTraversal(TreeNode root)
        //{
        //    List<int> res = new List<int>();
        //    Helper(root, res);
        //    return res;

        //}

        //public void Helper(TreeNode node, List<int> list)
        //{
        //    //递归终止条件
        //    if (node == null) return;

        //    Helper(node.left, list);
        //    list.Add(node.val);
        //    Helper(node.right, list);

        //}


    }

    public class ColorNode
    {
        public TreeNode _node;
        public bool _visited;
        public ColorNode(TreeNode node, bool value)
        {
            _node = node;
            _visited = value;
        }
    }

    public class TreeNode
    {
        public int val;
        public TreeNode left;
        public TreeNode right;
        public TreeNode(int x )
        {
            val = x;
        }
    }
}
