using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        public void SetZeroes(int[,] matrix)
        {
            //1.使用一个额外的二维数组  记录每一个0出现的具体位置
            //  再次遍历将对应的行和列清零
            int row = matrix.GetLength(0);
            int col = matrix.GetLength(1);
            bool[,] res = new bool[row, col];

            for (int i = 0; i < row; i++)
            {
                for (int j = 0; j < col; j++)
                {
                    if (matrix[i, j] == 0)
                    {
                        res[i, j] = true;
                    }
                }
            }

            for (int i = 0; i < row; i++)
            {
                for (int j = 0; j < col; j++)
                {
                    if (res[i, j])
                    {
                        SetZero(matrix, i, j);
                    }
                }
            }


        }

        public void SetZero(int[,] res, int row, int col)
        {
            for (int i = 0; i < res.GetLength(1); i++)
            {
                res[row, i] = 0;
            }

            for (int i = 0; i < res.GetLength(0); i++)
            {
                res[i, col] = 0;
            }
        }
    }
}
