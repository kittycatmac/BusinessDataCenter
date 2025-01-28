import { putSurvey } from '../../../../../../services/SurveyAPIs/surveyTableApi';

export const updateData = async (d, newOption, sendComm) => {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let newQuality = null;
    let newOnTime = null;
    let qualityComments = null;
    let ontimeComments = null;
    if(typeof newOption === 'undefined') {
        console.log('QualitySurveys.jsx put call');
    } else if (newOption[0].shippedOnTime) {
        newOnTime = newOption[0].shippedOnTime;
        ontimeComments = sendComm;
    } else if (newOption[0].shippedProdQuality) {
        newQuality = newOption[0].shippedProdQuality;
        qualityComments = sendComm;
    }
    const putData = {
        id: d.id,
        projMgr: d.projMgr,
        jobId: d.jobId,
        jobDesc: d.jobDesc,
        itemDesc: d.itemDesc,
        prodId: d.prodId ? d.prodId : d.productId,
        shQuantity: d.shQuantity ? d.shQuantity : d.Quantity,
        shQuid: d.shQuid ? d.shQuid : d.Qtyid,
        itemValue: Number(d.itemValue.toString().replace(/[^0-9.-]+/g,"")),
        shShipid: d.shShipid ? d.shShipid : d.Shipid,
        shShipdate: d.shShipdate ? d.shShipdate : d.Shipdate,
        shipValueTotal: d.shipValueTotal ? d.shipValueTotal : Number(d.shipmentValue.toString().replace(/[^0-9.-]+/g,"")),
        shippedOnTime: newOnTime ? newOnTime : d.shippedOnTime,
        shippedProdQuality: newQuality ? newQuality : d.shippedProdQuality,
        surveyCompleted: newOnTime ? new Date(Date.now() - tzoffset).toISOString().slice(0, 19) : d.surveyCompleted,
        jobSurveyCompleted: newQuality ? new Date(Date.now() - tzoffset).toISOString().slice(0, 19) : d.jobSurveyCompleted,
        onTimeComments: ontimeComments ? ontimeComments : d.onTimeComments,
        qualityComments: qualityComments ? qualityComments : d.QualityComments ? d.QualityComments : d.qualityComments,
    };

    try {
        const response = await putSurvey(d.id, putData);
        if (response) {
            return { success: true, message: "Survey updated and saved -> JobId: " + d.jobId };
        } else {
            return { success: false, message: "Survey NOT updated and saved -> JobId: " + d.jobId };
        }
    } catch (error) {
        console.error("Error posting survey:", error);
        return { success: false, message: "Survey NOT updated and  saved. Error: " + error.message };
    }
            
};