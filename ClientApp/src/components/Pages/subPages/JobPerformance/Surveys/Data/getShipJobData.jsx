import { searchShippings } from '../../../../../../services/SurveyAPIs/shippingsApi';
import { processAllData } from './ProcessAllData';

export const getShipJobData = async (searchJobId, searchShipId, setAllData) => {
    try {
        if(searchShipId == 0) {
            const json = await searchShippings(searchJobId);
            if (json.length === 0) {
                return { success: false, message: "There are no shipments for Job Id: " + searchJobId};
            } else if (json.length > 0) {
                var itemsProcessed = 0;
                var objHolder = [];
                json.forEach((j) => {
                    objHolder.push({
                        jobId: j.shJobnum,
                        shDest: j.shDest1,
                        shShipvia: j.shShipvia,
                        shShipid: j.shShipid,
                        shQuantity: j.shQuantity,
                        shQuid: j.shQuid,
                        shShipdate: j.shShipdate,
                        projMgr: j.reL_JsJob21000.js2ProjMgr,
                        jobDesc: j.reL_Jobinf.jobDesc,
                    });
                    itemsProcessed++;
                });
                if(itemsProcessed === json.length) {
                    processAllData(objHolder, setAllData);
                    return { success: true, message: 'found ship job data'};
                }
            }
        } else {
            const json = await searchShippings(searchJobId, searchShipId);
            if (json.length === 0) {
                return { success: false, message: 'There is no data for this Job Id and Ship Id or double check Ids.'};
            } else if (json.length > 0) {
                 console.log(json);
                 var itemsProcessed = 0;
                 var objHolder = [];
                 json.forEach((j) => {
                     objHolder.push({
                         jobId: j.shJobnum,
                         shDest: j.shDest1,
                         shShipvia: j.shShipvia,
                         shShipid: j.shShipid,
                         shQuantity: j.shQuantity,
                         shQuid: j.shQuid,
                         shShipdate: j.shShipdate,
                         projMgr: j.reL_JsJob21000.js2ProjMgr,
                         jobDesc: j.reL_Jobinf.jobDesc,
                     });
                     itemsProcessed++;
                 });
                 console.log(objHolder);
                 if(itemsProcessed === json.length) {
                    processAllData(objHolder, setAllData);
                    return { success: true, message: 'found ship job data'};
                 }
            }
        }
    } catch (error) {
        console.error("Error getting job data from JMS:", error);
        return { success: false, message: "Survey NOT updated and  saved. Error: " + error.message };
    }
};