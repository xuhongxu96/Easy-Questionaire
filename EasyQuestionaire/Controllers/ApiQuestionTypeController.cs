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
            _context = context;
        }

        // GET: api/QuestionType
        [HttpGet]
        public IEnumerable<object> GetQuestionType()
        {
            return _context.QuestionType
                .OrderByDescending(o => o.UpdatedAt)
                .Select(o => new {
                    Id = o.Id,
                    Name = o.Name,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt,
                });
        }

        // GET: api/QuestionType/name/Type1
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

        // GET: api/QuestionType/5
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

            return Ok(questionType.SafeContent);
        }

        // POST: api/QuestionType
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

            return CreatedAtAction("GetQuestionType", new { id = questionType.Id }, questionType.SafeContent);
        }

        private bool QuestionTypeExists(int id)
        {
            return _context.QuestionType.Any(e => e.Id == id);
        }
    }
}