using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EasyQuestionaire.Data;
using EasyQuestionaire.Models;
using System.Threading;

namespace EasyQuestionaire.Controllers
{
    [Produces("application/json")]
    [Route("api/QuestionType")]
    public class ApiQuestionTypeController : Controller
    {
        private readonly QuestionaireContext _context;

        public ApiQuestionTypeController(QuestionaireContext context)
        {
            Thread.Sleep(1000);
            _context = context;
        }

        // GET: api/ApiQuestionType
        [HttpGet]
        public IEnumerable<QuestionType> GetQuestionType()
        {
            return _context.QuestionType.OrderByDescending(o => o.UpdatedAt);
        }

        // GET: api/ApiQuestionType/name/Type1
        [HttpGet("name/{name}")]
        public async Task<IActionResult> GetQuestionTypeNameError([FromRoute] string name)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var questionType = await _context.QuestionType.SingleOrDefaultAsync(m => m.Name == name);

            if (questionType == null)
            {
                return Ok("");
            }

            return Ok("This name has already existed.");
        }

        // GET: api/ApiQuestionType/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestionType([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var questionType = await _context.QuestionType.SingleOrDefaultAsync(m => m.Id == id);

            if (questionType == null)
            {
                return NotFound();
            }

            var ip = questionType.OwnerIP.Split('.');
            questionType.OwnerIP = ip.Length > 0 ? ip[0] + ".*.*.*" : "";
            return Ok(questionType);
        }

        // PUT: api/ApiQuestionType/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionType([FromRoute] int id, [FromBody] QuestionType questionType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != questionType.Id)
            {
                return BadRequest();
            }

            questionType.UpdatedAt = DateTime.Now;
            _context.Entry(questionType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionTypeExists(id))
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

        // POST: api/ApiQuestionType
        [HttpPost]
        public async Task<IActionResult> PostQuestionType([FromBody] QuestionType questionType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            questionType.Name = questionType.Name.Replace('/', '-');
            questionType.UpdatedAt = DateTime.Now;
            questionType.OwnerIP = Request.HttpContext.Connection.RemoteIpAddress.ToString();

            _context.QuestionType.Add(questionType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionType", new { id = questionType.Id }, questionType);
        }

        // DELETE: api/ApiQuestionType/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionType([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var questionType = await _context.QuestionType.SingleOrDefaultAsync(m => m.Id == id);
            if (questionType == null)
            {
                return NotFound();
            }

            _context.QuestionType.Remove(questionType);
            await _context.SaveChangesAsync();

            return Ok(questionType);
        }

        private bool QuestionTypeExists(int id)
        {
            return _context.QuestionType.Any(e => e.Id == id);
        }
    }
}