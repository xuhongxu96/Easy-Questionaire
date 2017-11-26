﻿using System;
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
        public Questionaire Questionaire { get; set; }

        [Required]
        public int TypeId { get; set; }
        public QuestionType Type { get; set; }

        [Required]
        public int Order { get; set; }
        public string Content { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
