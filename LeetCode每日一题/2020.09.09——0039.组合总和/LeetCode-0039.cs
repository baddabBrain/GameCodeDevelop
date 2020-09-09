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


        public static List<List<int>> CombinationSum(int[] candidates, int target)
        {
            List<List<int>> res = new List<List<int>>();
            Helper(candidates, target, res, new List<int>(), 0);
            return res;

        }

        public static void Helper(int[] candidates, int target, List<List<int>> res, List<int> cur, int start)
        {
            //如果target减为0时，则说明存在一组符合要求的子数组
            if (target == 0)
            {
                res.Add(new List<int>(cur));
                return;
            }

            //相当于遍历N叉树的子节点    上一次递归使用过的数就不再使用了
            for (int i = start; i < candidates.Length; i++)
            {
                //如果当前target 小于 减数   则相减的结果<0 不符合要求直接跳过
                if (target < candidates[i])
                {
                    continue;
                }
                List<int> list = new List<int>(cur);
                //将符合要求的减数添加到子数组中
                list.Add(candidates[i]);
                Helper(candidates, target - candidates[i], res, list, i);

            }


        }


    }
