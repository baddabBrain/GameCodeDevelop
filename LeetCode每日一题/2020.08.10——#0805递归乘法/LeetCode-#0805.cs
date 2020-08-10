using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {


        public int Multiply(int a, int b)
        {
            //不用*  实现a*b

            //1.循环 a 遍  每次增加 b

            //2.递归解法  （同理与循环） 

            if (A > B)
            {
                return Multiply(B, A);   //确保递归的次数最少
            }


            if (A == 0)
            {
                return 0;   //递归终止条件
            }
            return B + Multiply(A - 1, B);   //累加


        }
    }
}
