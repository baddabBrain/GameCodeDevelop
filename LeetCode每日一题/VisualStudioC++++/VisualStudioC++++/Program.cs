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

        public char PredictTheWinner(string s ,string t)
        {
            Hashtable ha = new Hashtable();
            for (int i = 0; i < s.Length; i++)
            {
                if (!ha.Contains(s[i]))
                {
                    ha.Add(s[i], i);
                }
            }

            for (int i = 0; i < t.Length; i++)
            {
                if (ha.Contains(t[i]))
                {
                    continue;
                }
                else
                {
                    return t[i];
                }
            }
            return ' ';
        }



    }
}
