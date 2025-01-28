using hudson_data_center.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;
using hudson_data_center.Models;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace hudson_data_center.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PerformanceController : ControllerBase
    {
        public static string baseUrl;
        private readonly IOptions<MyAppSettings> _options;

        public PerformanceController(IOptions<MyAppSettings> options)
        {
            _options = options;
            baseUrl = _options.Value.BaseUrl + "/odata/v1/";
        }

        ////////// OnTimeSurvey: shipments and QualitySurvey: jobs

        // GET: /Performance/GetShippings
        [HttpGet("GetShippings")]
        public async Task<List<PerformanceShippings>> GetShippings()
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

            DateTime aDate = DateTime.Now;
            DateTime threeDays = aDate.AddDays(-4); // -4 going back four days
            string threeDaysAgoDateTime = threeDays.ToString("yyyy-MM-ddTHH:mm:ssK");
            DateTime sevenDays = threeDays.AddDays(-7); // -7 for seven days day of shipments
		    string sevenDaysAgoDateTime = sevenDays.ToString("yyyy-MM-ddTHH:mm:ssK"); 

            Debug.WriteLine(threeDaysAgoDateTime);
            Debug.WriteLine(sevenDaysAgoDateTime);

            string jsonStr = await client.GetStringAsync(url + "Shippings?%24filter=ShShipdate gt " + sevenDaysAgoDateTime + " and ShShipdate lt " + threeDaysAgoDateTime +
                            "%20and%20ShQuantity%20ne%200&$select=ShShipid,ShJobnum,ShDest1,ShShipdate,ShQuantity,ShShipvia,ShQuid&$expand=REL_JsJob21000($select=Js2ProjMgr)&$expand=REL_Jobinf($select=JobDesc)");
            JObject result = JObject.Parse(jsonStr);
            var shippingList = result.SelectToken("value");
            //Debug.WriteLine(shippingList);
            
            List<PerformanceShippings> res = JsonConvert.DeserializeObject<List<PerformanceShippings>>(shippingList.ToString());

            return res;
        }

        // GET: /Performance/GetShippingsForJobs
        [HttpGet("GetShippingsForJobs")]
        public async Task<List<PerformanceShippings>> GetShippingsForJobs()
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

            DateTime aDate = DateTime.Now;

            string dateTimeNow = aDate.ToString("yyyy-MM-ddTHH:mm:ssK");

            DateTime oneWeek = aDate.AddDays(-7); // -7 one week ago
            string oneWeekAgoDateTime = oneWeek.ToString("yyyy-MM-ddTHH:mm:ssK");
            DateTime fourDays = oneWeek.AddDays(-4); // -4 for four day of shipments
		    string fourDaysAgoDateTime = fourDays.ToString("yyyy-MM-ddTHH:mm:ssK"); 

            Debug.WriteLine(oneWeekAgoDateTime);
            Debug.WriteLine(fourDaysAgoDateTime);

            string jsonStr = await client.GetStringAsync(url + "Shippings?%24filter=ShShipdate gt " + fourDaysAgoDateTime + " and ShShipdate lt " + oneWeekAgoDateTime +
                            "%20and%20ShQuantity%20ne%200&$select=ShShipid,ShJobnum,ShDest1,ShShipdate,ShQuantity,ShShipvia,ShQuid&$expand=REL_JsJob21000($select=Js2ProjMgr)&$expand=REL_Jobinf($select=JobDesc)");
            JObject result = JObject.Parse(jsonStr);
            var shippingList = result.SelectToken("value");
            //Debug.WriteLine(shippingList);
            
            List<PerformanceShippings> res = JsonConvert.DeserializeObject<List<PerformanceShippings>>(shippingList.ToString());

            return res;
        }

        // GET: /Performance/GetJobs/5677
        // [HttpGet("GetJobs/{jobId}")]
        // public async Task<List<PerformanceJobs>> GetJobs(int jobId)
        // {
        //      // Use the access token to call a protected web API
        //     var accessToken = HttpContext.Session.GetString("JWToken");

        //     var url = baseUrl;
        //     var httpClientHandler = new HttpClientHandler();
        //     httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
        //     {
        //         return true;
        //     };
        //     HttpClient client = new HttpClient(httpClientHandler) { BaseAddress = new Uri(url) };
        //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        //     string jsonStr = await client.GetStringAsync(url + "Jobinfs?%24filter=JobNmbr eq " + jobId + 
        //                     "&$select=JobNmbr,JobDesc");
        //     JObject result = JObject.Parse(jsonStr);
        //     var jobList = result.SelectToken("value");
        //     //Debug.WriteLine(jobList);
        //     List<PerformanceJobs> res = JsonConvert.DeserializeObject<List<PerformanceJobs>>(jobList.ToString());

        //     return res;
        // }

        // GET: /Performance/GetProdId/5677/9500
        [HttpGet("GetProdIdDesc/{jobId}/{qtyId}")]
        public async Task<List<PerformanceProductId>> GetProdIdDesc(int jobId, int qtyId)
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

            string jsonStr = await client.GetStringAsync(url + "JsJob28000s?%24filter=Js2Jobnum eq " + jobId + " and Js2Recnum eq " + qtyId +
                            "&$select=Qu2Prodid,Js280Value,Qu2ShipComp1CompId&$expand=REL_JsJob27000($select=Qu2Proddesc)");
            JObject result = JObject.Parse(jsonStr);
            var prodIdList = result.SelectToken("value");
            //Debug.WriteLine(prodIdList);
            List<PerformanceProductId> res = JsonConvert.DeserializeObject<List<PerformanceProductId>>(prodIdList.ToString());

            return res;
        }

        // GET: /Performance/GetCompData/56777/01/04
        [HttpGet("GetCompData/{jobId}/{formId}/{verId}")]
        public async Task<List<PerformanceCompData>> GetCompData(int jobId, int formId, int verId)
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

            string jsonStr = await client.GetStringAsync(url + "/JsJob25000s?$select=Qu2Parts1Desc,Qu2Parts2Desc,Qu2Parts3Desc,Qu2Parts4Desc,"+
                            "Qu2Parts5Desc,Qu2Parts6Desc,Qu2Parts7Desc,Qu2Parts8Desc,Qu2Parts9Desc,Qu2Parts10Desc,&$filter=Js2Jobnum eq " +
                             jobId + "and Js2Form eq " + formId + "and Js2Version eq " + verId);
            JObject result = JObject.Parse(jsonStr);
            var prodIdList = result.SelectToken("value");
            //Debug.WriteLine(prodIdList);
            List<PerformanceCompData> res = JsonConvert.DeserializeObject<List<PerformanceCompData>>(prodIdList.ToString());

            return res;
        }

        // POST api/<PerformanceController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<PerformanceController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<PerformanceController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        //////// Search Missing Surveys

        // GET: /Performance/GetShippings
        [Route("SearchShippings/{jobId}/{shShipid}")]
        [HttpGet("{jobId},{shShipid}")]
        public async Task<List<PerformanceShippings>> SearchShippings(int jobId, int shShipid)
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

            string jsonStr = await client.GetStringAsync(url + "Shippings?%24filter=ShJobnum eq " + jobId + " and ShShipid eq " + shShipid + 
                            "%20and%20ShQuantity%20ne%200&$select=ShShipid,ShJobnum,ShDest1,ShShipdate,ShQuantity,ShShipvia,ShQuid&$expand=REL_JsJob21000($select=Js2ProjMgr)&$expand=REL_Jobinf($select=JobDesc)");
            JObject result = JObject.Parse(jsonStr);
            var shippingList = result.SelectToken("value");
            //Debug.WriteLine(shippingList);
            
            List<PerformanceShippings> res = JsonConvert.DeserializeObject<List<PerformanceShippings>>(shippingList.ToString());

            return res;
        }

        // GET: /Performance/GetShippingsJobs
        [Route("GetShippingsJobs/{jobId}")]
        [HttpGet("{jobId}")]
        public async Task<List<PerformanceShippings>> GetShippingsJobs(int jobId)
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

            string jsonStr = await client.GetStringAsync(url + "Shippings?%24filter=ShJobnum eq " + jobId +
                            "%20and%20ShQuantity%20ne%200&$select=ShShipid,ShJobnum,ShDest1,ShShipdate,ShQuantity,ShShipvia,ShQuid&$expand=REL_JsJob21000($select=Js2ProjMgr)&$expand=REL_Jobinf($select=JobDesc)");
            JObject result = JObject.Parse(jsonStr);
            var shippingList = result.SelectToken("value");
            //Debug.WriteLine(shippingList);
            
            List<PerformanceShippings> res = JsonConvert.DeserializeObject<List<PerformanceShippings>>(shippingList.ToString());

            return res;
        }

    }
}
