using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public string Multiply(string nums1, string nums2)
        {

            int m = num1.Length;
            int n = num2.Length;

            if (num1 == "0" || num2 == "0") return "0";

            //字符串转化为数组
            int[] n1 = new int[m];
            int[] n2 = new int[n];

            for (int i = 0; i < m; i++)
            {
                n1[i] = num1[i] - '0';
            }

            for (int i = 0; i < n; i++)
            {
                n2[i] = num2[i] - '0';
            }

            //1.声明一个新的数组来存放两数相乘的结果
            int[] nums = new int[m + n];

            //从后开始存入  模拟数字相乘的过程
            for (int i = m - 1; i >= 0; i--)
            {
                for (int j = n - 1; j >= 0; j--)
                {
                    //为什么要+1   因为定义的新数组长度为i+j  而 i*j 结果的长度一定小于 i+j
                    //如果不+1 则新数组中的最后一位为0 相当于把原结果扩大了10倍
                    nums[i + j + 1] += n1[i] * n2[j];
                }
            }

            //统一进位操作
            for (int i = nums.Length - 1; i >= 1; i--)
            {

                nums[i - 1] += nums[i] / 10;
                nums[i] = nums[i] % 10;

            }

            //进位完成之后去除首部的0
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < nums.Length; i++)
            {
                sb.Append(nums[i]);
            }

            string res = sb.ToString().TrimStart('0');
            return res.Length == 0 ? "0" : res;



        }
    }
}
