import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, Box, Typography, Stack, Snackbar, Tooltip,
    InputLabel, Select, MenuItem, FormControl, TextField, LinearProgress } from '@mui/material';

export const DeleteRow = ({
    openDelete,
    handleCloseDelete,
    setselectedRow,
    rowsDelete,
    selectedRows
}) => {

    const rowsModel = {
        borderBottom: '1px solid gray',
        padding: '10px'
    };

    const styleModalDelete = {
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

    const checkDelete = (e) => {
        e.preventDefault();
        setselectedRow(rowsDelete);
        handleCloseDelete();
    };

    return (
        <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={styleModalDelete}>
            <Typography id="modal-modal-title" variant="h6" component="h2" className="center">
            Delete Product
            </Typography>
            <div>
            <div className="center">
                <div className="pt-3">
                <form onSubmit={checkDelete}>
                    <div className="col">Delete these {selectedRows.length} rows?</div>
                    <div className="row" style={rowsModel}> 
                    <div className="col">
                        <div>Product Id</div> 
                    </div>
                    <div className="col">
                        <div>Description</div>
                    </div>
                    </div>
                    {
                    selectedRows.length > 0 ?
                    selectedRows.map((val, ind) => {
                        return(
                        <div className="row" key={ind} style={rowsModel}> 
                        <div className="col">
                        
                        {val.smiId} 
                        </div>
                        <div className="col">
                        
                        {val.smiDesc} 
                        </div>
                        </div>
                        )
                    })
                    :
                    <div>There are no rows selected</div>
                    }
                    <div className="col">
                    <Button variant="outlined" type="submit" className="mt-5" >Yes</Button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </Box>
        </Modal>
    );
};