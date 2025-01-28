import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, Box, Typography, Stack, Snackbar, Tooltip,
    InputLabel, Select, MenuItem, FormControl, TextField, LinearProgress } from '@mui/material';
import { useMediaQuery } from '../../../../../UI-components/reactMediaQuery';

export const PullProduct = ({
    openPull,
    handleClosePull,
    selectedRows,
    setStatePull,
    statePull,
    rowsPull,
    selectedRowsPull,
    pullProduct,
    setLoading
}) => {

    const isRowBased = useMediaQuery('(max-width: 1200px)');
    
    const stylePullModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1200,
        bgcolor: 'background.paper',
        border: '2px solid #748599',
        boxShadow: 24,
        p: 4,
        overflowY: "auto",
        maxHeight: "700px",
        container: isRowBased => ({
        width: isRowBased ? 800 : 1000,
        })
    };

    const rowsModelPullHeader = {
        borderBottom: '1px solid gray',
        padding: '0',
        position: 'sticky',
        top: 0,
        backgroundColor: '#8498b5',
        zIndex: 100
    };

    const rowsModelPull = {
        borderBottom: '1px solid gray',
        padding: '0',
    }

    useEffect(() => {
        setStatePull(selectedRowsPull);
    }, [selectedRows]);
  
    const formChangePull = (e, index) => {
      e.preventDefault();
      console.log(statePull);
      const { name, value } = e.target;
      setStatePull((prev) => {
        const updatedState = [...prev];
        updatedState[index] = { ...updatedState[index], [name]: value };
        return updatedState;
      });
    }
  
    const pullFormSubmit = (e) => {
        e.preventDefault();
        pullProduct(rowsPull);
        handleClosePull();
        setLoading(true);
    }

    return(
        <Modal
        open={openPull}
        onClose={handleClosePull}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={stylePullModal} style={stylePullModal.container(isRowBased)}>
          <Typography id="modal-modal-title" variant="h6" component="h2" className="center">
            Pull Product
          </Typography>
          <div>
            <div className="center">
              <div className="pt-3">
                <form onSubmit={pullFormSubmit}>
                  <div className="col pb-4">Are you sure you want to transfer {selectedRowsPull.length} products?</div>
                  <div className="row" style={rowsModelPullHeader}> 
                    <div className="col-1">
                      <div>SMI Id</div> 
                    </div>
                    <div className="col-3">
                      <div>Description</div>
                    </div>
                    <div className="col-2">
                      <div># Skids pull</div>
                    </div>
                    <div className="col-2">
                      <div># Cartons pull</div>
                    </div>
                    <div className="col-2">
                      <div>Inches</div>
                    </div>
                    <div className="col-2">
                      <div>Transfer Location</div>
                    </div>
                  </div>
                  {
                  statePull.length > 0 ?
                    statePull.map(( val, ind) => {
                      return(
                      <div className="row" key={ind} style={rowsModelPull}> 
                        <div className="col-1 mt-4">
                          
                          {val.smiId} 
                        </div>
                        <div className="col-3 mt-3">
                          
                          {val.smiDesc} 
                        </div>
                        <div className="col-2">
                          <TextField  
                              id="filled-basic" 
                              label= {val.quantitySkids ? val.quantitySkids + ' Skids' : '0'+' Skids'} 
                              variant="filled"
                              className="mt-2" 
                              name="newQtySkids" 
                              type="number" 
                              onChange={(e) => formChangePull(e, ind)}
                              value={val.newQtySkids ? val.newQtySkids : ''}
                          />  
                        </div>
                        <div className="col-2">
                          <TextField  
                              id="filled-basic" 
                              label={val.quantityCartons ? val.quantityCartons + ' Cartons' : '0'+' Cartons'} 
                              variant="filled"
                              className="mt-2" 
                              name="newQtyCartons" 
                              type="number" 
                              onChange={(e) => formChangePull(e, ind)}
                              value={val.newQtyCartons ? val.newQtyCartons : ''}
                          />  
                        </div>
                        <div className="col-2">
                          <TextField  
                              id="filled-basic" 
                              label={val.inches ? val.inches + ' Inches' : '0'+' Inches'} 
                              variant="filled"
                              className="mt-2" 
                              name="newInches" 
                              type="number" 
                              onChange={(e) => formChangePull(e, ind)}
                              value={val.newInches ? val.newInches : ''}
                          />  
                        </div>
                        <div className="col-2">
                          <FormControl variant="filled" sx={{ m: 1, minWidth: 130}}>
                          <InputLabel id="demo-simple-select-filled-label">
                            Location
                          </InputLabel>
                            <Select
                              labelId="demo-simple-select-filled-label"
                              id="demo-simple-select-filled"
                              name="newLocation"
                              onChange={(e) => formChangePull(e, ind)}
                              value={val.newLocation ? val.newLocation :
                                 val.location ? val.location : ''}
                            >
                              <MenuItem value='Hallway'>Hallway</MenuItem>
                              <MenuItem value='Warehouse'>Warehouse</MenuItem>
                              <MenuItem value='DigitalRoom'>DigitalRoom</MenuItem>
                              <MenuItem value='Landa'>Landa</MenuItem>
                              <MenuItem value='Trailer'>Trailer</MenuItem>
                              <MenuItem value='Floor'>Floor</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      )
                    })
                  :
                    <div>There are no rows selected</div>
                  }
                  <div className="col">
                    <Button variant="outlined" type="submit" className="mt-5" >Pull</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    );
};