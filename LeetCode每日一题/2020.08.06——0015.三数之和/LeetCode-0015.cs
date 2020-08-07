using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeetCode
{
    class Program
    {

    }

    //三数之和
    //一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请找出所有满足条件且不重复的三元组。


    //n^3 全部遍历 得到所有符合要求的数组（怎么去重）


    // a+b +c= 0   ==>   a+b = -c  
    //将三数之后转变为两数之和

    public List<List<int>> ThreeSum(int[] nums)
    {
        List<List<int>> res = new List<List<int>>();

        if (nums == null || nums.Length <= 2) return res;

        Array.Sort(nums);

        for (int i = 0; i < nums.Length; i++)
        {
            if (nums[i] > 0) break;   //第一个数大于0 ，后面的数都比它大， a+b+c一定会大于0 不符合要求

            if (i > 0 && nums[i] == nums[i - 1]) continue;  //结果数组中不能包含重复的元素

            int j = i + 1;  //左指针
            int k = nums.Length - 1;   //右指针
            int temp = -nums[i];     //将 a+b+c = 0  三数之和问题 转变为  a+b = -c 两数之和问题

            while (j < k)
            {
                if (nums[j] + nums[k] == temp)
                {
                    List<int> arr = new List<int>();
                    //将符合要求的元素值添加到临时数组中
                    arr.Add(nums[i]);
                    arr.Add(nums[j]);
                    arr.Add(nums[k]);
                    //将符合要求的数组添加到数组集合中
                    res.Add(arr);
                    j++;
                    k--;

                    //去重     j从左向右(判断是否重复需要从和前一个对比（即左边的一个）)     k从右向左
                    while (j < k && nums[j] == nums[j - 1]) j++;
                    while (j < k && nums[k] == nums[k + 1]) k--;
                }
                else if (nums[j] + nums[k] > temp)
                {
                    k--;
                }
                else
                {
                    j++;
                }

            }
        }

        return res;
    }
}
