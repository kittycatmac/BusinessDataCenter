import React from 'react';
import { Breadcrumbs, Grid, Typography } from '@mui/material';
import { Outlet, Link  } from 'react-router';

const Inventory = () => {
    return (
        <div className="inventory center">
            <Typography variant="h4" component="h5" className="center">
                Inventory
            </Typography>
            <Typography variant="h6" component="h3" className="center">
                Welcome to SMI 
            </Typography>
            <div className='mt-3'></div>
            <a href="/Inventory/SMI">Sheet Material Inventory</a>
            <p>Begin by inputing counts into each Location, then check the Overview before sumbitting Quantity on Hand in JMS.</p>
        </div>
    );
}

export default Inventory;