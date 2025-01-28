import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions, Button } from '@mui/material';

const CommentsDialog = ({ open, handleClose, comments, handleCommentChange, handleSubmit }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Comments</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter comments for any clarifications.
                </DialogContentText>
                <TextField
                    autoFocus
                    id="standard-basic-ontiming"
                    label="enter comments"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={comments}
                    onChange={handleCommentChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit Comments</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommentsDialog;