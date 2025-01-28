import { getProdIdDesc, getCompData } from '../../../../../../services/SurveyAPIs/shippingsApi';

export const populateDesc = async (d) => {
    // get call for product data
    const json = await getProdIdDesc(d.jobId, d.shQuid);
    if (json.length > 0) {
        if(json[0].qu2ShipComp1CompId == 0) {
            d.prodId = json[0].qu2Prodid;
            d.itemDesc = json[0].reL_JsJob27000 == null ? 'no description' : json[0].reL_JsJob27000.qu2Proddesc;
            d.itemValue = json[0].js280Value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            d.shipValueTotal = ((d.shQuantity * json[0].js280Value) / 1000).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
        // starts second component call filters out the CompIds that equal zero
        const fetchPromises = json
            .filter(j => j.qu2ShipComp1CompId !== 0)
            .map(async (j) => {
            const compId = j.qu2ShipComp1CompId;
            // splits out the qu2ShipComp1CompId indexes for next call 
            const digits = compId.toString().split('');
            const formNum =  digits[0] === '-' ? 0 + 0 : 0 + digits[0];
            const verNum = digits[1] + digits[2];
            const partsNum = digits[3] === '0' ? digits[4] : digits[3] + digits[4];
            // get call for component data
            const compData = await getCompData(d.jobId, formNum, verNum);
            // checks for part # in parts key
            let foundKey = null;
            if(compData.length > 0 ) {
                for (const key in compData[0]) {
                    if (key.includes(partsNum)) {
                    foundKey = compData[0][key];
                    break;
                    }
                }
                d.prodId = j.qu2Prodid === 0  ? null : j.qu2Prodid;
                d.itemDesc = j.qu2Prodid === 0 ? foundKey : j.reL_JsJob27000.qu2Proddesc;
                d.itemValue = j.js280Value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                d.shipValueTotal = ((d.shQuantity * j.js280Value) / 1000).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            } else {
                d.prodId = j.qu2Prodid === 0  ? null : j.qu2Prodid;
                d.itemDesc = j.reL_JsJob27000 == null ? 'no description' : j.reL_JsJob27000.qu2Proddesc;
                d.itemValue = j.js280Value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                d.shipValueTotal = ((d.shQuantity * j.js280Value) / 1000).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            }
        });
  
      await Promise.all(fetchPromises);
    } else {
      d.prodId = null;
      d.itemDesc = "no product description";
      d.itemValue = null;
      d.shipValueTotal = null;
    }
};