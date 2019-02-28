/*
* Copyright (c) Akveo 2019. All Rights Reserved.
* Licensed under the Personal / Commercial License.
* See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
*/

using Common.WebApi.Controllers;
using ECommerce.DTO;
using ECommerce.Entities;
using ECommerce.Services.Infrastructure;
using System.Threading.Tasks;
using System.Web.Http;

namespace ECommerce.WebApi.Controllers
{
    [RoutePrefix("orders")]
    public class OrdersController : BaseApiController
    {
        protected readonly IOrderService orderService;
        public OrdersController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetDataForGrid([FromUri]OrdersGridFilter filter)
        {
            var orders = await orderService.GetDataForGrid(filter);
            return Ok(orders);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Get(int id)
        {
            var order = await orderService.GetById(id);
            return Ok(order);
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create(OrderDTO orderDto)
        {
            if (orderDto.Id != 0)
                return BadRequest();

            var result = await orderService.Edit(orderDto);
            return Ok(result);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Edit(int id, OrderDTO orderDto)
        {
            if (id != orderDto.Id)
                return BadRequest();

            var result = await orderService.Edit(orderDto);
            return Ok(result);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Delete(int id)
        {
            var result = await orderService.Delete(id);
            return Ok(result);
        }
    }
}
