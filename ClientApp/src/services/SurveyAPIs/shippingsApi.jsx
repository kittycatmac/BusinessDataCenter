const BASE_URL = process.env.REACT_APP_HDC_APIURL; 

// GET fetches shipments
export async function getShippings() {
    try {
        const response = await fetch(`${BASE_URL}/Performance/GetShippings`);
        if (!response.ok) {
        throw new Error('GetShippings -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
}

export async function getShippingsForJobs() {
    try {
        const response = await fetch(`${BASE_URL}/Performance/GetShippingsForJobs`);
        if (!response.ok) {
        throw new Error('GetShippingsForJobs -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipments for jobs:', error);
        throw error;
    }
}


export async function searchShippings(jobId, shipId) {
    if(!shipId) {
        try {
            const response = await fetch(`${BASE_URL}/Performance/GetShippingsJobs/${jobId}`);
            if (!response.ok) {
            throw new Error('GetShippingsJobs -> Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching shipments:', error);
            throw error;
        }
    } else {
        try {
            const response = await fetch(`${BASE_URL}/Performance/SearchShippings/${jobId}/${shipId}`);
            if (!response.ok) {
            throw new Error('SearchShippings -> Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching shipments:', error);
            throw error;
        }
    }
    // try {
    //     const response = await fetch(`${BASE_URL}/Performance/SearchShippings/${jobId}/${shipId}`);
    //     if (!response.ok) {
    //     throw new Error('SearchShippings -> Network response was not ok');
    //     }
    //     const data = await response.json();
    //     return data;
    // } catch (error) {
    //     console.error('Error fetching shipments:', error);
    //     throw error;
    // }
}

// GET fetches relational data for each shipment
export async function getProdIdDesc(jobId, shQuid) {
    try {
        const response = await fetch(`${BASE_URL}/Performance/GetProdIdDesc/${jobId}/${shQuid}`);
        if (!response.ok) {
        throw new Error('GetProdIdDesc -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching relational data for shipments:', error);
        throw error;
    }
}

export async function getCompData(jobId, formNum, verNum) {
    try {
        const response = await fetch(`${BASE_URL}/Performance/GetCompData/${jobId}/${formNum}/${verNum}`);
        if (!response.ok) {
        throw new Error('GetCompData -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching relational data for shipments:', error);
        throw error;
    }
}