import React from 'react';
import { Input } from '@mui/material';

export const SkidsForm = ({input, formChange}) => {
    return (
        <>
        <div className='row'>
            <div className="col">
                <label>QtyPerSkid</label>
                <br></br>
                <Input  
                    className="mb-5" 
                    name="qtyPerSkid" 
                    type="number" 
                    onChange={formChange} 
                    placeholder="QtyPerSkid"
                    value={input.qtyPerSkid}
                    inputProps={{ max: 900000 }}
                    onWheel={(e) => e.target.blur()}
                />
            </div>
            <br></br>
            <div className="col">
                <label>Quantity Skids</label>
                <br></br>
                <Input  
                    className="mb-5" 
                    name="quantitySkids" 
                    type="number" 
                    onChange={formChange} 
                    placeholder="Quantity Skids"
                    value={input.quantitySkids}
                    inputProps={{ max: 900000 }}
                    onWheel={(e) => e.target.blur()}
                />
            </div>
        </div>
        </>
    );
};