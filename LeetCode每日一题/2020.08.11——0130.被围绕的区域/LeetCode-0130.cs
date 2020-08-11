using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public int col;
        public int row;

        public void Solve(char[][] board)
        {
            //col 列  row 行
            int col = board.Length;
            int row = board[0].Length;

            //该题目需要将所有被X包围的O找出来，那剩下的O就是连接起来与边界连通的O。
            //直接找出来所有被X包围的O并不好找，但是可以用排除法：
            //先找到所有连接起来与边界连通的O，将这些O标记一下，然后遍历数组，所有没有被标记的O就是我们要找的O。

            //边界的行
            for (int i = 0; i < row; i++)
            {
                //最后一行
                DFS(board, i, row - 1);
                //第一行
                DFS(board, i, 0);
            }

            //边界的列
            for (int j = 0; j < col; j++)
            {
                //第一列
                DFS(board, 0, j);
                //最后一列
                DFS(board, row - 1,j);
            }

            //此时整个二维数组已经标记完成
            //再遍历整个数组将所有的'O'改为'X' （此时'O'即为符合要求的被围绕区域）
            //将所有的'A'改为'O'   (此时所有的'A'即为所有与边界连接的'O')

            for (int i = 0; i < row; i++)
            {
                for (int j = 0; j < col; j++)
                {
                    if (board[i][j] == 'O')
                    {
                        board[i][j] == 'X';
                    }
                    if (board[i][j] == 'A')
                    {
                        board[i][j] = 'O';
                    }
                }
            }
    
        }

        public void DFS(char[][] board, int i, int j)
        {
            if (i < 0 || j < 0 || i >= row || j >= col || board[i][j] != 'O')
            {
                return;
            }
            
            board[i][j] = 'A';
            DFS(board[i][j + 1]);
            DFS(board[i][j - 1]);
            DFS(board[i+1][j]);
            DFS(board[i-1][j]);
            return;
        }
    }
}
