namespace ConsoleApp1
    {
        class Program
        {

            public int row;
            public int col;

            public void Solve(char[][] board)
            {
                if (board.Length == 0) return;
                int col = board.Length;
                int row = board[0].Length;
                // 先遍历所有边界为O的点
                for (int i = 0; i < col; i++)
                {
                    dfs(board, i, 0, col, row);
                    dfs(board, i, row - 1, col, row);
                }
                for (int j = 0; j < row; j++)
                {
                    dfs(board, 0, j, col, row);
                    dfs(board, col - 1, j, col, row);
                }

                for (int i = 0; i < col; i++)
                {
                    for (int j = 0; j < row; j++)
                    {
                        if (board[i][j] == 'O')
                        {
                            board[i][j] = 'X';
                        }
                        if (board[i][j] == '*')
                        {
                            board[i][j] = 'O';
                        }
                    }
                }
            }

            private void dfs(char[][] board, int i, int j, int col, int row)
            {
                if (i > col - 1 || j > row - 1 || i < 0 || j < 0) return;
                if (board[i][j] != 'O') return;
                board[i][j] = '*';
                // 找到相连的点, 上下左右
                dfs(board, i - 1, j, col, row);
                dfs(board, i + 1, j, col, row);
                dfs(board, i, j - 1, col, row);
                dfs(board, i, j + 1, col, row);
            }


        }
    }

}
}
