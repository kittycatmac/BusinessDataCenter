using hudson_data_center.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using hudson_data_center.Services;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace hudson_data_center.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SMIController : ControllerBase
    {
        public static string baseUrl;
        private readonly IOptions<MyAppSettings> _options;

        public SMIController(IOptions<MyAppSettings> options)
        {
            _options = options;
            baseUrl = _options.Value.BaseUrl + "/odata/v1/SheetMaterialInventorys";
        }

        [HttpGet("GetSheetMaterialInventory")]
        public async Task<List<SMI>> GetSheetMaterialInventory()
        {
            // Use the access token to call a protected web API
            var accessToken = HttpContext.Session.GetString("JWToken");

            var url = baseUrl;
            var httpClientHandler = new HttpClientHandler();
            httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
            {
                return true;
            };
            HttpClient client = new HttpClient(httpClientHandler) { BaseAddress = new Uri(url) };
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            string jsonStr = await client.GetStringAsync(url + "/?$select=SmiId,SmiType,SmiDesc,SmiWidth,SmiLength,SmiBwt,SmiCaliper,SmiQoh");
            JObject result = JObject.Parse(jsonStr);
            var sheetList = result.SelectToken("value");
            List<SMI> res = JsonConvert.DeserializeObject<List<SMI>>(sheetList.ToString());

            return res;
        }

        [HttpGet("GetSheet/{sheetId}")]
        public async Task<List<SMI>> GetSheet([FromRoute] int sheetId)
        {
            // Use the access token to call a protected web API
            var accessToken = HttpContext.Session.GetString("JWToken");
            var url = baseUrl;
            var httpClientHandler = new HttpClientHandler();
            httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
            {
                return true;
            };
            HttpClient client = new HttpClient(httpClientHandler) { BaseAddress = new Uri(url) };
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            //Debug.WriteLine(sheetId);
            //Debug.WriteLine(url + "(SmiId="+sheetId+")");
            string jsonStr = await client.GetStringAsync(url + "/?$select=SmiId,SmiType,SmiDesc,SmiWidth,SmiLength,SmiBwt,SmiCaliper,SmiQoh&$filter=SmiId eq "+sheetId+"");
            //Debug.WriteLine(jsonStr);
            JObject result = JObject.Parse(jsonStr);
            // puts the single object into an array in order to deserialize into model
            var value = result.SelectToken("value");
            //Debug.WriteLine(value);
            List<SMI> res = JsonConvert.DeserializeObject<List<SMI>>(value.ToString());

            return res;
        }

        [HttpPut("UpdateSheet/{sheetId}")]
        public async Task<JsonResult> UpdateSheet([FromRoute] int sheetId, [FromBody] PutSMI value) 
        {
             // Use the access token to call a protected web API
            var accessToken = HttpContext.Session.GetString("JWToken");
            var url = baseUrl;
            var httpClientHandler = new HttpClientHandler();
            httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
            {
                return true;
            };
            HttpClient client = new HttpClient(httpClientHandler) { BaseAddress = new Uri(url) };
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            Debug.WriteLine(value);
            var putUrl = url + "(SmiId="+sheetId+")";
            Console.WriteLine(putUrl);
            string json = System.Text.Json.JsonSerializer.Serialize(value);
            Debug.WriteLine(json);
            HttpContent httpContent = new StringContent(json);
            httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            Debug.WriteLine(httpContent);
            var res = await client.PutAsync(putUrl, httpContent);
            Console.WriteLine(res);

            if (res.IsSuccessStatusCode)
            {
                // var result = await res.Content.ReadAsStringAsync();
                // var data = System.Text.Json.JsonSerializer.Deserialize<SMI>(result);
                Console.WriteLine("Success");
                
            }
            return new JsonResult(res);

        }

        [HttpPatch("PatchQOH/{sheetId}")]
        public async Task<JsonResult> PatchQOH([FromRoute] int sheetId, [FromBody] PatchSMI value) 
        {
             // Use the access token to call a protected web API
            var accessToken = HttpContext.Session.GetString("JWToken");
            var url = baseUrl;
            var httpClientHandler = new HttpClientHandler();
            httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
            {
                return true;
            };
            HttpClient client = new HttpClient(httpClientHandler) { BaseAddress = new Uri(url) };
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            Debug.WriteLine(value);
            var putUrl = url + "(SmiId="+sheetId+")";
            Console.WriteLine(putUrl);
            var arrObj = new [] {value};
            Debug.WriteLine(arrObj);
            string json = System.Text.Json.JsonSerializer.Serialize(arrObj);
            Debug.WriteLine(json);
            HttpContent httpContent = new StringContent(json);
            httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            Debug.WriteLine(httpContent);
            var res = await client.PatchAsync(putUrl, httpContent);
            Console.WriteLine(res);

            if (res.IsSuccessStatusCode)
            {
                Console.WriteLine("Success");
                
            }
            return new JsonResult(res);

        }
    }
}
