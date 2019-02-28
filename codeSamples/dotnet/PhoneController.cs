/*
* Copyright (c) Akveo 2019. All Rights Reserved.
* Licensed under the Personal / Commercial License.
* See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
*/

using Common.Entities;
using Common.WebApi;
using Common.WebApi.Controllers;
using IoT.Entities.System;
using IoT.Services.Infrastructure;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;

namespace IoT.WebApi.Controllers
{
    [RoutePrefix("phone")]
    public class PhoneController : BaseApiController
    {
        protected readonly IContactService contactService;
        protected readonly IPhoneCallService phoneCallService;

        public PhoneController(IContactService contactService, IPhoneCallService phoneCallService)
        {
            this.contactService = contactService;
            this.phoneCallService = phoneCallService;
        }

        [HttpGet]
        [Route("contacts")]
        public async Task<IHttpActionResult> ContactsAll(string searchText = null, int pageNumber = 1, int pageSize = 10)
        {
            var contacts = await contactService.GetAllContacts(new ContactFilter(searchText, pageNumber, pageSize));
            return Ok(contacts);
        }

        [HttpGet]
        [Route("recent-calls")]
        public async Task<IHttpActionResult> RecentCalls(int pageNumber = 1, int pageSize = 10)
        {
            var calls = await phoneCallService.GetRecentCalls(new BaseFilter(pageNumber, pageSize));
            return Ok(calls);
        }

        [HttpGet]
        [Route("contacts/{contactId:int}/photo")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> ContactPhoto(int contactId, string token)
        {
            var user = JwtManager.GetPrincipal(token);
            if (user == null || !user.Identity.IsAuthenticated)
            {
                return new HttpResponseMessage(HttpStatusCode.Unauthorized);
            }

            var photoContent = await contactService.GetContactPhoto(contactId);

            if (photoContent == null)
            {
                return new HttpResponseMessage(HttpStatusCode.NoContent);
            }

            using (var ms = new MemoryStream(photoContent))
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(ms.ToArray())
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");

                return response;
            }
        }
    }
}
