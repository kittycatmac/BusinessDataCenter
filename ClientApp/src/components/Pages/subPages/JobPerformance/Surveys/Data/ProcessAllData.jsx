import { populateDesc } from './GetDesc';

export const processAllData = async (data, setAllData) => {
    try {
        await Promise.all(data.map(d => populateDesc(d)));
        // all async processing is complete
        // splits out job data and ship data
        let shipOData = [];
        let jobOData = [];
        data.forEach((d) => {
            shipOData.push({
                jobId: d.jobId,
                Quantity: d.shQuantity,
                Destination: d.shDest,
                Shipdate: d.shShipdate, 
                Shipvia: d.shShipvia,
                Shipid: d.shShipid,
                Qtyid: d.shQuid,
                productId: d.prodId,
                itemDesc: d.itemDesc,
                itemValue: d.itemValue,
                shipmentValue: d.shipValueTotal,
            });
            jobOData.push({
                jobId: d.jobId,
                jobDesc: d.jobDesc,
                projMgr: d.projMgr,
            });
        });
        // creates an array per job and items:[] sub array stores all shipments per job
        let mergedArr = shipOData.map(itm => ({
            ...jobOData.find((item) => (item.jobId === itm.jobId) && item),
            items: [itm]
        }));
        // reduces the duplicate job Ids and adds to items: [] items that match on job id
        const arrayHashmap = mergedArr.reduce((obj, item) => {
            obj[item.jobId] ? obj[item.jobId].items.push(...item.items) : (obj[item.jobId] = { ...item });
            return obj;
        }, {});
        // grabs the values per job Id removes 89766: {} and puts into array [{},{}]
        const mergedArray = Object.values(arrayHashmap);
        // send off final dataset structure[{items: [{},{},{}]},{items: [{},{},{}]},{items: [{},{},{}]}]
        setAllData(mergedArray);
        console.log("All data processed successfully.");
        console.log(mergedArray);
        return { success: true, message: "All data processed successfully from JMS"};
    } catch (error) {
        console.error("Error processing data:", error);
        return { success: false, message: "Failed on getting shpiment data from JMS. Error: " + error.message };
    }
}