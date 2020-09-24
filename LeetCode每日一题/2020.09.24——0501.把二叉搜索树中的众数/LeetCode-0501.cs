using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        //上一次节点的值
        public int preNode = 0;
        //最大的出现次数
        public int max = 0;
        //当前的出现次数
        public int cur = 0;

        public List<int> res = new List<int>();

        public int[] FindMode(TreeNode root)
        {
            if (root == null) return res.ToArray();
            Helper(root);
            return res.ToArray();
        }

        public void Helper(TreeNode root)
        {
            if (root == null) return;

            Helper(root.left);

            int nodeValue = root.val;
            if (nodeValue == preNode)
            {
                //如果当前节点的值和上一个节点值相等
                //即 num[i] == num[i+1]
                cur++;
            }
            else
            {
                //不相等的重新计算
                cur = 1;
                preNode = root.val;
            }

            if (cur == max)
            {
                res.Add(root.val);
            }
            else if (cur > max)
            {
                //当前元素出现次数超过最大值  则说明最大值所对应的元素不是众数
                //将数组清空  将当前元素填入
                res.Clear();
                max = cur;
                res.Add(root.val);
            }
            Helper(root.right);

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
