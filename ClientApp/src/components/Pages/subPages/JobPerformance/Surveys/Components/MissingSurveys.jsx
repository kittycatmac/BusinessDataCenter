import React, { useState, useEffect, useCallback } from 'react';
import { Button, styled, Divider, Typography, Checkbox } from '@mui/material';
// survey components
import CommentsDialog from "./CommentsDialog";
// POST data functions
import { postNewRow } from '../Data/PostData';
// GET data functions 
import { getShipJobData } from '../Data/getShipJobData';

export const MissingSurveys = ({ JobId, ShipId, clearInputStates, setStatusBase }) => {

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

    // main holder of collected shipping -> job and product data
    const [allData, setAllData] = useState();
    // these are the datasets with all shipments getting new quality and on time changes
    const [dataArrayOT, setDataArrayOT] = useState([]);
    const [dataArrayQ, setDataArrayQ] = useState([]);
    // toggles the html returns for on time and quality surveys
    const [uiOT, setUIOT] = useState(false);
    const [uiQ, setUIQ] = useState(false);
    // tracks the check box toggle state
    const [check, setCheck] = useState([]);
    const [checkOneBox, setCheckOneBox] = useState([]);
    //refreshes DOM for checkOneBox to update the toggle selected
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    // comments dialog form
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState("");
    const [sendComm, setSendComm] = useState("");

    useEffect(() => {
        setUIQ(ShipId == 0);
        setUIOT(!ShipId == 0);
        populateShipJob(JobId, ShipId)
    }, []);

    const populateShipJob = async (searchJobId, searchShipId) => {
        // runs the functions that get the data from JMS and creates allData list for UI
        const promises = [
            getShipJobData(searchJobId, searchShipId, setAllData),
        ];
        const responses = await Promise.all(promises);
        for (const response of responses) {
            console.log(response);
            setSpinner(false);
            setStatusBase({ msg: response.message, open: true });
            setTimeout(() => {
                setStatusBase({ msg: '', open: false });
            }, 10000);
        }
    };

    useEffect(() => {
        if(uiQ) {
            setDataArrayQ(allData)
        } else if(uiOT) {
            setDataArrayOT(allData)
        } else {
            setDataArrayOT([]);
            setDataArrayQ([]);
        }
    }, [uiQ, uiOT, allData]);

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
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        if(checkOneBox.length > 0) {
            checkOneBox.forEach(function(item) {
                const newCheck = item.split('-');
                if(newCheck[1] == 'ship') {
                    dataArrayOT.forEach(function(d) {
                        d.items.forEach(function(i) {
                            var Arr = [];
                            Arr.push(i);
                            var jobObj = {
                                projMgr: d.projMgr, jobDesc: d.jobDesc, 
                                shippedOnTime: newCheck[3] == 'one' ? 1 : newCheck[3] == 'two' ? 2 : newCheck[3] == 'three' ? 3 : 0,
                                surveyCompleted: new Date(Date.now() - tzoffset).toISOString().slice(0, 19),
                                OnTimeComments: sendComm
                            }
                            Arr[0] = {...Arr[0], ...jobObj}
                            console.log(Arr);
                            // POST each shipment with new quality
                            handlePostData(Arr);
                        });
                    });
                }
                if(newCheck[1] == 'job') {
                    dataArrayQ.forEach(function(d) {
                        d.items.forEach(function(i) {
                            var Arr = [];
                            Arr.push(i);
                            var jobObj = {
                                projMgr: d.projMgr, jobDesc: d.jobDesc, 
                                shippedProdQuality: newCheck[3] == 'one' ? 1 : newCheck[3] == 'two' ? 2 : newCheck[3] == 'three' ? 3 : newCheck[3] == 'four' ? 4 : 0,
                                jobSurveyCompleted: new Date(Date.now() - tzoffset).toISOString().slice(0, 19),
                                QualityComments: sendComm
                            }
                            Arr[0] = {...Arr[0], ...jobObj}
                            console.log(Arr);
                            // POST each shipment with new quality
                            handlePostData(Arr);
                        });
                    });
                }
            });
        }
    }, [checkOneBox, check]);

    const clearDataStates = () => {
        //resets the data to empty
        setAllData([]);
        setDataArrayQ([]);
        setDataArrayOT([]);
        // resets boolean checks
        setUIOT(false);
        setUIQ(false);
        // clears out comments
        setComments('');
    };

    const handlePostData = async (data) => { 
        const promises = data.map(async (d) => {
            try {
                const response = await postNewRow(d);
                return response;
            } catch (error) {
                console.error("Error posting survey:", error);
                return { success: false, message: "New Survey NOT saved. Error: " + error.message };
            }
        });
        const responses = await Promise.all(promises);
        for (const response of responses) {
            console.log(response);
            clearInputStates();
            clearDataStates();
            setStatusBase({ msg: response.message, open: true });
            setTimeout(() => {
                setStatusBase({ msg: '', open: false });
            }, 10000);
        }
    };
    
    return (
        <>
            {uiQ ? (
                <>
                    {dataArrayQ?.map((item, index) => (
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
                                </div>
                                <div key={"row"} style={row}>
                                    <div style={cell}>{item.projMgr}</div>
                                </div>
                                <Typography sx={{ width: '100%', color: 'text.primary' }} className="pb-3">
                                    Job Quality
                                </Typography> 
                                <Button variant="outlined" onClick={handleClickOpen}>
                                    Add Job Quality Comments
                                </Button>
                                {comments ? 
                                    <div key={"row-job-comments"} style={row} className="pt-4">
                                        <div style={cellC}>
                                            {comments}
                                        </div>
                                    </div>
                                    : <></>
                                }
                                <div key={"edit-job-header"} style={row} className="pt-4">
                                    <div style={cell}>Excellent</div>
                                    <div style={cell}>As Expected</div>
                                    <div style={cell}>Minor Problems</div>
                                    <div style={cell}>Significant Problems</div>
                                </div>
                                <div key={"edit-job-row"} style={row}>
                                    <div style={cell}>
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                            id={index + '-' + item.jobId + '-one'}
                                            value={index + '-' + 'job' + '-' + item.jobId + '-one'}
                                            checked={checkOneBox.includes(index + '-' + 'job' + '-' + item.jobId + '-one') ? true : false}
                                            onClick = {toggleBtn(index + '-' + 'job' + '-' + item.jobId + '-one')} 
                                            >
                                        </Checkbox>
                                    </div>
                                    <div style={cell}>
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                            id={index + '-' + item.jobId + '-two'}
                                            value={index + '-' + 'job' + '-' + item.jobId + '-two'}
                                            checked={checkOneBox.includes(index + '-' + 'job' + '-' + item.jobId + '-two') ? true : false}
                                            onClick = {toggleBtn(index + '-' + 'job' + '-' + item.jobId + '-two')}
                                            >
                                        </Checkbox>
                                    </div>
                                    <div style={cell}>
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                            id={index + '-' + item.jobId + '-three'}
                                            value={index + '-' + 'job' + '-' + item.jobId + '-three'}
                                            checked={checkOneBox.includes(index + '-' + 'job' + '-' + item.jobId + '-three') ? true : false}
                                            onClick = {toggleBtn(index + '-' + 'job' + '-' + item.jobId + '-three')}
                                            >
                                        </Checkbox>
                                    </div>
                                    <div style={cell}>
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                            id={index + '-' + item.jobId + '-four'}
                                            value={index + '-' + 'job' + '-' + item.jobId + '-four'}
                                            checked={checkOneBox.includes(index + '-' + 'job' + '-' + item.jobId + '-four') ? true : false}
                                            onClick = {toggleBtn(index + '-' + 'job' + '-' + item.jobId + '-four')}
                                            >
                                        </Checkbox>
                                    </div>
                                </div>
                            </div>
                        </Root>
                    ))}
                </>
                ) : uiOT ? (
                <>
                    {dataArrayOT?.map((item, index) => (
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
                                </div>
                                <div key={"row"} style={row}>
                                    <div style={cell}>{item.projMgr}</div>
                                    <div style={cell}>{item.items[0].Shipid}</div>
                                    <div style={cell}>{item.items[0].Quantity}</div>
                                    <div style={cell}>{item.items[0].shipmentValue}</div>
                                    <div style={cell}>{new Date(item.items[0].Shipdate).toLocaleDateString("en-US")}</div>
                                </div>
                                <Typography sx={{ width: '100%', color: 'text.primary', pb: '10px'}} className="pb-3">
                                    Shipment Timing
                                </Typography>
                                <Button variant="outlined" onClick={handleClickOpen}>
                                    Add Shipment Timing Comments
                                </Button>
                                {comments ? 
                                    <div key={"row-ship-comments"} style={row} className="pt-4">
                                        <div style={cellC}>
                                            {comments}
                                        </div>
                                    </div>
                                    : <></>
                                }
                                <div key={"edit-ship-header"} style={row} className="pt-4">
                                    <div style={cell}>On Time</div>
                                    <div style={cell}>Slightly Late</div>
                                    <div style={cell}>Very Late</div>
                                </div>
                                <div key={"edit-ship-row"} style={row}>
                                    <div style={cell}>
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                            id={index + '-' + item.jobId + '-one'}
                                            value={index + '-' + 'ship' + '-' + item.jobId + '-one'}
                                            checked={checkOneBox.includes(index + '-' + 'ship' + '-' + item.jobId + '-one') ? true : false}
                                            onClick = {toggleBtn(index + '-' + 'ship' + '-' + item.jobId + '-one')} 
                                            >
                                        </Checkbox>
                                    </div>
                                    <div style={cell}>
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                            id={index + '-' + item.jobId + '-two'}
                                            value={index + '-' + 'ship' + '-' + item.jobId + '-two'}
                                            checked={checkOneBox.includes(index + '-' + 'ship' + '-' + item.jobId + '-two') ? true : false}
                                            onClick = {toggleBtn(index + '-' + 'ship' + '-' + item.jobId + '-two')} 
                                            >
                                        </Checkbox>
                                    </div>
                                    <div style={cell}>
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                            id={index + '-' + item.jobId + '-three'}
                                            value={index + '-' + 'ship' + '-' + item.jobId + '-three'}
                                            checked={checkOneBox.includes(index + '-' + 'ship' + '-' + item.jobId + '-three') ? true : false}
                                            onClick = {toggleBtn(index + '-' + 'ship' + '-' + item.jobId + '-three')} 
                                            >
                                        </Checkbox>
                                    </div>
                                </div>
                            </div>
                        </Root>
                    ))}
                </> )
                : (
                    <></>
                )
            }
            <CommentsDialog open={open} handleSubmit={handleSubmit} handleClose={handleClose} 
                comments={comments} handleCommentChange={handleCommentChange}/>
        </>
    );

};