using SuperWebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace WebSocketDemo.Service
{
    public class SuperWebSocketServiceCreator
    {
        private static SuperWebSocketServiceCreator _instance;

        private static WebSocketServer ws;

        private static readonly object Locker = new object();
        private SuperWebSocketServiceCreator(){

        }

        public static SuperWebSocketServiceCreator GetInstance() {
            if (_instance == null) {
                lock (Locker) {
                    if (_instance == null)
                    {
                        _instance = new SuperWebSocketServiceCreator();
                    }
                }
            }
            return _instance;
        }

        public  void OnStart()
        {
            ws = new WebSocketServer();
            if (!ws.Setup("10.101.72.7", 2013))
            {
                //Debug.Write("WebSocket服务器端启动失败");
                //处理启动失败消息
                return;
            }

            //新的会话连接时
            ws.NewSessionConnected += server_NewSessionConnected;
            //会话关闭
            ws.SessionClosed += server_SessionClosed;
            //接收到新的消息时
            ws.NewMessageReceived += server_NewMessageReceived;

            if (!ws.Start())
            {
                //Debug.Write(string.Format("开启WebSocket服务侦听失败:{0}:{1}", server.Config.Ip, server.Config.Port));
                //处理监听失败消息
                return;
            }
        }


        private void server_NewMessageReceived(WebSocketSession session, string value)
        {
            var rd = new Random().Next(200, 1000);
            Thread.Sleep(rd);
            session.Send("hello..."+ rd);
        }

        /// <summary>
        /// 添加会话消息
        /// </summary>
        /// <param name="value"></param>
        private void AddMsgToSessionId(string value)
        {
           
        }

        /// <summary>
        /// 会话关闭
        /// </summary>
        /// <param name="session"></param>
        /// <param name="value"></param>
        private void server_SessionClosed(WebSocketSession session, SuperSocket.SocketBase.CloseReason value)
        {
           
        }

        /// <summary>
        /// 新的会话链接
        /// </summary>
        /// <param name="session"></param>
        private void server_NewSessionConnected(WebSocketSession session)
        {
          
        }

        /// <summary>
        /// 发送消息到
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="msg"></param>
        private void SendMsgToRemotePoint(string sessionId, string msg)
        {
           
        }

    }
}