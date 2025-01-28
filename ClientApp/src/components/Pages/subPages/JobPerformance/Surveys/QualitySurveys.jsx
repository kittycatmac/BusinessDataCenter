import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Divider, styled, Grid, Checkbox, Button } from '@mui/material';
// global UI components
import CircularProgress from "../../../../UI-components/MCircularProgress";
import AlertMessage from "../../../../UI-components/MInfoAlertMessage";
// survey components
import CommentsDialog from "./Components/CommentsDialog";
import SurveyHeader from './Components/SurveyHeader';
import ManagerSelect from './Components/ManagerSelect';
// API calls
import { getShippingsForJobs } from '../../../../../services/SurveyAPIs/shippingsApi';
import { checkforSurvey, checkforJobSurvey } from '../../../../../services/SurveyAPIs/surveyTableApi';
// GET Data functions
import { processAllData } from './Data/ProcessAllData';
// POST and PUT data functions
import { updateData } from './Data/UpdateData';
import { postNewRow } from './Data/PostData';


const QualitySurvey = () => {
    
    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        '& > :not(style) + :not(style)': {
          marginTop: theme.spacing(2),
        },
    }));

    const table = {
        margin: "0px 0px",
        padding: "5px 5px",
    }

    // tracks the check box toggle state
    const [check, setCheck] = useState([])
    const [checkOneBox, setCheckOneBox] = useState([]);
    // collects the project manager data and switches data form drop down
    const [projMngr, setProjMngr] = useState([]);
    const [projManager, setProjManager] = useState([]);
    const [projMngrSelect, setProjMngrSelect] = useState('All');
    const [projMgrData, setProjMgrData] = useState();
    // main holder of collected shipping -> job and product data
    const [allData, setAllData] = useState();
    const [sendSurveyData, setSendSurveyData] = useState();
    // Spinner
    const [progress, setProgress] = useState(10);
    // Hide row once completed
    const [hideRow, setHideRow] = useState([]);
    // Alert message
    const [status, setStatusBase] = useState({ msg: '', open: false });
    // comments dialog form
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState("");
    const [sendComm, setSendComm] = useState("");
    const [selectedRowIndex, setSelectedRowIndex] = useState("");

    useEffect(() => {
        (async () => {
        try {
            const json = await getShippingsForJobs();
            if(json.length == 0) {
                console.log('empty');
                setStatusBase({ msg: "There is not any data for the past two days seven days ago.", open: true });
            } else if (json.length > 0) {
                var objHolder = [];
                var projMgrHolder = [];
                json.forEach((j) => {
                    objHolder.push({ 
                        jobId: j.shJobnum,
                        shDest: j.shDest1,
                        shShipvia: j.shShipvia,
                        shShipid: j.shShipid,
                        shQuantity: j.shQuantity,
                        shQuid: j.shQuid,
                        shShipdate: j.shShipdate,
                        projMgr: j.reL_JsJob21000.js2ProjMgr,
                        jobDesc: j.reL_Jobinf.jobDesc
                    });
                    projMgrHolder.push({
                        projMgr: j.reL_JsJob21000.js2ProjMgr,
                    });
                });
                setProjMngr(projMgrHolder);
                checkHDCData(objHolder);
            }
        } catch (error) {
            console.error("Error getting shipment data from JMS:", error);
            return { success: false, message: "Error getting shipment data from JMS:" + error.message };
        }
        })();
    }, [projMngrSelect]);

    const checkHDCData = async (shippingsData) => {
        var itemsProcessed = 0;
        var objHolder = [];
        shippingsData.forEach((d) => { 
            const obj = { 
                jobId: d.jobId,
                shDest: d.shDest,
                shShipvia: d.shShipvia,
                shShipid: d.shShipid,
                shQuantity: d.shQuantity,
                shQuid: d.shQuid,
                shShipdate: d.shShipdate,
                projMgr: d.projMgr,
                jobDesc: d. jobDesc
            };
            (async () => {
                try{
                    const json = await checkforJobSurvey(d.jobId);
                    itemsProcessed++;
                    // post data
                    if(json.length === 0) {
                        objHolder.push(obj);
                    } 
                    // put data -> the time frame is shipment timming 1st then job quality 2nd so grabs job in DB to complete survey
                    else if(json[0].shippedProdQuality === null && json[0].shippedOnTime !== null) {
                        objHolder.push(obj);
                    }
                    if(itemsProcessed === shippingsData.length) {
                        processAllData(objHolder, setAllData);
                    }
                } catch (error) {
                    console.log("error", error);
                }
            })();
        });
    };

    // reduces duplicates of project managers for drop down
    useEffect(() => {
        const combinedData = Object.values(
            projMngr.reduce((acc, obj) => {
                const { projMgr } = obj;
                acc[projMgr] = acc[projMgr] || { projMgr, count: 0 };
                acc[projMgr].count++;
                return acc;
                }, {})
        );
        setProjManager(combinedData);
    }, [allData]);

    // handles project manager selection
    const handleChange = (event) => {
        setProjMngrSelect(event.target.value);
        setStatusBase({ msg: 'Changing Manager to: ' + event.target.value, open: true });
        setTimeout(() => {
            setStatusBase({ msg: '', open: false });
        }, 10000);
    };

    // filters out projects manager choosen from all the data
    // determines to send either all data or specific data per project manager
    useEffect(() => {
        const projMgrData = allData?.filter(item => projMngrSelect.includes(item.projMgr));
        projMngrSelect === 'All' ? setSendSurveyData(allData) : setSendSurveyData(projMgrData);
        if(projMgrData?.length === 0 && projMngrSelect !== 'All') {
            setStatusBase({ msg: 'Congrats, you have completed your surveys, check again tomorrow.', open: true });
        }
    }, [allData]);

    // timer for loading
    useEffect(() => {
        const timer = setInterval(() => {
          setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);
        return () => {
          clearInterval(timer);
        };
    }, []);

    // comments dialog form
    const handleClickOpen = (index) => {
        setOpen(true);
        if(sendComm) {
            setSendComm(''); 
            setSelectedRowIndex("");
        } 
        setSelectedRowIndex(index);
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
        setComments('');
    }

    // Clicking Checkboxes in Survey
    useEffect(() => {
        checkOneBox.forEach(function(item) {
            // this hides row once done
            const row2 = item.split('-');
            setHideRow(oldArr => [...oldArr, row2[0] + '-' + row2[1]]);
        });
    }, [checkOneBox, check]);

    const toggleBtn = key => () => {
        setCheckOneBox(oldArr => [...oldArr, key]);
        setCheck(key);
    }

    useEffect(() => {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        if(!(Object.keys(check).length == 0)) {
            const row1 = check.split('-');
            let tempData = sendSurveyData;
            tempData.forEach(function(s, jobindx){
                if(s.jobId == row1[1]) {
                    s.items.forEach(function(i) { 
                        if(row1[0] == jobindx) {
                            // GET check for row in DB if null POST if row PUT
                            (async () => {
                                try{
                                const json = await checkforSurvey(i.jobId, i.Shipid);
                                if(json.length == 0) {
                                    var Arr = [];
                                    Arr.push(i);
                                    var jobObj = {
                                        projMgr: s.projMgr, jobDesc: s.jobDesc, 
                                        shippedProdQuality: row1[2] == 'one' ? 1 : row1[2] == 'two' ? 2 : row1[2] == 'three' ? 3 : row1[2] == 'four' ? 4 : 0,
                                        jobSurveyCompleted: new Date(Date.now() - tzoffset).toISOString().slice(0, 19),
                                        QualityComments: sendComm
                                    }
                                    Arr[0] = {...Arr[0], ...jobObj}
                                    handlePostData(Arr);
                                } else if(json[0].shippedProdQuality == null) {
                                    var Arr = [];
                                    Arr.push(i)
                                    var jobObj = { 
                                        id: json[0].id, projMgr: s.projMgr, jobDesc: s.jobDesc,
                                        shippedProdQuality: row1[2] == 'one' ? 1 : row1[2] == 'two' ? 2 : row1[2] == 'three' ? 3 : row1[2] == 'four' ? 4 : 0,
                                        jobSurveyCompleted: new Date(Date.now() - tzoffset).toISOString().slice(0, 19),
                                        shippedOnTime: json[0].shippedOnTime,
                                        onTimeComments: json[0].onTimeComments,
                                        surveyCompleted: json[0].surveyCompleted,
                                        QualityComments: sendComm ? sendComm : json[0].QualityComments
                                    }
                                    Arr[0] = {...Arr[0], ...jobObj}
                                    handlePutData(Arr);
                                } else {
                                    // alert for user that row was already added to DB, survey completed
                                    setStatusBase({ msg: "Already added survey -> Job Id: " + json[0].jobId +
                                        ", Quality: " + (json[0].shippedProdQuality == 1 ? "Excellent," : 
                                        json[0].shippedProdQuality == 2 ? "As Expected," : json[0].shippedProdQuality == 3 ? "Minor Problems,": 
                                        json[0].shippedProdQuality == 4 ? "Significant Problems,": "") +
                                        " Completed: " + json[0].jobSurveyCompleted, key: Math.random(), open: true });
                                    setTimeout(() => {
                                        setStatusBase({ msg: '', open: false  });
                                    }, 10000);
                                }
                                } catch (error) {
                                    console.log("error", error);
                                    setStatusBase({ msg: "New Survey NOT saved. Error: " + error, open: true });
                                    setTimeout(() => {
                                        setStatusBase({ msg: '', open: false  });
                                    }, 10000);
                                }
                            })();
                        } 
                    });
                }
            });
        }
    }, [check]);

    //handlePutData
    const handlePutData = async (data) => { 
        const promises = data.map(async (d) => {
            try {
                const response = await updateData(d);
                return response;
            } catch (error) {
                console.error("Error posting survey:", error);
                return { success: false, message: "New Survey NOT saved. Error: " + error.message };
            }
        });
        const responses = await Promise.all(promises);
        for (const response of responses) {
            setSendComm('');
            if(response.success === true) {
                const updatedSendSurveyData = sendSurveyData.filter(item => {
                    return item.jobId !== data[0].jobId;
                });
                setSendSurveyData(updatedSendSurveyData);
            }
            setStatusBase({ msg: response.message, open: true });
            setTimeout(() => {
                setStatusBase({ msg: '', open: false });
            }, 10000);
        }
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
            setSendComm('');
            if(response.success === true) {
                const updatedSendSurveyData = sendSurveyData.filter(item => {
                    return item.jobId !== data[0].jobId;
                });
                setSendSurveyData(updatedSendSurveyData);
            }
            setStatusBase({ msg: response.message, open: true });
            setTimeout(() => {
                setStatusBase({ msg: '', open: false });
            }, 10000);
        }
    };

    return (
        <>
        {sendSurveyData ? 
        <div className="MQualitySurvey center mb-5 pb-5">
            {status.open && <AlertMessage key={status.key} message={status.msg} />}
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    className="mb-3"
                >
                    <Typography sx={{ width: '100%', color: 'text.primary' }} variant={'h5'}>
                        Welcome to Job Quality Surveys
                    </Typography>
                    <SurveyHeader/>
                    <Typography sx={{ width: '100%', color: 'text.secondary' }}>
                        If you need to make changes or made a mistake go to Edit Surveys.
                    </Typography>
                    <ManagerSelect projManager={projManager} projMngrSelect={projMngrSelect} handleChange={handleChange} />
                </Grid>
                {sendSurveyData?.map((item, index) => (
                <Root className='pt-4 pb-4' key={index}>
                    <Divider textAlign="left">
                        <Typography sx={{ width: '33%', color: 'text.primary' }}>
                            Job {item.jobId}
                        </Typography>
                        <Typography sx={{ width: '33%', color: 'text.secondary' }}>
                            {item.jobDesc}
                        </Typography>
                    </Divider>
                    <table style={{width: "100%"}}>
                        <thead>
                            <tr key={"header"}>
                                <th style={table}>Excellent</th>
                                <th style={table}>As Expected</th>
                                <th style={table}>Minor Problems</th>
                                <th style={table}>Significant Problems</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={table}>
                                    <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                        id={index + '-' + item.jobId + '-one'}
                                        value={index + '-' + item.jobId + '-one'}
                                        selected={checkOneBox.includes(index + '-' + item.jobId + '-one') ? true : false}
                                        onClick = {toggleBtn(index + '-' + item.jobId + '-one')} 
                                        >
                                    </Checkbox>
                                </td>
                                <td style={table}>
                                    <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                        id={index + '-' + item.jobId + '-two'}
                                        value={index + '-' + item.jobId + '-two'}
                                        selected={checkOneBox.includes(index + '-' + item.jobId + '-two') ? true : false}
                                        onClick = {toggleBtn(index + '-' + item.jobId + '-two')}
                                        >
                                    </Checkbox>
                                </td>
                                <td style={table}>
                                    <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                        id={index + '-' + item.jobId + '-three'}
                                        value={index + '-' + item.jobId + '-three'}
                                        selected={checkOneBox.includes(index + '-' + item.jobId + '-three') ? true : false}
                                        onClick = {toggleBtn(index + '-' + item.jobId + '-three')}
                                        >
                                    </Checkbox>
                                </td>
                                <td style={table}>
                                    <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 35 } }}
                                        id={index + '-' + item.jobId + '-four'}
                                        value={index + '-' + item.jobId + '-four'}
                                        selected={checkOneBox.includes(index + '-' + item.jobId + '-four') ? true : false}
                                        onClick = {toggleBtn(index + '-' + item.jobId + '-four')}
                                        >
                                    </Checkbox>
                                </td>
                                <td style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '200px' }}>
                                    {sendComm && selectedRowIndex == index ? sendComm : 
                                    <Button variant="outlined" onClick={() => handleClickOpen(index)}>
                                        Add Comments
                                    </Button>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Root>
            ))}
            <CommentsDialog open={open} handleSubmit={handleSubmit} handleClose={handleClose} 
                comments={comments} handleCommentChange={handleCommentChange}/>
        </div>
        : 
            <>
            {status.open && <AlertMessage key={status.key} message={status.msg} />}
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

export default QualitySurvey;