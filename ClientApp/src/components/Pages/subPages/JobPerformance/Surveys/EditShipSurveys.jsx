import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, styled, Divider, Typography, 
        Checkbox } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AlertMessage from "../../../../UI-components/MInfoAlertMessage";
// API calls
import { checkforSurvey } from '../../../../../services/SurveyAPIs/surveyTableApi';
// survey components
import { updateData } from './Data/UpdateData';
import { MissingSurveys } from './Components/MissingSurveys';
import CommentsDialog from "./Components/CommentsDialog";
import SurveyHeader from './Components/SurveyHeader';

const EditSurveys = () => {

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

    // Get call to show data in UI and then edit either or both surveys
    const [searchJobId, setSearchJobId] = useState("");
    const [searchShipId, setSearchShipId] = useState("");
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

    const handleChangeShipID = (event) => {
        setSearchShipId(event.target.value);
        const target = event.target;
        let error = '';
        if (isNaN(target.value)) {
          error = `field can only be number`
        }
        setErrorInputs(error);
    };

    const SearchBtn = async () => {
        if(!searchJobId || !searchShipId) {
            let error = `field cannot be empty`;
            setErrorInputs(error);
        }
         // GET check for row in DB if null POST if row PUT
         (async () => {
            try{
            const json = await checkforSurvey(searchJobId, searchShipId);
            if(json.length == 0) {
                // sets the MissingSurvey component to true in UI for POST new row in DB
                setGetRowData('newSurvey');
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
                var Arr = [];
                var Obj = { 
                    id: json[0].id,
                    projMgr: json[0].projMgr, 
                    jobId: json[0].jobId,
                    jobDesc: json[0].jobDesc,
                    itemDesc: json[0].itemDesc,
                    prodId: json[0].prodId,
                    itemValue: json[0].itemValue,
                    shShipid: json[0].shShipid,
                    shQuantity: json[0].shQuantity,
                    shQuid: json[0].shQuid,
                    shipValueTotal: json[0].shipValueTotal,
                    shShipdate: json[0].shShipdate,
                    shippedOnTime: json[0].shippedOnTime == 1 ? 'On Time' : json[0].shippedOnTime == 2 ? 'Slightly Late' : 
                        json[0].shippedOnTime == 3 ? 'Very Late' : 0,
                    surveyCompleted: json[0].surveyCompleted,
                    onTimeComments: json[0].onTimeComments
                }
                Arr.push(Obj)
                setGetRowData(Arr);
            }
            } catch (error) {
                console.log("error", error);
                setStatusBase({ msg: "New Survey NOT saved. Error: " + error, open: true });
                setTimeout(() => {
                    setStatusBase({ msg: '', open: false });
                }, 10000);
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
                if(newCheck[1] == 'ship') {
                    checkBoxes.push({
                        shippedOnTime: newCheck[3] == 'one' ? 1 : newCheck[3] == 'two' ? 2 : newCheck[3] == 'three' ? 3 : 0,
                    })
                }
            });
            // pass new shippedOnTime
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
        setSearchShipId("");
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
                    Welcome to Edit On Time Surveys
                </Typography>
                <SurveyHeader/>
                <div className='pt-3'>
                    {errorInputs && <span>{errorInputs}</span> }
                    <TextField
                        required
                        id="standard-required-job"
                        label="Job Id"
                        value={searchJobId}
                        onChange={handleChangeJobID}
                        variant="standard"
                    />
                    <TextField
                        required
                        id="standard-required-ship"
                        label="Ship Id"
                        value={searchShipId}
                        onChange={handleChangeShipID}
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
                            <div style={cell}>Shipment Id</div>
                            <div style={cell}>Shipment Quanity</div>
                            <div style={cell}>Total Value of Shipment</div>
                            <div style={cell}>Ship Date</div>
                            <div style={cell}>Ship Timing</div>
                            <div style={cell}>Ship Survey Date</div>
                        </div>
                        <div key={"row"} style={row}>
                            <div style={cell}>{item.projMgr}</div>
                            <div style={cell}>{item.shShipid}</div>
                            <div style={cell}>{item.shQuantity}</div>
                            <div style={cell}>{item.shipValueTotal}</div>
                            <div style={cell}>{new Date(item.shShipdate).toLocaleDateString("en-US")}</div>
                            <div style={cell}>{item.shippedOnTime == 0 ? 'Add new On Time': item.shippedOnTime}</div>
                            <div style={cell}>{item.surveyCompleted ? new Date(item.surveyCompleted).toLocaleDateString("en-US") : "00/00/00"}</div>
                        </div>
                        <div key={"header-comments"} style={row}>
                            <div style={cellC}>Shipment Survey Comments</div>
                        </div>
                        <div key={"row-comments"} style={row}>
                            <div style={cellC}>{comments  ? comments  : 
                                                item.onTimeComments ? item.onTimeComments : 'no comments'}
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
                        <Typography sx={{ width: '100%', color: 'text.primary', pb: '10px'}}>
                            Shipment Timing
                        </Typography>
                        <div key={"edit-ship-header"} style={row}>
                            <div style={cell}>On Time</div>
                            <div style={cell}>Slightly Late</div>
                            <div style={cell}>Very Late</div>
                        </div>
                        <div key={"edit-ship-row"} style={row}>
                            <div style={cell}>
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                    value={index + '-' + 'ship' + '-' + item.jobId + '-one'}
                                    selected={checkOneBox.includes(index + '-' + 'ship' + '-' + item.jobId + '-one') ? true : false}
                                    onClick = {toggleBtn(index + '-' + 'ship' + '-' + item.jobId + '-one')} 
                                    >
                                </Checkbox>
                            </div>
                            <div style={cell}>
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                    value={index + '-' + 'ship' + '-' + item.jobId + '-two'}
                                    selected={checkOneBox.includes(index + '-' + 'ship' + '-' + item.jobId + '-two') ? true : false}
                                    onClick = {toggleBtn(index + '-' + 'ship' + '-' + item.jobId + '-two')} 
                                    >
                                </Checkbox>
                            </div>
                            <div style={cell}>
                                <Checkbox
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                    value={index + '-' + 'ship' + '-' + item.jobId + '-three'}
                                    selected={checkOneBox.includes(index + '-' + 'ship' + '-' + item.jobId + '-three') ? true : false}
                                    onClick = {toggleBtn(index + '-' + 'ship' + '-' + item.jobId + '-three')} 
                                    >
                                </Checkbox>
                            </div>
                        </div>
                    </div>
                </Root>
            ))
            :
            <MissingSurveys JobId={searchJobId} ShipId={searchShipId} 
                clearInputStates={clearInputStates} setStatusBase={setStatusBase}
            />
            }
            <CommentsDialog open={open} handleSubmit={handleSubmit} handleClose={handleClose} 
                comments={comments} handleCommentChange={handleCommentChange}/>
        </>
    );
}

export default EditSurveys;