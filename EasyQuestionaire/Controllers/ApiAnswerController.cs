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
    [Route("api/Answer")]
    public class ApiAnswerController : Controller
    {
        private readonly QuestionaireContext _context;
        private string SessionID
        {
            get
            {
                if (HttpContext.Session == null)
                {
                    return null;
                }
                else
                {
                    var id = HttpContext.Session.GetString("SessionID");
                    if (id != null)
                    {
                        return id;
                    }
                    else
                    {
                        id = Guid.NewGuid().ToString() + DateTime.Now.ToString();
                        HttpContext.Session.SetString("SessionID", id);
                        return id;
                    }
                }
            }
        }

        public ApiAnswerController(QuestionaireContext context)
        {
            _context = context;
        }

        // GET: api/Answer
        [HttpGet]
        public IEnumerable<object> GetAnswers()
        {
            return _context.Answer
                .Where(o => o.SessionId == SessionID)
                .Select(o => o.SafeContent);
        }

        // GET: api/Answer/5
        [HttpGet("{questionId}")]
        public async Task<IActionResult> GetAnswer([FromRoute] int questionId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var answer = await _context.Answer.SingleOrDefaultAsync(m => m.SessionId == SessionID
                                                                            && m.QuestionId == questionId);

            if (answer == null)
            {
                return NotFound();
            }

            return Ok(answer.SafeContent);
        }

        // POST: api/Answer
        [HttpPost]
        public async Task<IActionResult> PostAnswer([FromBody] Answer answer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existedAnswer = await _context.Answer.SingleOrDefaultAsync(m => m.SessionId == SessionID
                                                                                && m.QuestionId == answer.QuestionId);
            if (existedAnswer == null)
            {
                answer.SessionId = SessionID;
                answer.UpdatedAt = DateTime.Now;
                answer.OwnerIP = Request.HttpContext.Connection.RemoteIpAddress.ToString();

                _context.Answer.Add(answer);
                await _context.SaveChangesAsync();

                return Ok(answer.SafeContent);
            }
            else
            {
                existedAnswer.OwnerIP = Request.HttpContext.Connection.RemoteIpAddress.ToString();
                existedAnswer.UpdatedAt = DateTime.Now;
                existedAnswer.TimeSpent = answer.TimeSpent;
                existedAnswer.Content = answer.Content;

                _context.Entry(existedAnswer).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(existedAnswer.SafeContent);
            }

        }

        private bool AnswerExists(int id)
        {
            return _context.Answer.Any(e => e.Id == id);
        }
    }
}