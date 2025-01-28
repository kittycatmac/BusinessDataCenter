using System;
using System.Collections.Generic;

namespace hudson_data_center.Models
{
    public partial class Smilocation
    {
        public int Id { get; set; }
        public DateTime? DateTime { get; set; }
        public decimal? Inches { get; set; }
        public string Location { get; set; }
        public string Notes { get; set; }
        public string ProductId { get; set; }
        public int? QtyPerCarton { get; set; }
        public int? QtyPerSkid { get; set; }
        public int? QuantityCartons { get; set; }
        public int? QuantitySkids { get; set; }
        public int? SmiBwt { get; set; }
        public decimal? SmiCaliper { get; set; }
        public string SmiDesc { get; set; }
        public int? SmiId { get; set; }
        public decimal? SmiLength { get; set; }
        public int? SmiQoh { get; set; }
        public string SmiType { get; set; }
        public decimal? SmiWidth { get; set; }
        public string Tab { get; set; }
        public decimal? TotalLooseQty { get; set; }
        public decimal? TotalOh { get; set; }
        public decimal? TotalQty { get; set; }
        public int? GridId { get; set; }
    }
}
