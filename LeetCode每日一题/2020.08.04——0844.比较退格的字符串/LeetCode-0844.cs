using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        public bool BackspaceCompare(string S, string T)
        {
            Stack<char> ss = new Stack<char>();
            Stack<char> st = new Stack<char>();

            //将S字符串遍历入栈
            foreach (var item in S)
            {
                if (item != '#')
                {
                    ss.Push(item);
                }
                else if (item == '#')
                {
                    if (ss.Count > 0)
                    {   
                        //遇到#号则弹出栈顶元素   
                        //没有入栈 反而出栈一个元素   相当于退格操作
                        ss.Pop();
                    }
                }
            }


            foreach (var item in T)
            {
                if (item != '#')
                {
                    st.Push(item);
                }
                else if (item == '#')
                {
                    if (st.Count > 0)
                    {
                        st.Pop();
                    }
                }
            }

            if (ss.Count != st.Count) return false;

            while (ss.Count > 0 && st.Count > 0)
            {
                if (ss.Pop() != st.Pop())
                {
                    return false;
                }
            }
            return true;

        }
    }
}
