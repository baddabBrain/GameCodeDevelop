﻿using System;
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
            int[] nums = new int[] {2,3,6,7};
            int target = 7;
            List<List<int>> res = new List<List<int>>();

            res = CombinationSum(nums, target);
            foreach (var item in res)
            {
                for (int i = 0; i < item.Count; i++)
                {
                    Console.WriteLine(item[i]);
                }
            }
            
            Console.ReadKey();
        }

        public static List<List<int>> CombinationSum(int[] candidates, int target)
        {
            List<List<int>> res = new List<List<int>>();
            //排完序之后  相同的元素一定相邻
            Array.Sort(candidates);
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

            //相当于遍历N叉树的子节点
            for (int i = start; i < candidates.Length; i++)
            {
                //如果当前target 小于 减数   则相减的结果<0 不符合要求直接跳过
                if (target < candidates[i])
                {
                    break;
                }

                if (i > start && candidates[i] == candidates[i - 1])
                {
                    continue;
                }
                //将符合要求的减数添加到子数组中
                cur.Add(candidates[i]);
                
                Helper(candidates, target - candidates[i], res, cur, i+1);
                cur.Remove(cur.Count - 1);
            }


        }



    }
}
