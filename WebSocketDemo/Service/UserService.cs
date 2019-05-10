using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Web;
using WebSocketDemo.Model;

namespace WebSocketDemo.Service
{
    /// <summary>
    /// 用户服务
    /// </summary>
    public class UserService
    {
        private Dictionary<string, WebSocket> CONNECT_POOL = new Dictionary<string, WebSocket>();//用户连接池
        private Dictionary<string, List<MessageInfo>> MESSAGE_POOL = new Dictionary<string, List<MessageInfo>>();//离线消息池


        private UserService()
        {

        }

        private static readonly object locker = new object();
        private static UserService _userService = null;

        public static UserService GetInstance()
        {
            if (_userService == null)
            {
                lock (locker)
                {
                    if (_userService == null)
                    {
                        _userService = new UserService();
                    }
                }
            }
            return _userService;
        }

        #region 在线用户字典
        public void AddUserDic(string key, WebSocket value)
        {
            CONNECT_POOL[key] = value;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="logRequest"></param>
        public void RemoteUserDic(string key)
        {
            if (CONNECT_POOL.ContainsKey(key))
            {
                CONNECT_POOL.Remove(key);
            }
        }

        public bool IsUserDicExist(string key)
        {
            return CONNECT_POOL.ContainsKey(key);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logRequest"></param>
        public WebSocket GetUserDic(string key)
        {
            if (CONNECT_POOL.ContainsKey(key))
                return CONNECT_POOL[key];
            else
                return null;
        }
        #endregion

        #region 离线消息
        public void AddUnlineMessage(string key, List<MessageInfo> value)
        {
            MESSAGE_POOL[key] = value;
        }

        public void AddUnlineMessageValue(string key, List<MessageInfo> value)
        {
            MESSAGE_POOL[key].AddRange(value);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="logRequest"></param>
        public void RemoveUnlineMessage(string key)
        {
            if (MESSAGE_POOL.ContainsKey(key))
            {
                MESSAGE_POOL.Remove(key);
            }
        }

        public bool IsUnlineMessageExist(string key)
        {
            return MESSAGE_POOL.ContainsKey(key);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="logRequest"></param>
        public List<MessageInfo> GetUnlineMessage(string key)
        {
            if (MESSAGE_POOL.ContainsKey(key))
                return MESSAGE_POOL[key];
            else
                return new List<MessageInfo>();
        }
        #endregion
    }
}