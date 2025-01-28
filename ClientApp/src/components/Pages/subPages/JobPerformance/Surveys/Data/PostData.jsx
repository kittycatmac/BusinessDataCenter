import { postSurvey } from '../../../../../../services/SurveyAPIs/surveyTableApi';

export const postNewRow = async (d) => {
    const postData = {
        projMgr: d.projMgr,
        jobId: d.jobId,
        jobDesc: d.jobDesc,
        itemDesc: d.itemDesc,
        prodId: d.productId,
        shQuantity: d.Quantity,
        shQuid: d.Qtyid,
        itemValue: Number(d.itemValue.toString().replace(/[^0-9.-]+/g, "")),
        shShipid: d.Shipid,
        shShipdate: new Date(d.Shipdate).toISOString(),
        shipValueTotal: Number(d.shipmentValue.toString().replace(/[^0-9.-]+/g, "")),
        shippedOnTime: d.shippedOnTime,
        shippedProdQuality: d.shippedProdQuality,
        surveyCompleted: d.surveyCompleted,
        jobSurveyCompleted: d.jobSurveyCompleted,
        onTimeComments: d.OnTimeComments,
        qualityComments: d.QualityComments
    };

    try {
        const response = await postSurvey(postData);
        if (response) {
            return { success: true, message: "New Survey saved -> JobId: " + d.jobId };
        } else {
            return { success: false, message: "New Survey NOT saved -> JobId: " + d.jobId };
        }
    } catch (error) {
        console.error("Error posting survey:", error);
        return { success: false, message: "New Survey NOT saved. Error: " + error.message };
    }
            
};