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
        public IEnumerable<object> GetQuestionaire()
        {
            return _context.Questionaire
                .OrderByDescending(o => o.UpdatedAt)
                .Select(o => o.SafeContent);
        }

        // GET: api/Questionaire/title/Type1
        [HttpGet("title/{title}")]
        public async Task<IActionResult> GetQuestionaireTitleError([FromRoute] string title)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var questionaire = await _context.Questionaire.SingleOrDefaultAsync(m => m.Title == title);

            if (questionaire == null)
            {
                return Ok("");
            }

            return Ok("This title has already existed.");
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

            return Ok(questionaire.SafeContent);
        }

        // GET: api/Questionaire/questions/5
        [HttpGet("questions/{id}")]
        public async Task<IActionResult> GetQuestionaireQuestions([FromRoute] int id)
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

            await _context.Entry(questionaire).Collection(q => q.Questions).LoadAsync();

            return Ok(questionaire.Questions);
        }

        // PUT: api/Questionaire/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionaire([FromRoute] int id, [FromBody] Questionaire questionaire)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != questionaire.Id 
                && questionaire.Guid != _context.Questionaire.SingleOrDefault(m => m.Id == id).Guid)
            {
                return BadRequest();
            }

            questionaire.Title = questionaire.Title.Replace('/', '-');
            questionaire.UpdatedAt = DateTime.Now;
            questionaire.OwnerIP = Request.HttpContext.Connection.RemoteIpAddress.ToString();

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
        // Only way to return GUID. Users have to remember this.
        // GUID is the only required token to Edit/Delete questionaire.
        [HttpPost]
        public async Task<IActionResult> PostQuestionaire([FromBody] Questionaire questionaire)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            questionaire.Title = questionaire.Title.Replace('/', '-');
            questionaire.UpdatedAt = DateTime.Now;
            questionaire.OwnerIP = Request.HttpContext.Connection.RemoteIpAddress.ToString();

            _context.Questionaire.Add(questionaire);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionaire", new { id = questionaire.Id }, questionaire);
        }

        // DELETE: api/Questionaire/5/XXXXXXX
        [HttpDelete("{id}/{guid}")]
        public async Task<IActionResult> DeleteQuestionaire([FromRoute] int id, [FromRoute] Guid guid)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var questionaire = await _context.Questionaire.SingleOrDefaultAsync(m => m.Id == id && m.Guid == guid);
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

        private bool QuestionaireExists(Guid guid)
        {
            return _context.Questionaire.Any(e => e.Guid == guid);
        }
    }
}