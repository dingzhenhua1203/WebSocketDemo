using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.WebSockets;
using WebSocketDemo.Model;
using WebSocketDemo.Service;

namespace WebSocketDemo.Controllers
{
    public class WebSocketHandlerController : ApiController
    {

        // GET api/<controller>/5
        public HttpResponseMessage Get()
        {
            if (HttpContext.Current.IsWebSocketRequest)
            {

                HttpContext.Current.AcceptWebSocketRequest(ProcessWSChat);
            }
            return new HttpResponseMessage(HttpStatusCode.SwitchingProtocols);
        }

        private async Task ProcessWSChat(AspNetWebSocketContext context)
        {
            var _userService = UserService.GetInstance();
            WebSocket socket = context.WebSocket;
            string user = context.QueryString["user"].ToString();
            try
            {
                #region 用户添加连接池               
                //第一次open时，添加到连接池中
                _userService.AddUserDic(user, socket);
                #endregion

                #region 离线消息处理
                List<MessageInfo> msgs = _userService.GetUnlineMessage(user);
                foreach (MessageInfo item in msgs)
                {
                    await socket.SendAsync(item.MsgContent, WebSocketMessageType.Text, true, CancellationToken.None);
                }
                _userService.RemoveUnlineMessage(user);//移除离线消息

                #endregion

                string descUser = string.Empty;//目的用户
                while (socket.State == WebSocketState.Open)
                {

                    ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[2048]);
                    WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);

                    #region 消息处理（字符截取、消息转发）
                    try
                    {
                        #region 关闭Socket处理，删除连接池
                        if (socket.State != WebSocketState.Open)//连接关闭
                        {
                            _userService.RemoteUserDic(user);//删除连接池
                            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, String.Empty, CancellationToken.None);
                            break;
                        }
                        #endregion
                        var buffer2 = new ArraySegment<byte>(Encoding.UTF8.GetBytes("收到了"));
                        await socket.SendAsync(buffer2, WebSocketMessageType.Text, true, CancellationToken.None);
                        string userMsg = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);//发送过来的消息
                        string[] msgList = userMsg.Split('|');
                        if (msgList.Length == 2)
                        {
                            if (msgList[0].Trim().Length > 0)
                                descUser = msgList[0].Trim();//记录消息目的用户
                            buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(msgList[1]));
                        }
                        else
                            buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(userMsg));

                        if (_userService.IsUserDicExist(descUser))//判断客户端是否在线
                        {
                            WebSocket destSocket = _userService.GetUserDic(descUser);//目的客户端
                            if (destSocket != null && destSocket.State == WebSocketState.Open)
                                await destSocket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                        }
                        else
                        {
                            await Task.Run(() =>
                             {
                                 List<MessageInfo> msglist = new List<MessageInfo>();
                                 msglist.Add(new MessageInfo(DateTime.Now, buffer));
                                 if (!_userService.IsUnlineMessageExist(descUser))
                                 {
                                     //将用户添加至离线消息池中
                                     _userService.AddUnlineMessage(descUser, new List<MessageInfo>());
                                 }
                                 _userService.AddUnlineMessageValue(descUser, msglist);//添加离线消息
                             });
                        }
                    }
                    catch (Exception exs)
                    {
                        //消息转发异常处理，本次消息忽略 继续监听接下来的消息
                    }
                    #endregion
                }//while end
            }
            catch (Exception ex)
            {
                //整体异常处理
                _userService.RemoteUserDic(user);//删除连接池
            }
        }
    }
}