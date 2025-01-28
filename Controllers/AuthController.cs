using hudson_data_center.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Diagnostics;
using System.DirectoryServices;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using hudson_data_center.Services;

namespace hudson_data_center.Controllers
{

    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JWTAuthenticationMananger jwtAuthenticationMananger;

        public AuthController(JWTAuthenticationMananger jwtAuthenticationMananger)
        {
            this.jwtAuthenticationMananger = jwtAuthenticationMananger;
        }


        [AllowAnonymous]
        [HttpPost("Authorize")]
        public IActionResult LoginUserTwo([FromBody] UserInfo user)
        {
            var token = jwtAuthenticationMananger.Authenticate(user.UserName, user.Password);
            if(token == null)
            {
                return Unauthorized();
            }

            HttpContext.Session.SetString("JWToken", token);
            return Ok(token);
            

        }

        [AllowAnonymous]
        [HttpGet("GetTokenSession")]
        public IActionResult GetTokenSession() {
            string token = HttpContext.Session.GetString("JWToken");
            return Ok(token);
        }

        public IActionResult Logoff()
        {
            HttpContext.Session.Clear(); //clears token
            return Redirect("~/Home/Index");
        }
    }

}

