

namespace hudson_data_center.Models
{
    public class SMI
    {
        public int SmiId { get; set; }

        public string SmiType { get; set; }

        public string SmiDesc { get; set; }

        public decimal SmiWidth { get; set; }

        public decimal SmiLength { get; set; }

        public decimal SmiBwt { get; set; }

        public decimal SmiCaliper { get; set; }

        public int SmiQoh { get; set; }
    }

    public class PutSMI
    {
        public int SmiId { get; set; }

        public int SmiStatus { get; set; }

        public int SmiKey2Seg2 { get; set; }

        public string SmiType { get; set; }

        public string SmiDesc { get; set; }
        
        public string SmiFinish { get; set; }
        
        public string SmiColor { get; set; }

        public int SmiBrightness { get; set; }

        public decimal SmiWidth { get; set; }

        public decimal SmiLength { get; set; }
        
        public string SmiGrain { get; set; }

        public decimal SmiBwt { get; set; }

        public int SmiBasisarea { get; set; }

        public int SmiMil { get; set; }

        public int SmiPoint { get; set; }

        public decimal SmiCaliper { get; set; }
        
        public decimal SmiSaleprice { get; set; }

        public decimal SmiPurchprice { get; set; }

        public int SmiQoh { get; set; }

        public int SmiOnorder { get; set; }

        #nullable enable
        public string? SmiFsc  { get; set; }

        #nullable enable
        public string? SmiFscCert { get; set; }

        public int SmiPcw { get; set; }

        #nullable enable
        public string? SmiSpare { get; set; }
    } 

    public class PatchSMI  {
        public string? op { get; set; }
        public string? path { get; set; }
        public int value { get; set; }
    } 
}
