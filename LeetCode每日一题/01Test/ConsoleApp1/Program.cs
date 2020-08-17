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

            string s = "hello";

            char[] nums = s.ToCharArray();


            string a = ReverseVowels(s);

        
            Console.ReadKey();
        }


        public static string ReverseVowels(string s)
        {
            char[] nums = s.ToCharArray();

            int i = 0;
            int j = nums.Length - 1;

            while (i < j)
            {
                if (IsYuanYin(nums[i]) && IsYuanYin(nums[j]))
                {
                    char temp = nums[i];
                    nums[i] = nums[j];
                    nums[j] = temp;

                }
                
            }

            return new string(nums);
        }

        public static bool IsYuanYin(char s)
        {
            if (s == 'a' || s == 'e' || s == 'i' || s == 'o' || s == 'u')
            {
                return true;
            }
            return false;
        }

    }
}
