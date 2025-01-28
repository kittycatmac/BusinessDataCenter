import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, styled, Divider, Typography, Grid } from '@mui/material';
// global UI components
import CircularProgress from "../../../../UI-components/MCircularProgress";
import AlertMessage from "../../../../UI-components/MInfoAlertMessage";
// API calls
import { checkforSurvey } from '../../../../../services/SurveyAPIs/surveyTableApi';
import { getShipJobData } from './Data/getShipJobData';

const SearchIds = () => {

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        '& > :not(style) + :not(style)': {
          marginTop: theme.spacing(2),
        },
    }));

    const table = {
        padding: "5px 5px",
        display: "block",
    }

    const row = {
        padding: "0px 5px 20px",
        display: "block",
    }

    const cell = {
        borderBottom: "1px solid #d3d3d3",
        padding: "5px 5px 15px",
        display: "inline-block",
        width: "15%"
    }

    const cellM = {
        borderBottom: "1px solid #d3d3d3",
        padding: "5px 5px 15px",
        display: "inline-block",
        width: "15%",
        color: "#AA4A44"
    }

    // search input
    const [searchJobId, setSearchJobId] = useState("");
    // main data holder
    const [allData, setAllData] = useState();
    // Alert message
    const [status, setStatusBase] = useState({ msg: '', open: false });
    // Error handling for inputs
    const [errorInputs, setErrorInputs] = useState("");
    // Spinner
    const [progress, setProgress] = useState(10);
    const [spinner, setSpinner] = useState(false);

    // timer for loading
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);
    
    const handleChangeJobID = (event) => {
        setSearchJobId(event.target.value);
        const target = event.target;
        let error = '';
        if (isNaN(target.value)) {
          error = `field can only be number`
        }
        setErrorInputs(error);
    };
    
    const SearchBtn = async () => {
        if(!searchJobId) {
            let error = `field cannot be empty`;
            setErrorInputs(error);
        }
        setSpinner(true);
        // runs the functions that get the data from JMS and creates allData list for UI
        try {
            const response = await getShipJobData(searchJobId, 0, setAllData);
            console.log("JMS Data Response:", response);
            setSpinner(false);
            setSearchJobId("");
        } catch (error) {
            console.error("Error:", error);
            setSpinner(false);
            setSearchJobId("");
            setStatusBase({ msg: response.message, open: true });
    
            setTimeout(() => {
                setStatusBase({ msg: '', open: false });
            }, 10000);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                let boolean = false;
                if(allData) {
                    for (const item of allData[0].items) {    
                        const surveyResponse = await checkforSurvey(item.jobId, item.Shipid);
                        console.log("HDC DB Survey Response:", surveyResponse);
                        if(surveyResponse.length > 0) {
                            if(surveyResponse[0].shippedOnTime) {
                                item.shipSurveyDone = true;
                            } else {
                                item.shipSurveyDone = false;
                            }
                            if(surveyResponse[0].shippedProdQuality) {
                                boolean = true
                            } else {
                                boolean = false;
                            }
                        } else {
                            item.shipSurveyDone = false;
                            boolean = false;
                        }
                    }
                    for (const item of allData) { 
                        if(boolean) {
                            item.jobSurveyDone = true;
                        } else {
                            item.jobSurveyDone = false;
                        }
                    }
                }
        } catch (error) {
            console.log("error", error);
        }
        })();
    }, [allData]);

    return(
        <>
            <Box
                component="form"
                sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Typography sx={{ width: '100%', color: 'text.primary' }} variant={'h5'}>
                    Welcome to Search Shipping data
                </Typography>
                <Typography sx={{ width: '100%', color: 'text.secondary' }}>
                    Enter the job id and receive a list of the shipment ids from JMS.
                </Typography>
                <div className='pt-3'>
                    {errorInputs && <span>{errorInputs}</span> }
                    <TextField
                        required
                        id="standard-job"
                        label="Job Id"
                        value={searchJobId}
                        onChange={handleChangeJobID}
                        variant="standard"
                    />
                    <Button variant="outlined" className='mt-3' onClick={SearchBtn}>
                        Search
                    </Button>
                </div>
            </Box>
            {status.open && <AlertMessage key={status.key} message={status.msg} />}
            {allData?.map((item, index) => (
                <Root className='pt-4 pb-4' key={index} 
                    style={{padding: '2px'}}>
                    <Divider textAlign="left">
                        <Typography sx={{ width: '33%', color: 'text.primary' }}>
                            Job {item.jobId}
                        </Typography>
                        <Typography sx={{ width: '33%', color: 'text.secondary' }}>
                            {item.jobDesc}
                        </Typography>
                    </Divider>
                    <div key={"job-table"} style={table}>
                        <div key={"header"} style={row}>
                            <div style={cell}>Project Manager</div>
                            <div style={cell}>Quality Completed</div>
                        </div>
                        <div key={"row"} style={row}>
                            <div style={cell}>{item.projMgr}</div>
                            {item.jobSurveyDone ? <div style={cell}>Done</div> : <div style={cellM}>Missing</div>}
                        </div>
                        <div key={"item-table"} style={table}>
                            <div key={"items-header"} style={row}>
                                <div style={cell}>Description</div>
                                <div style={cell}>Ship Id</div>
                                <div style={cell}>Quanity</div>
                                <div style={cell}>Shipment Value</div>
                                <div style={cell}>Ship Date</div>
                                <div style={cell}>OnTime Completed</div>
                            </div>
                            {item.items.map((items, ind) => (
                                <div key={ind} style={row}>
                                    <div style={cell}>{items.itemDesc}</div>
                                    <div style={cell}>{items.Shipid}</div>
                                    <div style={cell}>{items.Quantity}</div> 
                                    <div style={cell}>{items.shipmentValue}</div>
                                    <div style={cell}>{new Date(items.Shipdate).toLocaleDateString("en-US")}</div>
                                    {items.shipSurveyDone ? <div style={cell}>Done</div> : <div style={cellM}>Missing</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </Root>
            ))}
            { spinner &&
            <>
                <div className='mb-5'></div>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    className="mb-3"
                    >
                    <CircularProgress value={progress} />
                </Grid>
            </>
            }
        </>
    );
}

export default SearchIds;