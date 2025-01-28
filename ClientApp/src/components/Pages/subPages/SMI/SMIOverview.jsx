import React, { useState, useEffect } from 'react';
import DataTable from "../../../UI-components/MDataTable";
import { Button, Modal, Box, Typography } from '@mui/material';
import moment from 'moment';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// API calls
import { getSMILocations, clearData } from '../../../../services/InventoryAPIs/smiLocationsTableApi';
import { getSheetMaterialInventory, patchQoh } from '../../../../services/InventoryAPIs/smiApi';
// Print QoH Totals page
import { handlePrint } from '../SMI/SMILocations/Components/PrintQoHPage';

const Overview = () => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #748599',
        boxShadow: 24,
        p: 4,
        overflowY: "auto",
        maxHeight: "700px",
    };
      
    // const checkRowsModel = {
    //     borderBottom: '1px solid gray',
    //     padding: '10px',
    // };

    // const checkRowsModelHeader = {
    //     borderBottom: '1px solid gray',
    //     borderTop: '1px solid gray',
    //     padding: '10px',
    //     position: 'sticky',
    //     top: 0,
    //     backgroundColor: '#8498b5',
    //     zIndex: 1
    // };

    const [rows, setRows] = useState([]);
    const [sheets, setSMI] = useState([]);
    const [patch, setPatch] = useState([]);
    const [checkRows, setCheckRows] = useState([]);
    const [data, getData] = useState(false);
    // const [openSave, setOpenSave] = useState(false);
    // Loading
    const [loading, setLoading] = useState(true);

    useEffect(()  => {
        if(rows) {setLoading(false)}
    },[rows]);
  
    // const handleOpenSave = () => setOpenSave(true);
    // const handleCloseSave = () => setOpenSave(false);

    const [openClear, setOpenClear] = useState(false);
  
    const handleOpenClear = () => setOpenClear(true);
    const handleCloseClear = () => setOpenClear(false);

    // sets rows
    useEffect(() => {
        (async () => { 
            try {
                setLoading(true);
                const json = await getSMILocations();
                setRows(json);
            } catch (error) {
                console.log("error", error);
            }
        })();
    }, [data]);

    // gets most current smiQoh from JMS
    useEffect(() => {
        console.log(rows);
        if(rows !== []) {
            (async () => { 
                try {
                    const json = await getSheetMaterialInventory();
                    console.log(json);
                    let obj1 = {};
                    json.forEach((obj) => {
                        obj1[obj.smiId] = obj.smiQoh;
                    });
                    const arr =[];
                    arr.push(obj1);
                    setSMI(arr);
                } catch (error) {
                    console.log("error", error);
                }
            })();
        }
        // (async () => { 
        //     try {
        //         console.log(rows);
        //         const json = await getSheetMaterialInventory();
        //         console.log(json);
        //         let obj1 = {};
        //         json.forEach((obj) => {
        //             obj1[obj.smiId] = obj.smiQoh;
        //         });
        //         const arr =[];
        //         arr.push(obj1);
        //         setSMI(arr);
        //     } catch (error) {
        //         console.log("error", error);
        //     }
        // })();
    }, [rows]);

    // adds up duplicate smiId with totals and add current smiQoh
    useEffect(() => {

        var holder = {};
        rows.forEach(function(d) {
            if (holder.hasOwnProperty(d.smiId)) {
                holder[d.smiId] = holder[d.smiId] + d.totalOh;
            } else {
                holder[d.smiId] = d.totalOh;
            }
        });

        const obj1 = [];

        for (var prop in holder) {
            obj1.push({ smiId: prop, totalOh: holder[prop]});
        }
        // sets data for patch call
        setPatch(obj1);

        obj1.forEach(obj => {
            sheets.forEach(function(d) {
                for(const p in d) {
                    if(p === obj.smiId) {
                        var rounded = d[p];
                        obj.smiQoh = rounded.toFixed()
                    }
                }
            })
        });

        // breaks down the differance from current jms to new smiQoh
        obj1.forEach(obj => {
            var dif = 0;
            var TF;
            dif = Math.floor(obj.totalOh) - obj.smiQoh;
            if(Math.sign(dif) === -1) {
                TF = false
            } else {
                TF = true;
            }
            obj.Diff = dif;
            obj.Bool = TF;
        });
        // set rows for checking in UI
        setCheckRows(obj1);
    }, [rows, sheets]);

    // triggers the tab to open for page print
    const handlePrintQoh = () => {
        console.log(checkRows);
        handlePrint({checkRows});
    }

    // const updateQOH = () => {
    //     // loops through data for patch call
    //     patch.forEach(function (p) {
    //         // const requestOptions = {
    //         //     method: 'PATCH',
    //         //     headers: { 'Content-Type': 'application/json' },
    //         //     body: JSON.stringify({
    //         //         "op":"replace",
    //         //         "path":"/smiQoh",
    //         //         "value": Math.floor(p.totalOh)
    //         //     })
    //         // };

    //         (async () => {
    //             try {
    //                 // const response = await fetch(process.env.REACT_APP_HDC_APIURL +`/SMI/PatchQOH/${p.smiId}`, requestOptions);
    //                 // var code = response.statusCode;
    //                 // console.log(code);
    //                 patchQoh(p.smiId, p.totalOh);
    //             } catch (error) {
    //                 console.log("error", error);
    //             }
    //         })();
    //     });
    // }

    // const handleClickSave = (e) => {
    //     e.preventDefault();
    //     updateQOH();
    //     handleCloseSave();
    // }

    const clearTotals = () => {
        (async () => {
            try {
                const json = await clearData();
                console.log(json); //true/false
                if(json) {
                    getData(true);
                }
            } catch (error) {
                console.log("error", error);
            }
        })();
    }

    const handleClickClear = (e) => {
        e.preventDefault();
        clearTotals();
        handleCloseClear();
    }

    const columns = [
        { field: "smiId", headerName: "Inv #", width: 100},
        { field: "location", headerName: "Location", width: 100},
        { field: "productId", headerName: "Product #", width: 100},
        { field: "smiDesc", headerName: "Description", width: 300 },
        { field: "smiLength", headerName: "Length", width: 100 },
        { field: "smiWidth", headerName: "Width", width: 100 },
        { field: "smiType", headerName: "Type", width: 150 },
        { field: "smiBwt", headerName: "BWT", width: 100 },
        { field: "smiCaliper", headerName: "Caliper", width: 100 },
        { field: "qtyPerSkid", headerName: "QtyPerSkid", description: 'How many sheets per skid?', width: 110 },
        { field: "quantitySkids", headerName: "Qty Skids", description: 'How many skids?', width: 100 },
        { field: "qtyPerCarton", headerName: "QtyPerCarton", description: 'How many sheets per carton?', width: 120 },
        { field: "quantityCartons", headerName: "Qty Cartons", description: 'How many cartons?', width: 100 },
        { field: "totalQty", headerName: "Total Qty", description: '(QtyPerSkid x Qty Skids) + (QtyPerCarton x Qty Cartons)', width: 100 },
        { field: "inches", headerName: "Inches", width: 100 },
        { field: "totalLooseQty", headerName: "Total Loose Qty", description: 'Inches/Caliper', width: 150 },
        { field: "totalOh", headerName: "Total On Hand", description: 'Total Qty + Total Loose Qty', width: 150 },
        { field: "dateTime", headerName: "Date Time", width: 200,
        valueFormatter: params => 
        moment(params?.value).format("MM/DD/YYYY hh:mm A") },
        { field: "notes", headerName: "Notes", width: 300, editable: true },
    ];

    return (
        <>
            <div className="Overview center">
                <h3>Overview</h3>
                {/* <Button color="primary" className="mb-4 mr-3" onClick={handleOpenSave}>
                    Save QoH to JMS
                </Button> */}
                <Button color="primary" className="mb-4 mr-3" onClick={handlePrintQoh}>
                    Print QoH Totals
                </Button>
                <Button color="primary" className="mb-4 ml-3" onClick={handleOpenClear}>
                    Clear Totals
                </Button>
                <div> 
                    <div style={{ height: 500, width: "100%" }}>
                        <DataTable 
                            rows={rows} 
                            columns={columns}
                            loading={loading}
                        />
                    </div>
                </div>   
            </div>
            {/* Check Modal */}
            {/* <Modal
                open={openSave}
                onClose={handleCloseSave}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" className="center">
                    Check Product
                </Typography>
                <div>
                    <div className="center">
                        <div className="pt-3">
                            <form onSubmit={handleClickSave}>
                            <div className="col pb-3">Please review Qoh changes</div>
                            <div className="row" style={checkRowsModelHeader}> 
                                <div className="col">
                                    <div>Inv #</div>
                                </div>
                                <div className="col">
                                    <div>JMS Qoh</div>
                                </div>
                                <div className="col">
                                    <div>New Qoh</div>
                                </div>
                                <div className="col">
                                    <div>Difference</div>
                                </div>
                            </div>
                            {
                            checkRows.length > 0 ? 
                                checkRows.map((val, ind) => {
                                    return(
                                        <div className="row hover-el" key={ind} style={checkRowsModel}> 
                                            <div className="col">
                                                
                                                {val.smiId} 
                                            </div>
                                            <div className="col">
                                                
                                                {val.smiQoh} 
                                            </div>
                                            <div className="col">
                                                
                                                {val.totalOh} 
                                            </div>
                                            <div className="col">
                                                {val.Bool ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>}
                                                {val.Diff}
                                            </div>
                                        </div>
                                    )
                                })

                            : 
                              <div>There are no rows</div>
                            }
                            <div className="col">
                                <Button variant="outlined" type="submit" className="mt-5">Submit Qoh</Button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal> */}
        {/* Clear Modal */}
        <Modal
            open={openClear}
            onClose={handleCloseClear}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" className="center">
                    Clearing Totals
                </Typography>
                <div>
                    <div className="center">
                        <div className="pt-3">
                            <form onSubmit={handleClickClear}>
                            <div className="col pb-3">
                                <p>Are you sure you want to clear all totals?</p>
                                <br></br>
                                <p>These totals will reset to 0:</p>
                                <ul style={{listStyle:'none', fontSize: '20px'}}>
                                    <li>Qty of Skids</li>
                                    <li>Qty of Cartons</li>
                                    <li>Inches</li>
                                </ul>
                                <br></br>
                                <p>And these totals to 0:</p>
                                <ul style={{listStyle:'none', fontSize: '20px'}}>
                                    <li>Total Qty</li>
                                    <li>Total Loose Qty</li>
                                    <li>Total On Hand</li>
                                </ul>
                                <br></br>
                                <h5>All previous changes will be lost, be sure to submit Qoh changes to JMS before clearing all totals.</h5>
                                <div className="col">
                                    <Button variant="outlined" type="submit" className="mt-5">Clear All Totals</Button>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    </> 
    );
}

export default Overview;