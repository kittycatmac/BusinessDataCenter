import React from "react";
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

import MDataTable from "../MDataTable";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with data", () => {

  const inputProp = {
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
  }

  const rowsProp = [{
    id: 1,
    dateTime: "2022-10-13T16:56",
    gridId: 1,
    inches: 3.6,
    location: "Hallway",
    notes: "notes for testing",
    productId: "DM100YZ",
    qtyPerCarton: 400,
    qtyPerSkid: 6000,
    quantityCartons: 3,
    quantitySkids: 2,
    smiBwt: 100,
    smiCaliper: 0.0055,
    smiDesc: "100# SATIN/DULL TEXT        13 X 19",
    smiId: 100004,
    smiLength: 19,
    smiQoh: 9978,
    smiType: "Book    EXT PAPER",
    smiWidth: 13,
    tab: "misc",
    totalLooseQty: 654.545,
    totalOH: 19454.545,
    totalQty: 18800,
  },{
    id: 2,
    dateTime: "2022-10-13T16:34",
    gridId: 2,
    inches: 2.5,
    location: "Hallway",
    notes: "notes for testing",
    productId: "PMO45TY",
    qtyPerCarton: 300,
    qtyPerSkid: 5000,
    quantityCartons: 1,
    quantitySkids: 1,
    smiBwt: 100,
    smiCaliper: 0.0055,
    smiDesc: "100# SATIN/DULL TEXT        13 X 19",
    smiId: 100004,
    smiLength: 19,
    smiQoh: 9978,
    smiType: "Book    EXT PAPER",
    smiWidth: 13,
    tab: "misc",
    totalLooseQty: 454.545,
    totalOH: 5754.545,
    totalQty: 5300,
  }];
  const columnsProp = [
    { field: "smiId", headerName: "Inv #", width: 100 },
    { field: "productId", headerName: "Product #", width: 100 },
    { field: "tab", headerName: "Tab", width: 100, hide: true, editable: true,
      type: "singleSelect",
      valueOptions: ["skids", "cartons", "misc" ]
    },
    { field: "smiDesc", headerName: "Description", width: 300 },
    { field: "smiLength", headerName: "Length", width: 100 },
    { field: "smiWidth", headerName: "Width", width: 100 },
    { field: "smiType", headerName: "Type", width: 200 },
    { field: "smiBwt", headerName: "BWT", width: 100 },
    { field: "smiCaliper", headerName: "Caliper", width: 100 },
    { field: "qtyPerSkid", headerName: "QtyPerSkid", description: 'How many sheets per skid?', width: 110, editable: true },
    { field: "quantitySkids", headerName: "Qty Skids", description: 'How many skids?', width: 100, editable: true },
    { field: "qtyPerCarton", headerName: "QtyPerCarton", description: 'How many sheets per carton?', width: 120, editable: true },
    { field: "quantityCartons", headerName: "Qty Cartons", description: 'How many cartons?', width: 100, editable: true },
    { field: "totalQty", headerName: "Total Qty", description: '(QtyPerSkid x Qty Skids) + (QtyPerCarton x Qty Cartons)', width: 100 },
    { field: "inches", headerName: "Inches", width: 100, editable: true },
    { field: "totalLooseQty", headerName: "Total Loose Qty", description: 'Inches/Caliper', width: 150,},
    { field: "totalOh", headerName: "Total On Hand", description: 'Total Qty + Total Loose Qty',width: 150,},
    { field: "dateTime", headerName: "Date Time", width: 200, editable: true,
    valueFormatter: params => 
    moment(params?.value).format("MM/DD/YYYY hh:mm A") },
    { field: "notes", headerName: "Notes", width: 300, editable: true },
  ];
  const statePullProp = [];
  const selectedRowsProp = [];
  const setStatePullMock = jest.fn();
  
  act(() => {
    render(<MDataTable 
      rows={rowsProp}
      columns={columnsProp}
      input={inputProp} 
      statePull={statePullProp} 
      selectedRows={selectedRowsProp}
      setStatePull={setStatePullMock}
    />, container);
  });

  // grabs grid node
  const grid = screen.getByRole("grid");
  // creates user event 
  const user = userEvent.setup()
  // checks for menu and rows per page in data grid
  expect(grid).toHaveTextContent("Columns0FiltersDensityExportInv #Product #100004DM100YZ100004PMO45TYRows per page:1001–2 of 2");
  // checks for checkbox for all rows
  const allRowCheckBox = screen.getByLabelText('Select all rows')
  user.click(allRowCheckBox);
  expect(screen.findByLabelText('Unselect all rows'));
  // checks columns
  expect(screen.findByLabelText("Inv #"));
  expect(screen.findByLabelText("Product #"));
  expect(screen.findByLabelText("Description"));
  expect(screen.findByLabelText("QtyPerSkid"));
  expect(screen.findByLabelText("Qty Skids"));
  expect(screen.findByLabelText("QtyPerCarton"));
  expect(screen.findByLabelText("Qty Skids"));
  expect(screen.findByLabelText("Total Qty"));
  expect(screen.findByLabelText("Inches"));
  expect(screen.findByLabelText("Total On Hand"));
  expect(screen.findByLabelText("Date Time"));
  expect(screen.findByLabelText("Notes"));
  // check hidden columns should be true for 15 cols 
  const roleGrid = container.querySelector('[role="grid"]');
  expect(roleGrid.getAttribute('aria-colcount') === '15').toBe(true);
});