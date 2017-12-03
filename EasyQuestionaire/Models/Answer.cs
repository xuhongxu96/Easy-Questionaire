using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Models
{
    public class Answer : IDateRecordModel
    {
        public int Id { get; set; }
        [Required]
        public string Content { get; set; }
        public string OwnerIP { get; set; }
        [Required]
        public DateTimeOffset TimeSpent { get; set; }

        [Required]
        public int QuestionId { get; set; }
        public Question Question { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        [NotMapped]
        public object SafeContent
        {
            get
            {
                var ip = "*.*.*.*";
                var ipParts = OwnerIP.Split('.');
                if (ipParts.Length == 4)
                {
                    ip = ipParts[0] + ".*.*." + ipParts[3];
                }

                return new
                {
                    Id = Id,
                    Content = Content,
                    OwnerIP = ip,
                    TimeSpent = TimeSpent,
                    QuestionId = QuestionId,
                    Question = Question,
                    CreatedAt = CreatedAt,
                    UpdatedAt = UpdatedAt,
                };
            }
        }
    }
}
