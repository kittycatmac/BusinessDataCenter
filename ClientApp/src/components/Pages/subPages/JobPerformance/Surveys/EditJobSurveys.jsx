import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, styled, Divider, Typography, 
    Checkbox } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
// global UI components
import AlertMessage from "../../../../UI-components/MInfoAlertMessage";
// API calls
import { checkforJobSurvey } from '../../../../../services/SurveyAPIs/surveyTableApi';
// survey components
import { updateData } from './Data/UpdateData';
import { MissingSurveys } from './Components/MissingSurveys';
import CommentsDialog from "./Components/CommentsDialog";
import SurveyHeader from './Components/SurveyHeader';

const EditJobSurveys = () => {

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
        width: "10%"
    }

    const cellC = {
        borderBottom: "1px solid #d3d3d3",
        padding: "5px 5px 15px",
        display: "inline-block",
        width: "50%"
    }

    // search input
    const [searchJobId, setSearchJobId] = useState("");
    const [shipId, setShipId] = useState(0);
    // this is the data to show in UI
    const [getRowData, setGetRowData] = useState([]);
    // this is the dataset with all shipments getting new quality changes
    const [editData, setEditData] = useState([]);
    // tracks the check box toggle state
    const [check, setCheck] = useState([]);
    const [checkOneBox, setCheckOneBox] = useState([]);
    //refreshes DOM for checkOneBox to update the toggle selected
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    // Alert message
    const [status, setStatusBase] = useState({ msg: '', open: false });
    // Error handling for inputs
    const [errorInputs, setErrorInputs] = useState("");
    // comments dialog form
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState("");
    const [sendComm, setSendComm] = useState("");

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
         // GET check for row in DB if null POST if row PUT
         (async () => {
            try{
            const json = await checkforJobSurvey(searchJobId);
            // missingSurvey component POST from JMS data to HDC DB
            if(json.length == 0) {
                // sets the MissingSurvey component to true in UI
                setGetRowData('newSurvey');
            // PUTS update from DB table
            } else if (json.length > 0) {
                // below is the data to add edits and send to PUT
                var objHolder = [];
                json.forEach((j) => {
                    objHolder.push({ 
                        id: j.id,
                        jobDesc: j.jobDesc,
                        jobId: j.jobId,
                        jobSurveyCompleted: j.jobSurveyCompleted,
                        itemDesc: j.itemDesc,
                        prodId: j.prodId,
                        itemValue: j.itemValue,
                        projMgr: j.projMgr,
                        qualityComments: j.qualityComments,
                        shQuantity: j.shQuantity,
                        shQuid: j.shQuid,
                        shShipdate: j.shShipdate,
                        shShipid: j.shShipid,
                        shipValueTotal: j.shipValueTotal,
                        shippedOnTime: j.shippedOnTime,
                        shippedProdQuality: j.shippedProdQuality,
                        surveyCompleted: j.surveyCompleted,
                        onTimeComments: j.onTimeComments,
                    });
                });
                setEditData(objHolder);
                // before is the data to show in the UI
                var Arr = [];
                var Obj = { 
                    id: json[0].id,
                    projMgr: json[0].projMgr, 
                    jobId: json[0].jobId,
                    jobDesc: json[0].jobDesc,
                    shippedProdQuality: json[0].shippedProdQuality == 1 ? 'Excellent' : json[0].shippedProdQuality == 2 ? 'As Expected' : 
                    json[0].shippedProdQuality == 3 ? 'Minor Problems' : json[0].shippedProdQuality == 4 ? 'Significant Problems' : 0,
                    jobSurveyCompleted: json[0].jobSurveyCompleted,
                    qualityComments: json[0].qualityComments
                }
                Arr.push(Obj);
                setGetRowData(Arr);
            }
            } catch (error) {
                setStatusBase({ msg: "Check for Job in DB Error: " + error, open: true });
                setTimeout(() => {
                    setStatusBase({ msg: '', open: false });
                }, 10000);
                console.log("error", error);
            }
        })();
    }

    
    // comments dialog form
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCommentChange = (event) => {
        setComments(event.target.value);
    }
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        setSendComm(comments);
        setOpen(false);
    }

    const toggleBtn = key => () => {
        setCheckOneBox(oldArr => [...oldArr, key]);
        setCheck(key);
    }

    // Toggles between each checkbox per row
    useEffect(() => {
        checkOneBox.forEach(function(item, index) {
            const row1 = check.split('-');
            const row2 = item.split('-');
            if(row1[1] === row2[1]) {
                if(!(row1[3] === row2[3])) {
                    checkOneBox.splice(index, 1)
                }   
            }
        });
        forceUpdate();

        var checkBoxes = [];
        if(checkOneBox.length > 0) {
            checkOneBox.forEach(function(item, index) {
                const newCheck = item.split('-');
                if(newCheck[1] == 'job') {
                    checkBoxes.push({
                        shippedProdQuality: newCheck[3] == 'one' ? 1 : newCheck[3] == 'two' ? 2 : newCheck[3] == 'three' ? 3 : newCheck[3] == 'four' ? 4 : 0,
                    })
                }
            });
            // pass new shippedProdQuality
            if(checkBoxes.length > 0) {
                handlePutData(checkBoxes);
            }
        }
    }, [checkOneBox, check]);

    const clearInputStates = () => {
        //resets the data to empty
        setGetRowData([]);
        setEditData([]);
        //resets the input fields to empty
        setSearchJobId("");
        // resets CheckOneBox
        setCheckOneBox([]);
        // resets comments
        setComments('');
        setSendComm('');
    };

    const handlePutData = async (checkBoxes) => { 
        const promises = editData.map(async (d) => {
            try {
                const response = await updateData(d, checkBoxes, sendComm);
                return response;
            } catch (error) {
                console.error("Error posting survey:", error);
                clearInputStates();
                return { success: false, message: "New Survey NOT saved. Error: " + error.message };
            }
        });
        const responses = await Promise.all(promises);
        for (const response of responses) {
            console.log(response);
            clearInputStates();
            setStatusBase({ msg: response.message, open: true });
            setTimeout(() => {
                setStatusBase({ msg: '', open: false });
            }, 10000);
        }
    };

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
                    Welcome to Edit Quality Surveys
                </Typography>
                <SurveyHeader/>
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
            {getRowData !== 'newSurvey' ? getRowData.map((item, index) => (
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
                    <div style={table}>
                        <div key={"header"} style={row}>
                            <div style={cell}>Project Manager</div>
                            <div style={cell}>Job Quality</div>
                            <div style={cell}>Job Survey Date</div>
                        </div>
                        <div key={"row"} style={row}>
                            <div style={cell}>{item.projMgr}</div>
                            <div style={cell}>{item.shippedProdQuality == 0 ? 'Add new Quality': item.shippedProdQuality}</div>
                            <div style={cell}>{item.jobSurveyCompleted ? new Date(item.jobSurveyCompleted).toLocaleDateString("en-US") : "00/00/00"}</div>
                        </div>
                        <div key={"header-comments"} style={row}>
                            <div style={cellC}>Job Survey Comments</div>
                        </div>
                        <div key={"row-comments"} style={row}>
                            <div style={cellC}>{comments  ? comments  : 
                                                item.qualityComments ? item.qualityComments : 'no comments'}
                                <span 
                                    onClick={() => handleClickOpen(index + '-' + item.jobId)}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'inline-block',
                                        padding: '5px 10px',
                                    }}>
                                    <ChatIcon />
                                </span>
                            </div>
                        </div>
                        <Typography sx={{ width: '100%', color: 'text.primary' }}>
                            Job Quality
                        </Typography> 
                        <div key={"edit-job-header"} style={row}>
                            <div style={cell}>Excellent</div>
                            <div style={cell}>As Expected</div>
                            <div style={cell}>Minor Problems</div>
                            <div style={cell}>Significant Problems</div>
                        </div>
                        <div key={"edit-job-row"} style={row}>
                            <div style={cell}>
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                    value={index + '-' + 'job' + '-' + item.jobId + '-one'}
                                    checked={checkOneBox.includes(index + '-' + 'job' + '-' + item.jobId + '-one') ? true : false}
                                    onClick = {toggleBtn(index + '-' + 'job' + '-' + item.jobId + '-one')} 
                                    >
                                </Checkbox>
                            </div>
                            <div style={cell}>
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                    value={index + '-' + 'job' + '-' + item.jobId + '-two'}
                                    checked={checkOneBox.includes(index + '-' + 'job' + '-' + item.jobId + '-two') ? true : false}
                                    onClick = {toggleBtn(index + '-' + 'job' + '-' + item.jobId + '-two')}
                                    >
                                </Checkbox>
                            </div>
                            <div style={cell}>
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                    value={index + '-' + 'job' + '-' + item.jobId + '-three'}
                                    checked={checkOneBox.includes(index + '-' + 'job' + '-' + item.jobId + '-three') ? true : false}
                                    onClick = {toggleBtn(index + '-' + 'job' + '-' + item.jobId + '-three')}
                                    >
                                </Checkbox>
                            </div>
                            <div style={cell}>
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                    value={index + '-' + 'job' + '-' + item.jobId + '-four'}
                                    checked={checkOneBox.includes(index + '-' + 'job' + '-' + item.jobId + '-four') ? true : false}
                                    onClick = {toggleBtn(index + '-' + 'job' + '-' + item.jobId + '-four')}
                                    >
                                </Checkbox>
                            </div>
                        </div>
                    </div>
                </Root>
            ))
            :
            <MissingSurveys JobId={searchJobId} ShipId={shipId} 
                clearInputStates={clearInputStates} setStatusBase={setStatusBase}
            />
            }
            <CommentsDialog open={open} handleSubmit={handleSubmit} handleClose={handleClose} 
                comments={comments} handleCommentChange={handleCommentChange}/>            
        </>
    );
}

export default EditJobSurveys;