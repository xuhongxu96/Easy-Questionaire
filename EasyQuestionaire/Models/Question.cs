using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Models
{
    public class Question : IDateRecordModel
    {
        public int ID { get; set; }

        public int QuestionaireID { get; set; }
        public Questionaire Questionaire { get; set; }

        public int TypeID { get; set; }
        public QuestionType Type { get; set; }

        public string Content { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
