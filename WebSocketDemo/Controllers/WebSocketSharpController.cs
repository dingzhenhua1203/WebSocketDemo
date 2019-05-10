using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.WebSockets;
using WebSocketDemo.Service;
using WebSocketSharp.Server;

namespace WebSocketDemo.Controllers
{
    public class WebSocketSharpController : ApiController
    {

        public string Get()
        {
            WebSocketServiceCreator.GetInstance().StartWS();
            //SuperWebSocketServiceCreator.GetInstance().OnStart();

            return "success";
        }

        public string Delete()
        {
            WebSocketServiceCreator.GetInstance().StopWS();
            return "success";
        }

        // GET api/<controller>/5

    }
}