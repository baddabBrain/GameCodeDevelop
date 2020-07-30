using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public int[] Serach(int[] nums, int target)
        {
            int i = 0;
            int j = nums.Length - 1;

            //搜索右边界 right
            while (i <= j)
            {
                int m = (i + j) / 2;
                if (nums[m] <= target)
                {
                    i = m + 1;
                }
                else
                {
                    j = m - 1;
                }

            }
            int right = i;


            // 搜索左边界 left
            i = 0; j = nums.Length - 1;
            while (i <= j)
            {
                int m = (i + j) / 2;
                if (nums[m] < target) i = m + 1;
                else j = m - 1;
            }
            int left = j;

            return new int[] { left, right };

        }
    }
}
