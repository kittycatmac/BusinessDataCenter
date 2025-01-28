const BASE_URL = process.env.REACT_APP_HDC_APIURL; 

// GET fetches all inventory in HDC table SMILocations
export async function getSMILocations() {
    try {
        const response = await fetch(`${BASE_URL}/api/Smilocations`);
        if (!response || !response.ok) {
        throw new Error('getSMILocations -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching SMILocations:', error);
        throw error;
    }
}

// GET fetches all inventory data based on location
export async function getLocationData(smiLocation) {
    try {
        const response = await fetch(`${BASE_URL}/api/Smilocations/location/${smiLocation}`);
        if (!response || !response.ok) {
        throw new Error('getLocationData -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching LocationData:', error);
        throw error;
    }
}

// GET fetches all inventory data based on location and tab/paper container type
export async function getLocationTabData(smiLocation, tabName) {
    try {
        const response = await fetch(`${BASE_URL}/api/Smilocations/tab/${smiLocation}/${tabName}`);
        if (!response || !response.ok) {
        throw new Error('getLocationTabData -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching LocationTabData:', error);
        throw error;
    }
}

// PUT edited data into SMILocations
export async function putEdit(id, putData) {
    try {
        const response = await fetch(`${BASE_URL}/api/Smilocations/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(putData),
        });
        if (!response.ok) {
            throw new Error('putEdit -> Network response was not ok');
        } else {
            return response.ok;
        }
    } catch (error) {
      console.error('Error updating data to HDC DB:', error);
      throw error;
    }
}

// POST edited data into SMILocations
export async function postRow(postData) {
    try {
        const response = await fetch(`${BASE_URL}/api/Smilocations`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) {
            throw new Error('postRow -> Network response was not ok');
        } else {
            return response.ok;
        }
    } catch (error) {
      console.error('Error posting row of data to HDC DB:', error);
      throw error;
    }
}

// DELETE edited data into SMILocations
export async function deleteRow(deleteId) {
    try {
        const response = await fetch(`${BASE_URL}/api/Smilocations/${deleteId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('deleteRow -> Network response was not ok');
        } else {
            return response.ok;
        }
    } catch (error) {
      console.error('Error deleteing row of data in HDC DB:', error);
      throw error;
    }
}

// POST clear all data in SMILocations Table
export async function clearData() {
    try {
        const response = await fetch(`${BASE_URL}/api/Smilocations/ClearSmilocationTotals`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('clearData -> Network response was not ok');
        } else {
            return response.ok;
        }
    } catch (error) {
      console.error('Error clearing all data in HDC DB Table:', error);
      throw error;
    }
}