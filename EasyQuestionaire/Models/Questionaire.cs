using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Models
{
    public class Questionaire : IDateRecordModel
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public int OwnerID { get; set; }
        public ApplicationUser Owner { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
