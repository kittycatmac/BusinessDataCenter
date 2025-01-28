using hudson_data_center.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
// using System.Data.Entity;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace hudson_data_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerformanceSurveyController : ControllerBase
    {
        private readonly Hudson_DataCenterContext _context;

        public PerformanceSurveyController(Hudson_DataCenterContext context)
        {
            _context = context;
        }

        // GET: api/<PerformanceSurveyController>
        //[HttpGet]
        //public System.Collections.Generic.IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET: api/PerformanceSurvey
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PerformanceSurvey>>> GetPerformanceSurvey()
        {
            return await _context.PerformanceSurveys.ToListAsync();
        }

        // GET: api/PerformanceSurvey/GetChartSurveys
        [Route("GetChartSurveys")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PerformanceSurvey>>> GetChartSurveys()
        {
            DateTime aDate = DateTime.Now.Date;
            DateTime thirtyDaysAgo = aDate.AddDays(-30);
            
            string today = aDate.ToString("yyyy-MM-ddTHH:mm:ssK");
            string thirtyDaysAgoDateTime = thirtyDaysAgo.ToString("yyyy-MM-ddTHH:mm:ssK");
            Debug.WriteLine(today);
            Debug.WriteLine(thirtyDaysAgoDateTime);

            return await _context.PerformanceSurveys.Where(s => s.ShShipdate >= thirtyDaysAgo && s.ShShipdate <= aDate).ToListAsync();
        }

        // GET: api/PerformanceSurvey/GetChartYearSurveys
        [Route("GetChartYearSurveys")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PerformanceSurvey>>> GetChartYearSurveys()
        {
            DateTime aDate = DateTime.Now.Date;
            DateTime oneYearAgo = aDate.AddYears(-1); // Subtract 1 year to get the date from one year ago

            string today = aDate.ToString("yyyy-MM-ddTHH:mm:ssK");
            string oneYearAgoDateTime = oneYearAgo.ToString("yyyy-MM-ddTHH:mm:ssK");
            Debug.WriteLine(today);
            Debug.WriteLine(oneYearAgoDateTime);

            return await _context.PerformanceSurveys.Where(s => s.ShShipdate >= oneYearAgo && s.ShShipdate <= aDate).ToListAsync();
        }

        // GET: api/PerformanceSurveys/CheckforSurvey/""/""
        [Route("CheckforSurvey/{jobId}/{shShipid}")]
        [HttpGet("{jobId},{shShipid}")]
        public async Task<ActionResult<IEnumerable<PerformanceSurvey>>> CheckforSurvey(int jobId, int shShipid)
        {
            return await _context.PerformanceSurveys.Where(s => s.JobId == jobId && s.ShShipid == shShipid).ToListAsync();
        }

        // GET: api/PerformanceSurveys/CheckforJobSurvey/""
        [Route("CheckforJobSurvey/{jobId}")]
        [HttpGet("{jobId}")]
        public async Task<ActionResult<IEnumerable<PerformanceSurvey>>> CheckforJobSurvey(int jobId, int shShipid)
        {
            return await _context.PerformanceSurveys.Where(s => s.JobId == jobId).ToListAsync();
        }

        // // POST api/<PerformanceSurveyController>
        // [HttpPost]
        // public void Post([FromBody] string value)
        // {
        // }

        // POST: api/PerformanceSurvey
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PerformanceSurvey>> PostPerformanceSurvey(PerformanceSurvey performancesurvey)
        {
            // try
            // {
            //   PerformanceSurvey survey = _context.PerformanceSurveys.SingleOrDefault<PerformanceSurvey>(p => p.JobId == performancesurvey.JobId);
            //   if(survey == null) 
            //   {
            //     Console.WriteLine("Job not found");
            //   }
            // }
            // catch (Exception e)
            // {
            //     Console.WriteLine(e.Message);
            // }

            //Debug.WriteLine(survey);
            _context.PerformanceSurveys.Add(performancesurvey);
            await _context.SaveChangesAsync();

            return CreatedAtAction("PostPerformanceSurvey", new { id = performancesurvey.Id }, performancesurvey);
        }

        // PUT api/PerformanceSurvey/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerformanceSurvey(int id, PerformanceSurvey performancesurvey)
        {
            if (id != performancesurvey.Id)
            {
                return BadRequest();
            }

            _context.Entry(performancesurvey).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PerformanceSurveyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE api/<PerformanceSurveyController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        
        private bool PerformanceSurveyExists(int id)
        {
            return _context.PerformanceSurveys.Any(e => e.Id == id);
        }
    }
}
