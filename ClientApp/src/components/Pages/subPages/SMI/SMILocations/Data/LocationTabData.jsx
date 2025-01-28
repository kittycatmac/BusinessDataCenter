// API calls
import { getLocationTabData } 
    from '../../../../../../services/InventoryAPIs/smiLocationsTableApi';

// populates the each tab with data
export const populateLocationTabData = async ({smiLocation, tabName, setRows}) => {
    try {
        const json = await getLocationTabData(smiLocation, tabName);
        setRows(json);
    } catch (error) {
        console.log("error", error);
    }
};