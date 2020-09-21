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


        }


        public bool Exist(char[][] board, String word)
        {
            char[] words = word.ToCharArray();
            for (int i = 0; i < board.Length; i++)
            {
                for (int j = 0; j < board[0].Length; j++)
                {
                    //从[i,j]这个坐标开始查找
                    if (DFS(board, words, i, j, 0))
                        return true;
                }
            }
            return false;
        }

        public bool DFS(char[][] board, char[] word, int i, int j, int index)
        {
            //边界的判断，如果越界直接返回false。index表示的是查找到字符串word的第几个字符，
            //如果这个字符不等于board[i][j]，说明验证这个坐标路径是走不通的，直接返回false
            if (i >= board.Length || i < 0 || j >= board[0].Length || j < 0 || board[i][j] != word[index])
                return false;
            //如果word的每个字符都查找完了，直接返回true
            if (index == word.Length - 1)
                return true;
            //把当前坐标的值保存下来，为了在最后复原
            char tmp = board[i][j];
            //然后修改当前坐标的值 避免重复使用
            board[i][j] = '.';

            //走递归，沿着当前坐标的上下左右4个方向查找
            //四个方向只要有一个方向符合要求就进行下一次递归
            bool res = DFS(board, word, i + 1, j, index + 1) || DFS(board, word, i - 1, j, index + 1) ||
                    DFS(board, word, i, j + 1, index + 1) || DFS(board, word, i, j - 1, index + 1);

            //递归之后再把当前的坐标复原
            //不复原的话  影响下一次递归    
            board[i][j] = tmp;
            return res;
        }



    }
}
