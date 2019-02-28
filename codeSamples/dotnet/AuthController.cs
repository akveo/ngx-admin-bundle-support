/*
* Copyright (c) Akveo 2019. All Rights Reserved.
* Licensed under the Personal / Commercial License.
* See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
*/

using Common.DTO;
using System.Threading.Tasks;
using System.Web.Http;

namespace Common.WebApi.Controllers
{
    [RoutePrefix("auth")]
    public class AuthController : BaseApiController
    {
        protected readonly IAuthenticationService authService;

        public AuthController(IAuthenticationService authService)
        {
            this.authService = authService;
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> Login(LoginDTO loginDto)
        {
            var result = await authService.Login(loginDto);

            if (result.Succeeded)
            {
                return Ok(new { result.Token });
            }
            if (result.IsModelValid)
            {
                return Unauthorized();
            }

            return BadRequest();
        }

        [HttpPost]
        [Authorize]
        [Route("reset-pass")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordDTO changePasswordDto)
        {
            var result = await authService.ChangePassword(changePasswordDto);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("sign-up")]
        public async Task<IHttpActionResult> SignUp(SignUpDTO signUpDto)
        {
            var result = await authService.SignUp(signUpDto);

            if (result.Succeeded)
                return Ok(new { result.Token });

            if (result.IsModelValid)
                return Unauthorized();

            return BadRequest();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("request-pass")]
        public async Task<IHttpActionResult> RequestPassword(RequestPasswordDTO requestPasswordDto)
        {
            var result = await authService.RequestPassword(requestPasswordDto);

            if (result.Succeeded)
                return Ok(new { result.Token, Description = "Reset Token should be sent via Email. Token in response - just for testing purpose." });

            return BadRequest();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("restore-pass")]
        public async Task<IHttpActionResult> RestorePassword(RestorePasswordDTO restorePasswordDto)
        {
            var result = await authService.RestorePassword(restorePasswordDto);

            if (result.Succeeded)
                return Ok(new { result.Token });

            return BadRequest();
        }

        [HttpPost]
        [Authorize]
        [Route("sign-out")]
        public async Task<IHttpActionResult> SignOut()
        {
            return Ok();
        }
    }
}
