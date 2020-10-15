using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {

        //利用队列解决（二叉树的层序遍历）
        public Node Connect(Node root)
        {
            if (root == null) return root;
            //创建队列
            Queue<Node> que = new Queue<Node>();
            //根节点入队
            que.Enqueue(root);

            while (que.Count > 0)
            {
                int length = que.Count;
                //遍历这一层的所有节点
                for (int i = 0; i < length; i++)
                {
                    //弹出队首元素
                    Node temp = que.Dequeue();

                    // 连接
                    if (i < length - 1)
                    {
                        //弹出的元素指向此时队列中的队首
                        temp.next = que.Peek();
                    }

                    //将弹出元素的下一层节点添加到队列中
                    if (temp.left != null)
                    {
                        que.Enqueue(temp.left);
                    }
                    if (temp.right != null)
                    {
                        que.Enqueue(temp.right);
                    }
                }
            }
            return root;
        }

        //递归实现
        public Node Connect2(Node root)
        {

            //1.递归的终止条件
            //节点为空
            if (root == null) return null;
            //2.当前递归需要做什么 
            //节点指向右侧节点
            //1.分为两种情况     1.左节点指向右侧节点  node.left.next = node.right
            //                  2.右节点指向右侧节点  node.right.next = node.next.left(node.next存在的情况下) node.right.next = null(node.next不存在的情况下)
            if (root.left != null)
            {
                root.left.next = root.right;
            }
            if (root.right != null)
            {
                if (root.next != null)
                {
                    root.right.next = root.next.left;
                }
                else
                {
                    root.right.next = null;
                }
            }

            //继续递归  继续递归也属于当前递归需要做的事情
            Connect(root.left);
            Connect(root.right);

            //3.当前递归的返回值是什么
            // ？返回当前递归的根节点？
            // ？没有返回值？
            // 返回已经处理好的当前层级的指向关系 
            // 此时 root 并不是根节点  而是当前递归到的根节点
            return root;
        }


        public class Node
        {
            public int val;
            public Node left;
            public Node right;
            public Node next;

            public Node() { }

            public Node(int _val)
            {
                val = _val;
            }

            public Node(int _val, Node _left, Node _right, Node _next)
            {
                val = _val;
                left = _left;
                right = _right;
                next = _next;
            }
        }


        public class TreeNode
        {
            public int val;
            public TreeNode left;
            public TreeNode right;
            public TreeNode(int x) { val = x; }
        }


    }
}
