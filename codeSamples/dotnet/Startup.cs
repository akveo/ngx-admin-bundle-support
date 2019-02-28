/*
* Copyright (c) Akveo 2019. All Rights Reserved.
* Licensed under the Personal / Commercial License.
* See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
*/

using AutoMapper.Configuration;
using Common.WebApi;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using System.Web.Http.Filters;
using Unity;

[assembly: OwinStartup(typeof(IoT.WebApi.Startup))]
namespace IoT.WebApi
{
    public class Startup : BaseStartup
    {
        public override void Configuration(IAppBuilder app)
        {
            base.Configuration(app);
            SerilogConfig.Configure();
        }

        protected override void Configure(HttpConfiguration config)
        {
            WebApiConfig.Configure(config);
        }

        protected override void ConfigureMapping(MapperConfigurationExpression config)
        {
            AutoMapperConfig.Configure(config);
        }

        protected override void RegisterDependencies(UnityContainer container)
        {
            UnityConfig.RegisterDependencies(container);
        }

        protected override void RegisterFilters(HttpFilterCollection filters)
        {
            FilterConfig.RegisterFilters(filters);
        }

        protected override void RegisterRoutes(HttpConfiguration config)
        {
            RouteConfig.ConfigureRoutes(config);
        }
    }
}