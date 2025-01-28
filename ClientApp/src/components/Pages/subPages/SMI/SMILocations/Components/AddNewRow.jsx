import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Box, Typography, Tooltip, LinearProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import { MSnackbar } from '../../../../../UI-components/MSnackbar';
// Data/API calls
import { AddSheetData } from '../Data/AddSheetData';
// Form components
import { TrailerForm } from './TrailerAddRowForm';
import { SkidsForm } from './SkidsAddRowForm';
import { CartonsForm } from './CartonsAddRowForm';
import { MiscForm } from './MiscAddRowForm';

export const AddNewRow = ({
    setInputs, 
    updateLocation, 
    openAdd, 
    handleCloseAdd, 
    input, 
    trailer, 
    tabsLabels,
    clearFormState
}) => {

    const styleModalAdd = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #748599',
        boxShadow: 24,
        p: 4,
        overflowY: "auto",
        maxHeight: "700px",
    };

    //Auto Populate Add Form from JMS
    const [sheetId, setSheetId] = useState({Id: ""});
    const [sheet, setSMI] = useState([]);
    // Progress bar for loading JMS data for new row
    const [JMSDataLoading, setJMSDataLoading] = useState(false);
    // Snackbar Push Notifications
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);

    const populateSheetData = async () => {
        if(sheetId.Id) {
          AddSheetData(sheetId, setSMI, setJMSDataLoading);
        }
    }

    useEffect(() => {
        if(openAdd == true) {
          setSheetId({Id: ""});
          clearFormState();
        }
      }, [openAdd]);
  
      const tabKeyAutoFill = (event) => {
        if (event.key === 'Tab') {
          // starts progress bar
          setJMSDataLoading(true);
          // sets sheet id
          setSheetId({Id: event.target.value});
        }
      }
  
      const onClickAutoFill = (event) => {
        event.preventDefault();
        // starts progress bar
        setJMSDataLoading(true);
        // sets sheet id
        setSheetId({Id: input.smiId});
      }
  
      useEffect(() => {
        if(sheetId.Id !== '') {
          if((sheetId.Id).length == 6) {
            populateSheetData();
          } else {
            setJMSDataLoading(false);
            setSnackbar({ children: "Error: Incorrect sheet Id", severity: "error" });
          }
        }
      }, [sheetId]);
  
  
      useEffect(() => {
        if(!(sheet.length === 0)) {
          const data = sheet[0];
          // sets input autofill data from populateSheetData GET
          setInputs((input) => ({...input, ...data}));
        }
      }, [sheet]);
  
      // fires with changes in form
      const formChange = (e) => {
        e.preventDefault();
        const key = e.target.name;
        const val = e.target.value;
        // sets inputs
        setInputs((prevInputs) => ({...prevInputs, [key]: val}));
      }
  
      const formSubmit = (e) => {
        e.preventDefault();
        // updates to location jsx file
        updateLocation();
        // closes the modal
        handleCloseAdd();
      }

    return (
        <Modal
          autoFocus={false}
          open={openAdd}
          onClose={handleCloseAdd}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModalAdd}>
            <Typography id="modal-modal-title" variant="h6" component="h2" className="center">
              Add Product
            </Typography>
            {JMSDataLoading ? <LinearProgress /> : <></>}
            {!!snackbar && (
              <MSnackbar
                handleCloseSnackbar={handleCloseSnackbar}
                snackbar={snackbar}
              />
            )}
              <div>
                <div className="center">
                    <div className="pt-3">
                        <form onSubmit={formSubmit}>
                            <div className="pt-5">
                              <div className='row'>
                                <div className="col">
                                  <label>Inv Id</label>
                                  <br></br>
                                  <Input  
                                      autoFocus={true}
                                      className="mb-1" 
                                      name="smiId" 
                                      type="number" 
                                      onChange={formChange} 
                                      placeholder="Inv Id"
                                      value={input.smiId}
                                      onKeyDown={tabKeyAutoFill}
                                      required
                                  /><br></br>
                                  <Tooltip title="Auto-fill data" placement="bottom">
                                  <Button color="primary" startIcon={<AddIcon />} onClick={onClickAutoFill}>
                                  </Button>
                                  </Tooltip>
                                </div>
                                <br></br>
                                <div className="col">
                                  <label>Product Id</label>
                                  <br></br>
                                  <Input  
                                      className="mb-5" 
                                      name="productId" 
                                      type="text" 
                                      onChange={formChange} 
                                      placeholder="Product Id"
                                      value={input.productId}
                                      inputProps={{ maxLength: 20 }}
                                  />
                                </div>
                              </div>
                                <br></br>
                                <div className='row'>
                                  <div className="col">
                                      <label>Description</label>
                                      <br></br>
                                      <Input  
                                          className="mb-5" 
                                          name="smiDesc" 
                                          type="text" 
                                          onChange={formChange} 
                                          placeholder="Description"
                                          value={input.smiDesc}
                                          style ={{width: '100%'}}
                                          required
                                      />
                                  </div>
                                  <br></br>
                                  <div className="col">
                                      <label>Type</label>
                                      <br></br>
                                      <Input  
                                          className="mb-5" 
                                          name="smiType" 
                                          type="text" 
                                          onChange={formChange} 
                                          placeholder="Type"
                                          value={input.smiType}
                                      />
                                  </div>
                                </div>
                                <div className='row'>
                                  <div className="col">
                                      <label>Length</label>
                                      <br></br>
                                      <Input  
                                          className="mb-5" 
                                          name="smiLength" 
                                          type="number" 
                                          onChange={formChange} 
                                          placeholder="Length"
                                          value={input.smiLength}
                                      />
                                  </div>
                                  <br></br>
                                  <div className="col">
                                      <label>Width</label>
                                      <br></br>
                                      <Input  
                                          className="mb-5" 
                                          name="smiWidth" 
                                          type="number" 
                                          onChange={formChange} 
                                          placeholder="Width"
                                          value={input.smiWidth}
                                      />
                                  </div>
                                </div>
                                <br></br>
                                <div className='row'>
                                  <div className="col">
                                    <label>Caliper</label>
                                    <br></br>
                                    <Input  
                                        className="mb-5" 
                                        name="smiCaliper" 
                                        type="number" 
                                        onChange={formChange} 
                                        placeholder="Caliper"
                                        value={input.smiCaliper}
                                    />
                                  </div>
                                  <br></br>
                                  <div className="col">
                                      <label>Bwt</label>
                                      <br></br>
                                      <Input  
                                          className="mb-5" 
                                          name="smiBwt" 
                                          type="number" 
                                          onChange={formChange} 
                                          placeholder="Bwt"
                                          value={input.smiBwt}
                                      />
                                  </div>
                                </div>
                                <br></br>
                                <br></br>
                                {/* if trailer location : 
                                all inputs : 
                                if any other location, skids tab shows skid inputs : 
                                if skids tab shows skid inputs ? 
                                misc tab all inputs */}
                                {(trailer) ?
                                  <TrailerForm input={input} formChange={formChange}/>
                                  :
                                  (tabsLabels == 1) ?
                                  <SkidsForm input={input} formChange={formChange} />
                                  : (tabsLabels == 2) ?
                                  <CartonsForm input={input} formChange={formChange} />
                                  :
                                  <MiscForm input={input} formChange={formChange} />
                                }
                                
                                <br></br>
                                <div className='row'>
                                  <div className="col">
                                      <label>Inches</label>
                                      <br></br>
                                      <Input  
                                          className="mb-5" 
                                          name="inches" 
                                          type="number" 
                                          onChange={formChange} 
                                          placeholder="Inches"
                                          value={input.inches}
                                          inputProps={{ max: 900000 }}
                                          onWheel={(e) => e.target.blur()}
                                      />                       
                                  </div>
                                  <br></br>
                                  <div className="col">
                                  <label>Current Date Time</label>
                                  <p>{moment(new Date()).format('MM-DD-YYYY hh:mm: A')}</p>
                                  </div>
                                </div>
                                <br></br>
                                <div className='row'>
                                  <div className="col">
                                      <label>Notes</label>
                                      <br></br>
                                      <Input  
                                          className="mb-5" 
                                          name="notes" 
                                          type="text" 
                                          onChange={formChange} 
                                          placeholder="Notes"
                                          value={input.notes}
                                          style ={{width: '100%'}}
                                          inputProps={{ maxLength: 30 }}
                                      />
                                  </div>
                                  <div className="col">
                                      <Button variant="outlined" type="submit" className="mt-4" >Submit</Button>
                                  </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
              </div>
          </Box>
        </Modal>
    );
};