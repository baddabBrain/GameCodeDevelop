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

            if (nums1 == "0" || nums2 == "0")
            {
                return "0";
            }

            int m = nums1.Length;
            int n = nums2.Length;

            //将字符串转化为数组
            int[] n1 = new int[m];
            int[] n2 = new int[n];

            int[] pos = new int[m + n];

            for (int i = 0; i < m; i++)
            {
                n1[i] = nums1[i] - '0';
            }

            for (int i = 0; i < n; i++)
            {
                n2[i] = nums2[i] - '0';
            }


            for (int i = n1.Length - 1; i >= 0; i--)
            {
                for (int j = n2.Length - 1; j >= 0; j--)
                {
                    //将两数的乘积 分别加入到数组中

                    pos[i + j + 1] += n1[i] * n2[j];
                }
            }

            //进行统一的进位操作
            for (int i = pos.Length - 1; i >= 1; i--)
            {
                pos[i - 1] += pos[i] / 10;
                pos[i] = pos[i] % 10;
            }

            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < pos.Length; i++)
            {
                sb.Append(pos[i]);
            }

            string res = sb.ToString().TrimStart('0');
            return res.Length == 0 ? "0" : res;


        }
    }
}
