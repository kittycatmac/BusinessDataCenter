using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hudson_data_center.Models;

namespace hudson_data_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SmilocationsController : ControllerBase
    {
        private readonly Hudson_DataCenterContext _context;

        public SmilocationsController(Hudson_DataCenterContext context)
        {
            _context = context;
        }

        // GET: api/Smilocations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Smilocation>>> GetSmilocations()
        {
            return await _context.Smilocations.ToListAsync();
        }

        // GET: api/Smilocations/location/"hallway"
        [Route("location/{location}")]
        [HttpGet("{location}")]
        public async Task<ActionResult<IEnumerable<Smilocation>>> GetSmilocations(string location)
        {
            return await _context.Smilocations.Where(s => s.Location == location).ToListAsync();
        }

        // GET: api/Smilocations/tab/"hallway"/"skids"
        [Route("tab/{location}/{tab}")]
        [HttpGet("{location},{tab}")]
        public async Task<ActionResult<IEnumerable<Smilocation>>> GetSmiTab(string location, string tab)
        {
            return await _context.Smilocations.Where(s => s.Location == location && s.Tab == tab).ToListAsync();
        }

        // DELETE: api/Smilocations/5
        [HttpDelete("{ids}")]
        public async Task<IActionResult> DeleteRowsSmilocation(string ids)
        {
            string[] delIds = ids.Split(",");
            foreach(string id in delIds)
            {
                int Num =Int32.Parse(id);
                var smilocation = await _context.Smilocations.FindAsync(Num);
                if (smilocation == null)
                {
                    return NotFound();
                }
                _context.Smilocations.Remove(smilocation);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        // PUT: api/Smilocations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSmilocation(int id, Smilocation smilocation)
        {
            if (id != smilocation.Id)
            {
                return BadRequest();
            }

            _context.Entry(smilocation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SmilocationExists(id))
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

        // POST: api/Smilocations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Smilocation>> PostSmilocation(Smilocation smilocation)
        {
            _context.Smilocations.Add(smilocation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSmilocation", new { id = smilocation.Id }, smilocation);
        }

        // POST: api/Smilocations/Clear
        [Route("ClearSmilocationTotals")]
        [HttpPost]
        public async Task<ActionResult<IEnumerable<Smilocation>>> ClearSmilocationTotals()
        {

            var allRows = await _context.Smilocations.ToListAsync();

            foreach (var row in allRows)
            {
                row.Inches = 0;
                row.QuantityCartons = 0;
                row.QuantitySkids = 0;
                row.TotalLooseQty = 0;
                row.TotalOh = 0;
                row.TotalQty = 0;
            }

            await _context.SaveChangesAsync();

            return await _context.Smilocations.ToListAsync();
        }

        private bool SmilocationExists(int id)
        {
            return _context.Smilocations.Any(e => e.Id == id);
        }
    }
}
