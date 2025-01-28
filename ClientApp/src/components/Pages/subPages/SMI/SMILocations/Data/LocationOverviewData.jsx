 
// API calls
import { getLocationData } 
    from '../../../../../../services/InventoryAPIs/smiLocationsTableApi';

// populates the overview tab data
export const populateLocationDataOverview = async ({smiLocation, setRows}) => {
    try {
        const json = await getLocationData(smiLocation);
        setRows(json);
    } catch (error) {
        console.log("error", error);
    }
};