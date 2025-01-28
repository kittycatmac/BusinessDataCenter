const BASE_URL = process.env.REACT_APP_HDC_APIURL; 

// GET fetches shimpment in HDC table PerformanceSurveys
export async function getSurveys() {
    try {
        const response = await fetch(`${BASE_URL}/api/PerformanceSurvey`);
        if (!response.ok) {
        throw new Error('GetSurveys -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
}

// this is past 30 days of data from today
export async function getChartSurveys() {
    try {
        const response = await fetch(`${BASE_URL}/api/PerformanceSurvey/GetChartSurveys`);
        if (!response.ok) {
        throw new Error('GetChartSurveys -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
}

// this is past 1 year of data from today
export async function getChartYearSurveys() {
    try {
        const response = await fetch(`${BASE_URL}/api/PerformanceSurvey/GetChartYearSurveys`);
        if (!response.ok) {
        throw new Error('getChartYearSurveys -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
}

export async function checkforSurvey(jobId, shipId) {
    try {
        const response = await fetch(`${BASE_URL}/api/PerformanceSurvey/CheckforSurvey/${jobId}/${shipId}`);
        if (!response.ok) {
        throw new Error('CheckforSurvey -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
}

export async function checkforJobSurvey(jobId) {
    try {
        const response = await fetch(`${BASE_URL}/api/PerformanceSurvey/CheckforJobSurvey/${jobId}`);
        if (!response.ok) {
            throw new Error('CheckforJobSurvey -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
    }
}

// POST saves new row in DB
export async function postSurvey(postData) {
    try {
        const response = await fetch(`${BASE_URL}/api/PerformanceSurvey`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) {
            throw new Error('POST Survey -> Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
      console.error('Error posting data to HDC DB:', error);
      throw error;
    }
}

// PUT updates row with any changes
export async function putSurvey(id, putData) {
    try {
        const response = await fetch(`${BASE_URL}/api/PerformanceSurvey/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(putData),
        });
        if (!response.ok) {
            throw new Error('PUT Survey -> Network response was not ok');
        } else {
            return response.ok;
        }
    } catch (error) {
      console.error('Error updating data to HDC DB:', error);
      throw error;
    }
}