using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace WebSocketDemo.Service
{
    public class GameWebSocket : WebSocketBehavior
    {
        private List<string> Ids = new List<string>();

        protected override void OnMessage(MessageEventArgs e)
        {

            //var rd = new Random().Next(200, 1000);
            //for (int i = 0; i < 60; i++)
            //{
            if (Sessions.IDs.Count() > 1)
                Sessions.SendTo($"form {ID}", Sessions.IDs.FirstOrDefault());
            else
                Thread.Sleep(10000);



            //    //Thread.Sleep(1000);
            //    Send(e.Data + "...sleepend" + i);
            //}
            //Sessions.SendTo()
        }

        protected override void OnOpen()
        {
            File.AppendAllLines("D:/1.log", new[] { "\n\n\n-------OnOpen--ID--------\n" + ID });
            File.AppendAllLines("D:/1.log", new[] { "\n\n\n-------OnOpen--Sessions.IDs--------\n" + string.Join(",", Sessions.IDs) });
            base.OnOpen();
        }

        protected override void OnClose(CloseEventArgs e)
        {
            File.AppendAllLines("D:/1.log", new[] { "\n\n\n-------OnClose--ID--------\n" + ID });
            File.AppendAllLines("D:/1.log", new[] { "\n\n\n-------OnClose--Sessions.IDs--------\n" + string.Join(",", Sessions.IDs) });
            Ids.RemoveAll(x => x == ID);
            base.OnClose(e);
        }
    }
}