const BASE_URL = process.env.REACT_APP_HDC_APIURL;

// GET fetches shipments
export async function getSheetMaterialInventory() {
    try {
        const response = await fetch(`${BASE_URL}/SMI/GetSheetMaterialInventory`);
        if (!response || !response.ok) {
        throw new Error('GetSheetMaterialInventory -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
}

// GET fetches on smiId
export async function getSheet(sheetId) {
    try {
        const response = await fetch(`${BASE_URL}/SMI/GetSheet/${sheetId}`);
        if (!response || !response.ok) {
        throw new Error('GetSheet -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching sheet id:', error);
        throw error;
    }
}

// PATCH edited data into SMILocations
export async function patchQoh(smiId, totalOh) {
    try {
        const response = await fetch(`${BASE_URL}/SMI/PatchQOH/${smiId}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "op":"replace",
                "path":"/smiQoh",
                "value": Math.floor(totalOh)
            })
        });
        if (!response.ok) {
            throw new Error('patchQoh -> Network response was not ok');
        } else {
            return response.ok;
        }
    } catch (error) {
      console.error('Error patching Qoh to JMS Server:', error);
      throw error;
    }
}