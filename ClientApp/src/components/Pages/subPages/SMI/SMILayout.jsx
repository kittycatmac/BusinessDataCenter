import { Outlet, Link  } from 'react-router-dom';
import { Breadcrumbs, Grid } from '@mui/material';

const SMILayout = () => {
  return (
    <div className="center">  
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        className="mb-3"
      >
        <Breadcrumbs aria-label="breadcrumb">
          {/* <Link to="/Inventory/SMI/Data">Sheet Material Data</Link>
          <Link to="/Inventory/SMI/Maintenance">Sheet Material Maintenance</Link>
          <Link to="#">Advance Search</Link>
          <Link to="/Inventory/SMI/BulkEdit">Edit Sheet QoH</Link> */}
          <Link to="/Inventory/SMI/Locations">Locations</Link>
          <Link to="/Inventory/SMI/Overview">Overview</Link>
          {/* <Link to="#">Sheet Material Logs</Link> */}
        </Breadcrumbs>
      </Grid> 
      <Outlet />
    </div>
  );
};
export default SMILayout;