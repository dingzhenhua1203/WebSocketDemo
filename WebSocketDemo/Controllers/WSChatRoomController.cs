using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebSocketDemo.Controllers
{
    public class WSChatRoomController : Controller
    {
        // GET: WSChatRoom
        public ActionResult Index()
        {
            return View();
        }
    }
}