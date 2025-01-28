import React, { useState, useEffect, useCallback } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import { Typography, Accordion, AccordionDetails, AccordionSummary, Grid,
    Divider, styled, Checkbox } from '@mui/material';
// global UI components
import CircularProgress from "../../../../UI-components/MCircularProgress";
import AlertMessage from "../../../../UI-components/MInfoAlertMessage";
// survey components
import CommentsDialog from "./Components/CommentsDialog";
import SurveyHeader from './Components/SurveyHeader';
import ManagerSelect from './Components/ManagerSelect';
// API calls
import { getShippings } from '../../../../../services/SurveyAPIs/shippingsApi';
import { checkforSurvey } from '../../../../../services/SurveyAPIs/surveyTableApi';
// GET Data functions
import { processAllData } from './Data/ProcessAllData';
// POST Data function
import { postNewRow } from './Data/PostData';


const OnTimeSurvey = () => {

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        '& > :not(style) + :not(style)': {
          marginTop: theme.spacing(2),
        },
    }));

    const table = {
        border: "1px solid #d3d3d3",
        margin: "0px 0px",
        padding: "5px 5px",
    }

    const [expanded, setExpanded] = useState(false);
    // tracks the check box toggle state
    const [check, setCheck] = useState([]);
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
            const json = await getShippings();
            if(json.length == 0) {
                console.log('empty');
                setStatusBase({ msg: "There is not any data for the past two days", open: true });
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
                console.log(objHolder);
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
            (async () => {
                try{
                const json = await checkforSurvey(d.jobId, d.shShipid);
                itemsProcessed++;
                if(json.length === 0) {
                    objHolder.push({ 
                        jobId: d.jobId,
                        shDest: d.shDest,
                        shShipvia: d.shShipvia,
                        shShipid: d.shShipid,
                        shQuantity: d.shQuantity,
                        shQuid: d.shQuid,
                        shShipdate: new Date(d.shShipdate).toLocaleDateString("en-US"),
                        projMgr: d.projMgr,
                        jobDesc: d. jobDesc
                    });
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

    // reduces duplicates of poject managers for drop down
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
            // this hides row once checked
            const row2 = item.split('-');
            setHideRow(oldArr => [...oldArr, row2[0] + '-' + row2[1]]);
        });
    }, [checkOneBox, check]);

    const toggleBtn = key => () => {
        setCheckOneBox(oldArr => [...oldArr, key]);
        setCheck(key);

    }

    // prepares the data for post
    useEffect(() => {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        if(!(Object.keys(check).length == 0)) {
            const row1 = check.split('-');
            let tempData = sendSurveyData;
            tempData.forEach(function(s){
                if(s.jobId == row1[1]) { 
                    s.items.forEach(function(i, index) { 
                        if(row1[0] == index) {
                            var Arr = [];
                            Arr.push(i);
                            var jobObj = {
                                projMgr: s.projMgr, jobDesc: s.jobDesc, 
                                shippedOnTime: row1[2] == 'one' ? 1 : row1[2] == 'two' ? 2 : row1[2] == 'three' ? 3 : 0,
                                surveyCompleted: new Date(Date.now() - tzoffset).toISOString().slice(0, 19),
                                OnTimeComments: sendComm
                            }
                            Arr[0] = {...Arr[0], ...jobObj};
                            handlePostData(Arr);
                        } 
                    });
                }
            });
        }
    }, [check]);

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
                const updatedSendSurveyData = sendSurveyData.map(item => {
                    if (item.jobId === data[0].jobId) {
                      const updatedItems = item.items.filter(i => {
                        return i.Shipid !== data[0].Shipid; // Keep items with different Shipid
                      });
                      // If all items were removed, filter out the job
                      if (updatedItems.length === 0) {
                        return null; // Return null to remove this job from the array
                      }
                      return {
                        ...item,
                        items: updatedItems,
                      };
                    }
                    return item;
                }).filter(Boolean);
                setSendSurveyData(updatedSendSurveyData);
            }
            setStatusBase({ msg: response.message, open: true });
            setTimeout(() => {
                setStatusBase({ msg: '', open: false });
            }, 10000);
        }
    };

    // change on Accordian panels
    const handlePanelChange = panel => (event, isExpanded) => {
        // clears previous comment once expanded
        if(isExpanded) {
            setSendComm('');
        }
        setExpanded(isExpanded ? panel : false);
    }

    return (
        <>
        {sendSurveyData ? 
        <div className="MOnTimeSurvey center mb-5 pb-5">
            {status.open && <AlertMessage key={status.key} message={status.msg} />}
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                className="mb-3"
            >
                <Typography sx={{ width: '100%', color: 'text.primary' }} variant={'h5'}>
                    Welcome to Shipment Timing Surveys
                </Typography>
                <SurveyHeader/>
                <Typography sx={{ width: '100%', color: 'text.secondary' }}>
                    If you need to make changes or made a mistake go to Edit Surveys.
                </Typography>
                <ManagerSelect projManager={projManager} projMngrSelect={projMngrSelect} handleChange={handleChange} />
            </Grid>
            {sendSurveyData?.map((item, index) => (
                <div key={item.jobId} className='pl-3 pr-3'>
                    <Root className='pt-4 pb-4' key={index + 'root'}>
                        <Divider key={item.jobId + 'divider'} textAlign="left">
                            <Typography sx={{ width: '33%', color: 'text.primary' }}>
                                Job {item.jobId}
                            </Typography>
                            <Typography sx={{ width: '33%', color: 'text.secondary' }}>
                                {item.jobDesc}
                            </Typography>
                        </Divider>
                    </Root>

                    <Accordion 
                    expanded={expanded === index} 
                    onChange={handlePanelChange(index)}
                    index={index}
                    key={item.jobId + 'shipItems'}
                    >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                            <Typography sx={{ color: 'text.primary' }}>
                            {item.items.length} Shipped Items
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{width: "100%"}}>
                                <table key={'OnTimeTable'} style={{width: "100%"}}>
                                    <thead>
                                        <tr key={index + item.jobId}>
                                            {Object.keys(item.items[0]).map((key, ind) => (
                                                (key == 'itemValue') ? null : 
                                                <th key={ind} style={table}>{key}</th>                                  
                                            ))}
                                            <th key={'On Time'} style={table}>On Time</th>
                                            <th key={'Slightly Late'} style={table}>Slightly Late</th>
                                            <th key={'Very Late'} style={table}>Very Late</th>
                                            <th key={'Comments'} style={table}>Add Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.items.map((i, d) => (
                                            <tr key={d + '-' + i.Shipid + '-' + i.jobId}>
                                                {Object.values(i).map((val, ind) => (
                                                    (Object.keys(i)[ind] === 'itemValue') ? null : (val === null) ?
                                                    <td key={ind} style={table}>no value</td> :
                                                    <td key={ind} style={table}>{val}</td>
                                                ))}
                                                <td key={'oneTime'} style={table}>
                                                    <Checkbox
                                                        id={d + '-' + i.jobId + '-one'}
                                                        value={d + '-' + i.jobId + '-one'}
                                                        selected={checkOneBox.includes(d + '-' + i.jobId + '-one') ? true : false}
                                                        onClick = {toggleBtn(d + '-' + i.jobId + '-one')} 
                                                        >
                                                    </Checkbox>
                                                </td>
                                                <td key={'twoTime'} style={table}>
                                                    <Checkbox
                                                        id={d + '-' + i.jobId + '-two'}
                                                        value={d + '-' + i.jobId + '-two'}
                                                        selected={checkOneBox.includes(d + '-' + i.jobId + '-two') ? true : false}
                                                        onClick = {toggleBtn(d + '-' + i.jobId + '-two')}
                                                        >
                                                    </Checkbox>
                                                </td>
                                                <td key={'threeTime'} style={table}>
                                                    <Checkbox
                                                        id={d + '-' + i.jobId + '-three'}
                                                        value={d + '-' + i.jobId + '-three'}
                                                        selected={checkOneBox.includes(d + '-' + i.jobId + '-three') ? true : false}
                                                        onClick = {toggleBtn(d + '-' + i.jobId + '-three')}
                                                        >
                                                    </Checkbox>
                                                </td>
                                                <td key={'comments'} style={table}>
                                                    {sendComm && selectedRowIndex == d ?
                                                    <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                        {sendComm}
                                                    </div> : 
                                                    <span 
                                                        onClick={() => handleClickOpen(d)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            display: 'inline-block',
                                                            padding: '5px 10px',
                                                        }}>
                                                        <ChatIcon />
                                                    </span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
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

export default OnTimeSurvey;