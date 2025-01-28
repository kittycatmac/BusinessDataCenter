import { Outlet, Link  } from 'react-router-dom';
import { Breadcrumbs, Grid } from '@mui/material';

const SMILocations = () => {

    return (
        <div className="SMILocations center">
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                className="mb-3"
            >
                <Breadcrumbs aria-label="breadcrumb">
                <Link to="/Inventory/SMI/Locations/Hallway">Hallway</Link>
                <Link to="/Inventory/SMI/Locations/Warehouse">Warehouse</Link>
                <Link to="/Inventory/SMI/Locations/DigitalRoom">DigitalRoom</Link>
                <Link to="/Inventory/SMI/Locations/Landa">Landa</Link>
                <Link to="/Inventory/SMI/Locations/Trailer">Trailer</Link>
                <Link to="/Inventory/SMI/Locations/Floor">Floor</Link>
                </Breadcrumbs>
            </Grid> 
            <Outlet />
        </div>
    );
}

export default SMILocations;