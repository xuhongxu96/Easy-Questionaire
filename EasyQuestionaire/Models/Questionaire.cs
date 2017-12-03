using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Models
{
    public class Questionaire : IDateRecordModel
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        public string OwnerIP { get; set; }

        public Guid Guid { get; private set; } = Guid.NewGuid();

        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        [NotMapped]
        public bool IsEnabled
        {
            get
            {
                return DateTime.Compare(DateTime.Now, EndDate) <= 0
                    && DateTime.Compare(StartDate, DateTime.Now) <= 0;
            }
        }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        public ICollection<Question> Questions { get; set; }

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
                    Title = Title,
                    Description = Description,
                    OwnerIP = ip,
                    StartDate = StartDate,
                    EndDate = EndDate,
                    IsEnabled = IsEnabled,
                    CreatedAt = CreatedAt,
                    UpdatedAt = UpdatedAt,
                };
            }
        }
    }
}
