using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebSocketDemo.Service;

namespace WebSocketDemo
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            File.WriteAllText("D:/1.log", DateTime.Now.ToString("s"));
            WebSocketServiceCreator.GetInstance().StartWS();
        }

        protected void Application_end()
        {
            WebSocketServiceCreator.GetInstance().StopWS();
        }


        //protected void App
    }
}
