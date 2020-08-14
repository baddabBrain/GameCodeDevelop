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

            string s = "[{]}";

            Console.WriteLine(IsValid(s));
            Console.ReadKey();
        }


        //将字符串中的左括号入栈，碰到与之相对应的右括号则出栈
        //不是将所有的左括号都入栈之后，再进行相应的出栈操作
        //而是入一个出一个  一一对应 保证每一个括号都有效
        public static bool IsValid(string s)
        {
            int length = s.Length;
            if (length == 0) return true;

            Stack<char> sta1 = new Stack<char>();
            char[] nums = s.ToCharArray();

            for (int i = 0; i < nums.Length; i++)
            {
                if (nums[i] == ']')
                {
                    //判断栈的数量是否大于0   为了防止 "}])"  一开始就是右括号的情况
                    if (sta1.Count > 0 && sta1.Pop() == '[')
                    {
                        continue;
                    }
                    return false;
                }
                else if (nums[i] == ')')
                {
                    if (sta1.Count > 0 && sta1.Pop() == '(')
                    {
                        continue;
                    }
                    return false;
                }
                else if (sta1.Count > 0 && nums[i] == '}')
                {
                    if (sta1.Pop() == '{')
                    {
                        continue;
                    }
                    return false;
                }
                else
                {
                    sta1.Push(nums[i]);
                }
            }

            return sta1.Count == 0 ? true : false;
        }
    }
}
