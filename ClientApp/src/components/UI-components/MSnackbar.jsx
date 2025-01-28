import React from 'react';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

    export const MSnackbar = ({
        handleCloseSnackbar,
        snackbar
    }) => {

        return(
            <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
            autoHideDuration={8000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        );
    };