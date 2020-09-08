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
            int[] nums = new int[] {1,1,2,1,2,2,1};
            
            Console.WriteLine();
            Console.ReadKey();
        }

        public int[] TopKFrequent(int[] nums, int k)
        {
            Dictionary<int, int> dic = new Dictionary<int, int>();
            int[] res = new int[k];


            //将所有元素出现的次数和具体的值存储到字典中
            for (int i = 0; i < nums.Length; i++)
            {
                if (dic.ContainsKey(nums[i]))
                {
                    dic[nums[i]]++;
                }
                else
                {
                    dic.Add(nums[i], 1);
                }
            }

            //2.字典排序  输出前K个数

            for (int j = 0; j < k; j++)
            {
                var maxKey = (from d in dic orderby d.Value descending select d.Key).First();
                res[j] = maxKey;
                dic.Remove(maxKey);
            }
            return res; 
        }



    }
}
