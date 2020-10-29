using System;
using System.Collections;
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

 
  
            Console.ReadKey();
        }



        public int SumNumbers(TreeNode root)
        {
            int res = 0;
            if (root == null) return 0;

            return Helper(root, res);
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
