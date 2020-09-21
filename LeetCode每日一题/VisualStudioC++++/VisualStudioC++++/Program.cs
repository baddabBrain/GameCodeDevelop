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

            string a = "longolongl";
            string b = "gl";
            StrStr(a, b);
            Console.ReadKey();
        }



        public static int StrStr(string haystack, string needle)
        {

            int longLength = haystack.Length;
            int shortLength = needle.Length;

            if (longLength < shortLength) return -1;

            int i = 0;
            int j = 0;
            while (i < longLength && j < shortLength)
            {
                if (needle[j] == haystack[i])
                {
                    i++;
                    j++;
                }
                else
                {
                    //不相等的话
                    i = i++;
                    j = 0;
                }



            }
            if (j == shortLength) return i - shortLength;
            else return -1;

        }

    }
}
