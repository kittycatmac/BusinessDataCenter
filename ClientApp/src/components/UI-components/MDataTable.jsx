import React, { useState, useEffect } from 'react';
import { Box, Stack, LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { MSnackbar } from './MSnackbar';

const MDataTable = ({
  rows,
  columns,
  updateCell,
  loading,
  setrowsDelete,
  setselectedRows,
  setrowsPull,
  setselectedRowsPull,
  keysToCheck
}) => {

    // Snackbar Push Notifications
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);

    // adds new row on cell change
    const updateEditedRow = async (newRow, oldRow) => {
      const updatedRow = { ...newRow};
      for (const key of keysToCheck) {
        if (typeof updatedRow[key] === 'number' && updatedRow[key] < 0) {
          setSnackbar({ children: "Error: negative numbers not allowed", severity: "error" });
          return oldRow;
        }
      }
      const response = await updateCell(updatedRow);
      if(response) {
        setSnackbar({ children: "User successfully saved", severity: "success" });
        return newRow;
      } 
      else {
        setSnackbar({ children: "Error saving edited cell", severity: "error" });
        return oldRow;
      }
    };

    // color row when duplicates in data table
    useEffect(() => {
      const lookup = rows.reduce((a, e) => {
        a[e.smiId] = ++a[e.smiId] || 0;
        return a;
      }, {});

      const duplicateIds = rows.filter(e => lookup[e.smiId]);

      const dupIds = [];
      duplicateIds.forEach(function(d) { 
        dupIds.push(d.smiId);
      });

      const rowdupIds = [];
      rows.forEach(function(d) { 
        rowdupIds.push(d.smiId);
      });

      rowdupIds.forEach(function(d) { 
        dupIds.forEach(function(e) {
          if(e === d) {
            rows.forEach(function(r) {
              if(r.smiId === d) {
                r.dup = true
              }
            })
          } else {
            if(rows.smiId === d) {
              rows.dup = false
            }
          }
        });
      });
    }, [rows]);

    return (
      <div>
        <Box>
          <DataGrid
              sx={{
                height: 500,
                '.dup--true': {'color': '#2984d9'},
              }}
              loading={loading}
              rows={rows}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    // Hide columns initially
                    smiLength: false,
                    smiWidth: false,
                    smiType: false,
                    smiBwt: false,
                    smiCaliper: false,
                  },
                },
              }}
              editMode="row"
              processRowUpdate={(updatedRow, originalRow) =>
                updateEditedRow(updatedRow, originalRow)
              } 
              experimentalFeatures={{ newEditingApi:true}}
              onSelectionModelChange={(itm) =>  {
                setrowsDelete(itm)
                setrowsPull(itm)
                const selectedIDs = new Set(itm);
                const selectedRows = rows.filter((row) =>
                  selectedIDs.has(row.id),
                );
                setselectedRows(selectedRows);
                setselectedRowsPull(selectedRows);
              }}
              getRowClassName={(params) => 
                `dup--${params.row.dup}`}
              components={{
                Toolbar: GridToolbar,
                LoadingOverlay: LinearProgress,
                NoRowsOverlay: () => (
                  <Stack height="100%" alignItems="center" justifyContent="center">
                    No rows in DataGrid
                  </Stack>
                ),
                NoResultsOverlay: () => (
                  <Stack height="100%" alignItems="center" justifyContent="center">
                    Local filter returns no result
                  </Stack>
                )
              }}
              componentsProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
          />
        </Box>
        {!!snackbar && (
          <MSnackbar
            handleCloseSnackbar={handleCloseSnackbar}
            snackbar={snackbar}
          />
        )}
      </div> 
    );
};

export default MDataTable;