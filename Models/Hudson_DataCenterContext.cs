using Microsoft.EntityFrameworkCore;

namespace hudson_data_center.Models
{
    public partial class Hudson_DataCenterContext : DbContext
    {
        public Hudson_DataCenterContext()
        {
        }

        public Hudson_DataCenterContext(DbContextOptions<Hudson_DataCenterContext> options)
            : base(options)
        {
        }

        public virtual DbSet<PerformanceSurvey> PerformanceSurveys { get; set; }
        public virtual DbSet<Smilocation> Smilocations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PerformanceSurvey>(entity =>
            {
                //entity.ToTable("PerformanceSurveys");

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");

                entity.Property(e => e.JobDesc)
                    .HasMaxLength(225)
                    .IsUnicode(false)
                    .HasColumnName("jobDesc");

                entity.Property(e => e.JobId).HasColumnName("jobId");

                entity.Property(e => e.ItemDesc)
                    .HasMaxLength(225)
                    .IsUnicode(false)
                    .HasColumnName("itemDesc");

                entity.Property(e => e.ProdId).HasColumnName("prodId");

                entity.Property(e => e.ItemValue)
                    .HasColumnType("decimal(19, 4)")
                    .HasColumnName("itemValue");

                entity.Property(e => e.ProjMgr)
                    .HasMaxLength(225)
                    .IsUnicode(false)
                    .HasColumnName("projMgr");

                entity.Property(e => e.ShQuantity).HasColumnName("shQuantity");

                entity.Property(e => e.ShQuid).HasColumnName("shQuid");

                entity.Property(e => e.ShShipdate)
                    .HasColumnType("datetime")
                    .HasColumnName("shShipdate");

                entity.Property(e => e.ShShipid).HasColumnName("shShipid");

                entity.Property(e => e.ShipValueTotal)
                    .HasColumnType("decimal(19, 4)")
                    .HasColumnName("shipValueTotal");

                entity.Property(e => e.ShippedOnTime).HasColumnName("shippedOnTime");

                entity.Property(e => e.ShippedProdQuality).HasColumnName("shippedProdQuality");

                entity.Property(e => e.SurveyCompleted)
                    .HasColumnType("datetime")
                    .HasColumnName("surveyCompleted"); 

                entity.Property(e => e.JobSurveyCompleted)
                    .HasColumnType("datetime")
                    .HasColumnName("jobSurveyCompleted");

                entity.Property(e => e.QualityComments)
                    .HasMaxLength(225)
                    .IsUnicode(false)
                    .HasColumnName("qualityComments");

                entity.Property(e => e.OnTimeComments)
                    .HasMaxLength(225)
                    .IsUnicode(false)
                    .HasColumnName("onTimeComments");
            });

            modelBuilder.Entity<Smilocation>(entity =>
            {
                entity.ToTable("SMILocations");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DateTime)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("dateTime");

                entity.Property(e => e.GridId).HasColumnName("gridId");

                entity.Property(e => e.Inches)
                    .HasColumnType("decimal(6, 3)")
                    .HasColumnName("inches");

                entity.Property(e => e.Location)
                    .HasMaxLength(200)
                    .HasColumnName("location");

                entity.Property(e => e.Notes)
                    .HasMaxLength(200)
                    .HasColumnName("notes");

                entity.Property(e => e.ProductId)
                    .HasMaxLength(200)
                    .HasColumnName("productId");

                entity.Property(e => e.QtyPerCarton).HasColumnName("qtyPerCarton");

                entity.Property(e => e.QtyPerSkid).HasColumnName("qtyPerSkid");

                entity.Property(e => e.QuantityCartons).HasColumnName("quantityCartons");

                entity.Property(e => e.QuantitySkids).HasColumnName("quantitySkids");

                entity.Property(e => e.SmiBwt).HasColumnName("smiBwt");

                entity.Property(e => e.SmiCaliper)
                    .HasColumnType("decimal(10, 4)")
                    .HasColumnName("smiCaliper");

                entity.Property(e => e.SmiDesc)
                    .HasMaxLength(200)
                    .HasColumnName("smiDesc");

                entity.Property(e => e.SmiId).HasColumnName("smiId");

                entity.Property(e => e.SmiLength)
                    .HasColumnType("decimal(8, 3)")
                    .HasColumnName("smiLength");

                entity.Property(e => e.SmiQoh).HasColumnName("smiQoh");

                entity.Property(e => e.SmiType)
                    .HasMaxLength(200)
                    .HasColumnName("smiType");

                entity.Property(e => e.SmiWidth)
                    .HasColumnType("decimal(8, 3)")
                    .HasColumnName("smiWidth");

                entity.Property(e => e.Tab)
                    .HasMaxLength(200)
                    .HasColumnName("tab");

                entity.Property(e => e.TotalLooseQty)
                    .HasColumnType("decimal(10, 3)")
                    .HasColumnName("totalLooseQty");

                entity.Property(e => e.TotalOh)
                    .HasColumnType("decimal(10, 3)")
                    .HasColumnName("totalOH");

                entity.Property(e => e.TotalQty)
                    .HasColumnType("decimal(10, 3)")
                    .HasColumnName("totalQty");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
