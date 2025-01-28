import React from 'react';
import Typography from '@mui/material/Typography';

const SurveyHeader = () => {
    return (
        <>
            <Typography sx={{ width: '100%', color: 'text.secondary' }}>
                Project Managers, please share your insights from the <strong>CUSTOMER'S PERSPECTIVE </strong> 
                to improve production outcomes and enhance customer satisfaction. 
            </Typography>
            <Typography sx={{ width: '100%', color: 'text.secondary' }}>
                When filling in surveys be sure to enter comments <strong>before</strong> clicking checkboxes. 
                Once the checkbox is clicked the row will be saved and will drop off. 
            </Typography>
        </>
    );
};

export default SurveyHeader;