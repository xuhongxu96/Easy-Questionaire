using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EasyQuestionaire.Data;
using EasyQuestionaire.Models;

namespace EasyQuestionaire.Controllers
{
    [Produces("application/json")]
    [Route("api/Questionaire")]
    public class ApiQuestionaireController : Controller
    {
        private readonly QuestionaireContext _context;

        public ApiQuestionaireController(QuestionaireContext context)
        {
            _context = context;
        }

        // GET: api/Questionaire
        [HttpGet]
        public IEnumerable<Questionaire> GetQuestionaire()
        {
            return _context.Questionaire;
        }

        // GET: api/Questionaire/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestionaire([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var questionaire = await _context.Questionaire.SingleOrDefaultAsync(m => m.Id == id);

            if (questionaire == null)
            {
                return NotFound();
            }

            var ip = questionaire.OwnerIP.Split('.');
            questionaire.OwnerIP = ip.Length > 0 ? ip[0] + ".*.*.*" : "";
            return Ok(questionaire);
        }

        // PUT: api/Questionaire/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionaire([FromRoute] int id, [FromBody] Questionaire questionaire)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != questionaire.Id)
            {
                return BadRequest();
            }

            questionaire.UpdatedAt = DateTime.Now;

            _context.Entry(questionaire).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionaireExists(id))
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

        // POST: api/Questionaire
        [HttpPost]
        public async Task<IActionResult> PostQuestionaire([FromBody] Questionaire questionaire)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            questionaire.UpdatedAt = DateTime.Now;

            _context.Questionaire.Add(questionaire);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionaire", new { id = questionaire.Id }, questionaire);
        }

        // DELETE: api/Questionaire/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionaire([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var questionaire = await _context.Questionaire.SingleOrDefaultAsync(m => m.Id == id);
            if (questionaire == null)
            {
                return NotFound();
            }

            _context.Questionaire.Remove(questionaire);
            await _context.SaveChangesAsync();

            return Ok(questionaire);
        }

        private bool QuestionaireExists(int id)
        {
            return _context.Questionaire.Any(e => e.Id == id);
        }
    }
}