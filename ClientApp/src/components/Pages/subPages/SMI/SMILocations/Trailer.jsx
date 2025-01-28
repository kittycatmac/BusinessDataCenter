import React, { useState, useEffect } from 'react';
import Tabs from "../../../../UI-components/MTabs";
import DataTable from "../../../../UI-components/MDataTable";
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import moment from 'moment';
// Data API calls
import { deleteRow } from '../../../../../services/InventoryAPIs/smiLocationsTableApi';
import { populateLocationDataOverview } from './Data/LocationOverviewData';
import { populateLocationTabData } from './Data/LocationTabData';
import { updateCellData } from './Data/CellUpdate';
import { populatesAddNewRow } from './Data/UpdateLocation';
import { pullTransferRow } from './Data/PullTransferRow';
// row objects
import { initialState } from './Data/InitialState';
// model components
import { AddNewRow } from './Components/AddNewRow';
import { DeleteRow } from './Components/DeleteRow';
import { PullProduct } from './Components/PullProduct';

const Trailer = () => {
  
  const [input, setInputs] = useState({
    gridId: "",
    smiId: "",
    productId:  "",
    smiDesc: "",
    smiLength: "",
    smiWidth: "",
    smiType: "",
    smiBwt: "",
    smiCaliper: "",
    smiQoh: "",
    qtyPerSkid:  "",
    qtyPerCarton:  "",
    quantitySkids:  "",
    quantityCartons:  "",
    totalQty: "",
    inches: "",
    tab: "",
    totalLooseQty: "",
    totalOH: "",
    dateTime: "",
    location: "",
    notes: "",
  });

  const [rows, setRows] = useState([]);
  const [selectedrow, setselectedRow] = useState([]);
  const [tabsLabels, setTabsLabels] = useState(0);
  const [tabName, setTabName] = useState([]);
  const [smiLocation] = useState(["Trailer"]);
  const [trailer] = useState(true);
  // Loading
  const [loading, setLoading] = useState(true);
  // Delete modal
  const [deleteId, setDeleteIds] = useState([]);
  const [rowsDelete, setrowsDelete] = useState([]);
  const [selectedRows, setselectedRows] = useState([]);
  // Pull/Transfer Modal
  const [statePull, setStatePull] = useState([]);
  const [rowsPull, setrowsPull] = useState([]);
  const [selectedRowsPull, setselectedRowsPull] = useState([]);
  // validation for cell edit in MDataTable
  const keysToCheck = ['inches', 'qtyPerSkid', 'quantitySkids', 'qtyPerCarton', 'quantityCartons'];

  useEffect(()  => {
    if(rows) {setLoading(false)}
  },[rows]);

  const clearFormState = () => {
    setInputs({ ...initialState });
  };


  // when the tabs change data is pulled from Hudson_DataCenter DB -> SMILocations table
  useEffect(() => {
    if(tabName.length > 0) {
      if(!(tabName === 'overview')) {
        populateLocationTabData({smiLocation, tabName, setRows});
      }
    }
  }, [tabName]);

  // this switch case triggers the api calls for each tabs data added {"id": 1} to prevent
  // the 'no rows' overlay from showing before data is displayed
  useEffect(() => {
      try {
        switch(tabsLabels) {
          case 0:
            setLoading(true);
            populateLocationDataOverview({smiLocation, setRows});
            setTabName('overview');
            break;
          case 1:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-126');
            break;
          case 2:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-369');
            break;
          case 3:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-254');
            break;
          case 4:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-287');
            break;
          case 5:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-382');
            break;
          case 6:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-170');
            break;
          case 7:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-326');
            break;
          case 8:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-383');
            break;
          case 9:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-243');
            break;
          case 10:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-307');
            break;
          case 11:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('S-370');
            break;
          case 12:
            setLoading(true);
            setRows([{"id": 1}]);
            setTabName('misc');
            break;
        }
      } catch (error) {
        console.log("error", error);
      }
  },[tabsLabels]);

  // this is called for adding rows, editing in rows and deleting rows
  function updatedRows() {
    switch(tabsLabels) {
      case 0:
        populateLocationDataOverview({smiLocation, setRows});
        break;
      case 1:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 2:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 3:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 4:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 5:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 6:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 7:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 8:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 9:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 10:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 11:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
      case 12:
        populateLocationTabData({smiLocation, tabName, setRows});
        break;
    }
  };

  // fires on cell edit
  async function updateCell(updatedRow) {
    const id = updatedRow.id;
    if(id) {
      //PUT
      try{
        const response = await updateCellData({updatedRow});
        if(response) {
          updatedRows();
          clearFormState();
        } 
        return response;
      } catch (error) {
        console.log("error", error);
      }
    }
  }
 
  // called when adding new row
  async function updateLocation() {
    // sets gridId to index length
    input.gridId = rows.length;
    // sets location
    input.location = 'Trailer';
    const response = await populatesAddNewRow({input, tabsLabels});
    if(response) {
      updatedRows();
      clearFormState();
    }
  };

  // DELETE call
  useEffect(() => {
    if(deleteId.length > 0) {
      (async () => {
        try {
          const response = await deleteRow(deleteId);
          if(response) {
            updatedRows();
            clearFormState();
          }
        } catch (error) {
            console.log("error", error);
        }
      })();
    }
  }, [deleteId])
  

  // when selectedrow is changed this will delete rows
  useEffect(() => {
      setDeleteIds(selectedrow);
  }, [selectedrow]);

  //Transfer/Pull
  function pullProduct(rowsPull) {
    pullTransferRow({
      statePull, 
      setselectedRow, 
      rowsPull,
      updatedRows,
      clearFormState
    });
  }

  // add, delete and pull/transfer modals
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPull, setOpenPull] = useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleOpenPull = () => setOpenPull(true);
  const handleClosePull = () => setOpenPull(false);

  const columns = [
    { field: "smiId", headerName: "Inv #", width: 100 },
    { field: "productId", headerName: "Product #", width: 100 },
    { field: "tab", headerName: "Trailer", width: 100, hide: (tabsLabels === 0 ? false : true), editable: true,
      type: "singleSelect",
      valueOptions: ["S-126", "S-369", "S-254", "S-287", "S-382", "S-170", "S-326", "S-383", "S-243", "S-307", "S-370", "misc"]
    },
    { field: "smiDesc", headerName: "Description", width: 300 },
    { field: "smiLength", headerName: "Length", width: 100 },
    { field: "smiWidth", headerName: "Width", width: 100 },
    { field: "smiType", headerName: "Type", width: 200 },
    { field: "smiBwt", headerName: "BWT", width: 100 },
    { field: "smiCaliper", headerName: "Caliper", width: 100 },
    { field: "qtyPerSkid", headerName: "QtyPerSkid", description: 'How many sheets per skid?', width: 110, type: 'number',
      editable: (tabsLabels === 0 ? false : true) },
    { field: "quantitySkids", headerName: "Qty Skids", description: 'How many skids?', width: 100,  type: 'number',
      editable: (tabsLabels === 0 ? false : true) },
    { field: "qtyPerCarton", headerName: "QtyPerCarton", description: 'How many sheets per carton?', width: 120, type: 'number',
      editable: (tabsLabels === 0 ? false : true)  },
    { field: "quantityCartons", headerName: "Qty Cartons", description: 'How many cartons?', width: 100, type: 'number',
      editable: (tabsLabels === 0 ? false : true) },
    { field: "totalQty", headerName: "Total Qty", description: '(QtyPerSkid x Qty Skids) + (QtyPerCarton x Qty Cartons)', width: 100, type: 'number'},
    { field: "inches", headerName: "Inches", width: 100, type: 'number', editable: (tabsLabels === 0 ? false : true) },
    { field: "totalLooseQty", headerName: "Total Loose Qty", description: 'Inches/Caliper', width: 150, type: 'number'},
    { field: "totalOh", headerName: "Total On Hand", description: 'Total Qty + Total Loose Qty',width: 150, type: 'number'},
    { field: "dateTime", headerName: "Date Time", width: 200, editable: (tabsLabels === 0 ? false : true),
    valueFormatter: params => 
    moment(params?.value).format("MM/DD/YYYY hh:mm A") },
    { field: "notes", headerName: "Notes", width: 300, editable: true },
  ];

  const tabs = [
      {
        label: "Overview",
        Component: <div> 
                      <Button color="primary" onClick={handleOpenPull} className="mb-3">
                        Pull Product
                      </Button>
                      <div style={{ height: 500, width: "100%" }}>
                        <DataTable 
                          rows={rows} 
                          columns={columns}
                          updateCell={updateCell}
                          setrowsDelete={setrowsDelete}
                          setselectedRows={setselectedRows}
                          setrowsPull={setrowsPull}
                          setselectedRowsPull={setselectedRowsPull}
                          loading={loading}
                        />
                        <PullProduct
                          openPull={openPull}
                          handleClosePull={handleClosePull}
                          selectedRows={selectedRows}
                          setStatePull={setStatePull}
                          statePull={statePull}
                          rowsPull={rowsPull}
                          selectedRowsPull={selectedRowsPull}
                          pullProduct={pullProduct}
                          setLoading={setLoading}
                        />
                      </div>
                  </div>
      },
      {
        label: "S-126",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                      <div style={{ height: 500, width: "100%" }}>
                        <DataTable 
                          rows={rows} 
                          columns={columns}
                          updateCell={updateCell}
                          getRowId={(row) => row.gridId} 
                          loading={loading}
                          setrowsDelete={setrowsDelete}
                          setselectedRows={setselectedRows}
                          selectedRows={selectedRows}
                          setrowsPull={setrowsPull}
                          setselectedRowsPull={setselectedRowsPull}
                          keysToCheck={keysToCheck}
                        />
                        <AddNewRow
                          setInputs={setInputs}
                          updateLocation={updateLocation}
                          openAdd={openAdd}
                          handleCloseAdd={handleCloseAdd}
                          input={input}
                          tabsLabels={tabsLabels}
                          clearFormState={clearFormState}
                          trailer={trailer}
                        />
                        <DeleteRow
                          openDelete={openDelete}
                          handleCloseDelete={handleCloseDelete}
                          setselectedRow={setselectedRow}
                          rowsDelete={rowsDelete}
                          selectedRows={selectedRows}
                        />
                      </div>
                  </div>   
      },
      {
        label: "S-369",
        Component:  <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                      <div style={{ height: 500, width: "100%" }}>
                        <DataTable 
                          rows={rows} 
                          columns={columns}
                          updateCell={updateCell}
                          getRowId={(row) => row.gridId} 
                          loading={loading}
                          setrowsDelete={setrowsDelete}
                          setselectedRows={setselectedRows}
                          selectedRows={selectedRows}
                          setrowsPull={setrowsPull}
                          setselectedRowsPull={setselectedRowsPull}
                          keysToCheck={keysToCheck}
                        />
                        <AddNewRow
                          setInputs={setInputs}
                          updateLocation={updateLocation}
                          openAdd={openAdd}
                          handleCloseAdd={handleCloseAdd}
                          input={input}
                          tabsLabels={tabsLabels}
                          clearFormState={clearFormState}
                          trailer={trailer}
                        />
                        <DeleteRow
                          openDelete={openDelete}
                          handleCloseDelete={handleCloseDelete}
                          setselectedRow={setselectedRow}
                          rowsDelete={rowsDelete}
                          selectedRows={selectedRows}
                        />
                      </div>
                  </div>  
      },
      {
        label: "S-254",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId} 
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "S-287",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId} 
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "S-382",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId} 
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "S-170",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId} 
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "S-326",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId}
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "S-383",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId} 
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "S-243",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId} 
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "S-307",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId} 
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "S-370",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Rows
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId} 
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      },
      {
        label: "Misc",
        Component: <div> 
                      <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd} className="mr-3 mb-3">
                        Add Row
                      </Button>
                      <Button color="primary" startIcon={<DeleteIcon />} onClick={handleOpenDelete} className="mb-3">
                        Delete Row
                      </Button>
                    <div style={{ height: 500, width: "100%" }}>
                      <DataTable 
                        rows={rows} 
                        columns={columns}
                        updateCell={updateCell}
                        getRowId={(row) => row.gridId}
                        loading={loading}
                        setrowsDelete={setrowsDelete}
                        setselectedRows={setselectedRows}
                        selectedRows={selectedRows}
                        setrowsPull={setrowsPull}
                        setselectedRowsPull={setselectedRowsPull}
                        keysToCheck={keysToCheck}
                      />
                      <AddNewRow
                        setInputs={setInputs}
                        updateLocation={updateLocation}
                        openAdd={openAdd}
                        handleCloseAdd={handleCloseAdd}
                        input={input}
                        tabsLabels={tabsLabels}
                        clearFormState={clearFormState}
                        trailer={trailer}
                      />
                      <DeleteRow
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                        setselectedRow={setselectedRow}
                        rowsDelete={rowsDelete}
                        selectedRows={selectedRows}
                      />
                    </div>
                </div>  
      }
  ];

    return (
        <div className="Trailer">
            <h3>Trailer</h3>
            <div>
                <Tabs tabs={tabs} setTabsLabels={setTabsLabels}/>
            </div>
        </div>
    );
}

export default Trailer;