using EasyQuestionaire.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyQuestionaire.Data
{
    public class QuestionaireContext : DbContext
    {
        public QuestionaireContext(DbContextOptions<QuestionaireContext> options) : base(options)
        {
        }

        public DbSet<Questionaire> Questionaire { get; set; }
        public DbSet<QuestionType> QuestionType { get; set; }
        public DbSet<Question> Question { get; set; }
        public DbSet<Answer> Answer { get; set; }

        private void SetupDateRecordModel<T>(ModelBuilder modelBuilder) where T: class, IDateRecordModel
        {
            modelBuilder.Entity<T>()
                .Property(o => o.CreatedAt)
                .HasDefaultValueSql("getdate()");

            modelBuilder.Entity<T>().ToTable(typeof(T).Name);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            SetupDateRecordModel<Questionaire>(modelBuilder);
            SetupDateRecordModel<QuestionType>(modelBuilder);
            SetupDateRecordModel<Question>(modelBuilder);
            SetupDateRecordModel<Answer>(modelBuilder);

            modelBuilder.Entity<QuestionType>()
                .HasIndex(o => o.Name)
                .IsUnique();
        }
    }
}
