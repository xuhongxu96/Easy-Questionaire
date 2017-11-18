using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Models
{
    public class QuestionType : IDateRecordModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string CreateFormTSX { get; set; }
        public string ShowFormTSX { get; set; }

        public int OwnerID { get; set; }
        public ApplicationUser Owner { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
