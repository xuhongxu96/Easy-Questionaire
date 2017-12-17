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
    public struct QuestionContent
    {
        public int ID { get; set; }
        public string Content { get; set; }
    }

    [Produces("application/json")]
    [Route("api/Question")]
    public class ApiQuestionController : Controller
    {
        private readonly QuestionaireContext _context;

        public ApiQuestionController(QuestionaireContext context)
        {
            _context = context;
        }

        // GET: api/Question/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var question = await _context.Question.SingleOrDefaultAsync(m => m.Id == id);

            if (question == null)
            {
                return NotFound();
            }

            return Ok(question);
        }

        // PUT: api/Question/5/xxx-xxx
        [HttpPut("{id}/{guid}")]
        public async Task<IActionResult> PutQuestionContent([FromRoute] int id, [FromRoute] Guid guid, [FromBody] QuestionContent content)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var question = await _context.Question.SingleOrDefaultAsync(m => m.Id == id);

            await _context.Entry(question).Reference(o => o.Questionaire).LoadAsync();
            if (question.Questionaire.Guid != guid)
            {
                return BadRequest(new
                {
                    guid = $"Wrong Guid: {guid}."
                });
            }

            question.Content = content.Content;
            question.UpdatedAt = DateTime.Now;
            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new {});
        }

        // GET: api/Question/move/5/2/xxx-xxx
        [HttpGet("move/{id}/{dstOrder}/{guid}")]
        public async Task<IActionResult> PutQuestion([FromRoute] int id, [FromRoute] Guid guid, [FromRoute] int dstOrder)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var question = await _context.Question.SingleOrDefaultAsync(m => m.Id == id);

            if (question == null)
            {
                return NotFound();
            }

            await _context.Entry(question).Reference(o => o.Questionaire).LoadAsync();
            if (question.Questionaire.Guid != guid)
            {
                return BadRequest(new
                {
                    guid = $"Wrong Guid: {guid}."
                });
            }

            if (question.Order == dstOrder)
            {
                return Ok(question);
            }

            var dstQuestion =
                await _context.Question.SingleOrDefaultAsync(o => o.QuestionaireId == question.QuestionaireId && o.Order == dstOrder);

            dstQuestion.Order = question.Order;
            question.Order = dstOrder;

            dstQuestion.UpdatedAt = DateTime.Now;
            question.UpdatedAt = DateTime.Now;

            _context.Entry(dstQuestion).State = EntityState.Modified;
            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(question);
        }

        // POST: api/Question/xxx-xxx
        [HttpPost("{guid}")]
        public async Task<IActionResult> PostQuestion([FromRoute] Guid guid, [FromBody] Question question)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var questionaire = await _context.Questionaire.SingleOrDefaultAsync(o => o.Id == question.QuestionaireId);
            if (questionaire.Guid != guid)
            {
                return BadRequest(new
                {
                    guid = $"Wrong Guid: {guid}."
                });
            }

            var shouldUpdateQuestions = from q in _context.Question
                                        where q.QuestionaireId == question.QuestionaireId
                                        && q.Order >= question.Order
                                        select q;
            foreach (var q in shouldUpdateQuestions)
            {
                q.Order++;
                q.UpdatedAt = DateTime.Now;
                _context.Entry(q).State = EntityState.Modified;
            }

            question.UpdatedAt = DateTime.Now;
            _context.Question.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestion", new { id = question.Id }, question);
        }

        // DELETE: api/Question/5/xxx-xxx
        [HttpDelete("{id}/{guid}")]
        public async Task<IActionResult> DeleteQuestion([FromRoute] int id, [FromRoute] Guid guid)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var question = await _context.Question.SingleOrDefaultAsync(m => m.Id == id);
            if (question == null)
            {
                return NotFound();
            }

            await _context.Entry(question).Reference(o => o.Questionaire).LoadAsync();
            if (question.Questionaire.Guid != guid)
            {
                return BadRequest(new
                {
                    guid = $"Wrong Guid: {guid}."
                });
            }

            var shouldUpdateQuestions = from q in _context.Question
                                        where q.QuestionaireId == question.QuestionaireId
                                        && q.Order > question.Order
                                        select q;
            foreach (var q in shouldUpdateQuestions)
            {
                q.Order--;
                q.UpdatedAt = DateTime.Now;
                _context.Entry(q).State = EntityState.Modified;
            }

            _context.Question.Remove(question);
            await _context.SaveChangesAsync();

            return Ok(question);
        }

        // PUT: api/Question/saveAll/xxx-xxx
        [HttpPut("saveAll/{guid}")]
        public async Task<IActionResult> PutAllQuestionContent([FromRoute] Guid guid, [FromBody] List<QuestionContent> contentList)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            foreach (var content in contentList)
            {
                var question = await _context.Question.SingleOrDefaultAsync(m => m.Id == content.ID);

                await _context.Entry(question).Reference(o => o.Questionaire).LoadAsync();
                if (question.Questionaire.Guid != guid)
                {
                    return BadRequest(new
                    {
                        guid = $"Wrong Guid: {guid}."
                    });
                }

                question.Content = content.Content;
                question.UpdatedAt = DateTime.Now;
                _context.Entry(question).State = EntityState.Modified;
            }
           
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(new { });
        }

        private bool QuestionExists(int id)
        {
            return _context.Question.Any(e => e.Id == id);
        }
    }
}