using System;

namespace hudson_data_center.Models
{
    public class PerformanceProductId
    {
        public int Qu2Prodid { get; set; }
        public decimal Js280Value  { get; set; } 
        public int Qu2ShipComp1CompId  { get; set; }
        public JsJob27000Model REL_JsJob27000 { get; set; }
    }

        public class JsJob27000Model
    {
        public string Qu2Proddesc { get; set; }
    }

    public class PerformanceCompData
    {
        public string Qu2Parts1Desc { get; set; }
        public string Qu2Parts2Desc { get; set; }
        public string Qu2Parts3Desc { get; set; }
        public string Qu2Parts4Desc { get; set; }
        public string Qu2Parts5Desc { get; set; }
        public string Qu2Parts6Desc { get; set; }
        public string Qu2Parts7Desc { get; set; }
        public string Qu2Parts8Desc { get; set; }
        public string Qu2Parts9Desc { get; set; }
        public string Qu2Parts10Desc { get; set; }
    }

        public class PerformanceShippings
    {
        public int ShShipid { get; set; }
        public int ShQuid { get; set; }
        public int ShJobnum { get; set; }
        public string ShDest1 { get; set; }
        public DateTime ShShipdate { get; set; }
        public int ShQuantity { get; set; }
        public string ShShipvia { get; set; }
        public JsJob21000Model REL_JsJob21000 { get; set; }
        public JobinfModel REL_Jobinf { get; set; }
    }

        public class JsJob21000Model
    {
        public string Js2ProjMgr { get; set; }
    }

        public class JobinfModel
    {
        public string JobDesc { get; set; }
    }

}
