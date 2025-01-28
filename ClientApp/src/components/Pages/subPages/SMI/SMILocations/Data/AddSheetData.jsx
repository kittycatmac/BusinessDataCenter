// API calls getSheet
import { getSheet } 
    from '../../../../../../services/InventoryAPIs/smiApi';

export const AddSheetData = async (sheetId, setSMI, setJMSDataLoading) => {
    if(sheetId.Id) {
        try {
            const json = await getSheet(sheetId.Id);
            setSMI(json); 
            setJMSDataLoading(false);
        } catch (error) {
            console.log("error", error);
        }
    }
};