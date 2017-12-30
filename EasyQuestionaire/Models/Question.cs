using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Models
{
    public class Question : IDateRecordModel
    {
        public int Id { get; set; }

        [Required]
        public int QuestionaireId { get; set; }
        [JsonIgnore]
        public Questionaire Questionaire { get; set; }

        [Required]
        public int TypeId { get; set; }
        [JsonIgnore]
        public QuestionType Type { get; set; }

        [Required]
        public int Order { get; set; }
        public string Content { get; set; }

        [JsonIgnore]
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
