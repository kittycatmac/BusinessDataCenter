import React, { useState } from "react";
import {Alert, Stack, Collapse} from '@mui/material';

export default function AlertMassage({ message }) {
  const [open, setOpen] = useState(true);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Stack>
        <Collapse in={open}>
            <Alert severity="info"
                variant="outlined"
                open={open}
                onClose={handleClose}
                children={message}
            />
        </Collapse>
    </Stack>
  );
}