using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Models
{
    public class Answer : IDateRecordModel
    {
        public int ID { get; set; }

        public int QuestionID { get; set; }
        public Question Question { get; set; }

        public string Content { get; set; }

        public int UserID { get; set; }
        public ApplicationUser User { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
