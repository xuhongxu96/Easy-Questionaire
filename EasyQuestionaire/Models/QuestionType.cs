using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Models
{
    public class QuestionType : IDateRecordModel
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string CreateFormTSX { get; set; }
        [Required]
        public string ShowFormTSX { get; set; }
        [Required]
        public string CompiledCreateForm { get; set; }
        [Required]
        public string CompiledShowForm { get; set; }
        public string OwnerIP { get; set; }
       
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
                    Name = Name,
                    CreateFormTSX = CreateFormTSX,
                    ShowFormTSX = ShowFormTSX,
                    CompiledCreateForm = CompiledCreateForm,
                    CompiledShowForm = CompiledShowForm,
                    OwnerIP = ip,
                    CreatedAt = CreatedAt,
                    UpdatedAt = UpdatedAt,
                };
            }
        }
    }
}
