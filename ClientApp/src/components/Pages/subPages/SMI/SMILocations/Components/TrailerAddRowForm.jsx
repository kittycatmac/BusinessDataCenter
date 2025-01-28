import React from 'react';
import { Input } from '@mui/material';

export const TrailerForm = ({input, formChange}) => {
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
        <br></br>
        <div className='row'>
         <div className="col">
           <label>QtyPerCarton</label>
           <br></br>
           <Input  
               className="mb-5" 
               name="qtyPerCarton" 
               type="number" 
               onChange={formChange} 
               placeholder="QtyPerCarton"
               value={input.qtyPerCarton}
               inputProps={{ max: 900000 }}
               onWheel={(e) => e.target.blur()}
           />
         </div>
         <br></br>
         <div className="col">
           <label>Quantity Cartons</label>
           <br></br>
           <Input  
               className="mb-5" 
               name="quantityCartons" 
               type="number" 
               onChange={formChange} 
               placeholder="Quantity Cartons"
               value={input.quantityCartons}
               inputProps={{ max: 900000 }}
               onWheel={(e) => e.target.blur()}
           />
         </div>
        </div>
        </>
    );
};