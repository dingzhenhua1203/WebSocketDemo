using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebSocketSharp.Server;

namespace WebSocketDemo.Service
{
    public class WebSocketServiceCreator
    {
        private static WebSocketServiceCreator _instance;

        private static WebSocketServer ws;

        private static readonly object Locker = new object();
        private WebSocketServiceCreator()
        {

        }

        public static WebSocketServiceCreator GetInstance()
        {
            if (_instance == null)
            {
                lock (Locker)
                {
                    if (_instance == null)
                    {
                        _instance = new WebSocketServiceCreator();
                    }
                }
            }
            return _instance;
        }
        private void InitWS()
        {
            if (ws == null)
            {
                ws = new WebSocketServer(2013);
            }
        }
        public void StartWS()
        {
            InitWS();
            ws.AddWebSocketService<GameWebSocket>("/GameWebSocket");
            ws.Start();
        }

        public void StopWS()
        {
            ws.Stop();
            ws.WebSocketServices.RemoveService("/GameWebSocket");

        }

        public WebSocketServer GetSocketServer()
        {
            return ws;

        }

    }
}