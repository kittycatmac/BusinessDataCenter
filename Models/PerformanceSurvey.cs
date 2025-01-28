using System;
using System.Collections.Generic;

namespace hudson_data_center.Models
{
    public partial class PerformanceSurvey
    {
        public int Id { get; set; }
        public string ProjMgr { get; set; }
        public int? JobId { get; set; }
        public string JobDesc { get; set; }
        public string ItemDesc { get; set; }
        public int? ProdId { get; set; }
        public int? ShQuantity { get; set; }
        public int? ShQuid { get; set; }
        public decimal? ItemValue { get; set; }
        public int? ShShipid { get; set; }
        public DateTime? ShShipdate { get; set; }
        public decimal? ShipValueTotal { get; set; }
        public int? ShippedOnTime { get; set; }
        public int? ShippedProdQuality { get; set; }
        public DateTime? SurveyCompleted { get; set; } 
        public DateTime? JobSurveyCompleted { get; set; }
        public string QualityComments { get; set; }
        public string OnTimeComments { get; set; }
    }

}
