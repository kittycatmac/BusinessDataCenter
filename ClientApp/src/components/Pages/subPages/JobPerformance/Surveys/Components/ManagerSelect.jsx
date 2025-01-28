import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ManagerSelect = ({ projManager, projMngrSelect, handleChange }) => {
    return (
        <Box sx={{ minWidth: 180 }} className="mb-3 mt-4">
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" htmlFor='demo-simple-select'>Project Manager</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="prjmgrselect"
                    value={projMngrSelect}
                    label="Project Manager"
                    onChange={handleChange}
                >
                    <MenuItem value={'All'}>All</MenuItem>
                    {
                        projManager?.map((x, y) =>
                            <MenuItem key={y} value={x.projMgr}>{x.projMgr}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </Box>
    );
};

export default ManagerSelect;