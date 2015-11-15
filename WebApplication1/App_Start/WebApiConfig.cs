using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Net.Http.Formatting;
namespace WebApplication1
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Маршруты веб-API
            //config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{request}",    // /{action}
                defaults: new {  }
            );
            config.Routes.MapHttpRoute(
                name: "DefaultApiField",
                routeTemplate: "api/{controller}/{request}/{field}",    // /{action}
                defaults: new {  }
            );
        }
    }
}
