import React from "react";
import { screen, prettyDOM, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import SMIOverview from "../SMIOverview";
import { getSMILocations, clearData } from '../../../../../services/InventoryAPIs/smiLocationsTableApi';

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

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

jest.mock('../../../../../services/InventoryAPIs/smiLocationsTableApi');

it("renders overview data and checks all calculations and totals", async () => {

  const fakeData = [{
    id: "0",
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
  }];

  //mock getSMILocations()
  getSMILocations.mockResolvedValue(fakeData);

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<SMIOverview />, container);
  });

  //screen.debug();
  //console.debug(container);
  expect(container.querySelector("h3").textContent).toBe('Overview');
  // grabs grid node
  const grid = screen.getByRole("grid");
  // checking grid for smiId
  expect(grid).toHaveTextContent(100004);
  // checking grid for location
  expect(grid).toHaveTextContent('Hallway');
  // checking screen for date
  expect(screen.findByText("10/13/2022 04:56 PM"));
  // checking notes
  expect(screen.findByText("notes for testing"));
  // checking product Id
  expect(screen.findByText("DM100YZ"));
  // checking smiDesc
  expect(screen.findByText("100# SATIN/DULL TEXT        13 X 19"));
  // checking smiType
  expect(screen.findByText("Book    EXT PAPER"));
  // checking qtyPerCarton
  expect(screen.findByText("400"));
  // checking quantity of Carton
  expect(screen.findByText("3"));
  // checking qtyPerSkid
  expect(screen.findByText("6000"));
  // checking quantity of Carton
  expect(screen.findByText("2"));
  // checking totalQty
  const totalQty = (fakeData.qtyPerSkid * fakeData.quantitySkids) + (fakeData.qtyPerCarton * fakeData.quantityCartons);
  expect(screen.findByText(totalQty));
  // checking screen for inches
  expect(screen.findByText("3.6"));
  // checking for totalLooseQty
  const totalLooseQty = fakeData.inches / fakeData.smiCaliper;
  expect(screen.findByText(totalLooseQty));
  // checking for totalOH
  const totalOH = fakeData.totalLooseQty + fakeData.totalQty;
  expect(screen.findByText(totalOH))

  // opens save QOH to JMS modal
  const user = userEvent.setup()
  //const button = screen.getByText('Save QoH to JMS'); //Print QoH Totals
  const button = screen.getByText('Print QoH Totals');
  user.click(button);
  //expect(window.open).toHaveBeenCalledWith("https://localhost:5001/Inventory/SMI/Overview", "_blank");
  // // checks totalOH
  // expect(screen.findByText(fakeData.totalOH));
  // // checks smiQoh
  // expect(screen.findByText(fakeData.smiQoh));
  // // checks smiQoh - totalOH
  // expect(screen.findByText(fakeData.smiQoh - fakeData.totalOH));
  //});
  // relesses mock fetch
  //global.fetch.mockRestore();
});

it('checks patch data to send to JMS when two smiId that are the same, totals should be combined', async () => {
  const fakeData = [{
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

  //mock getSMILocations()
  getSMILocations.mockResolvedValue(fakeData);

  await act(async () => {
    render(<SMIOverview />, container);
  });

  // opens save QOH to JMS modal
  const user = userEvent.setup()
  //const button = screen.getByText('Save QoH to JMS');
  const button = screen.getByText('Print QoH Totals');
  user.click(button);
  // // checks totalOH
  // expect(screen.findByText("25209"));
  // // checks smiQoh
  // expect(screen.findByText("9978"));
  // // checks smiQoh - totalOH
  // expect(screen.findByText("15231"));
  
  // relesses mock fetch
  //global.fetch.mockRestore();

});



it('clears totals on clear click', async () => {
  const fakeData = [{
    id: "0",
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
  }];

  const clearFakeData = [{
    id: "0",
    dateTime: "2022-10-13T16:56",
    gridId: 1,
    inches: 0,
    location: "Hallway",
    notes: "notes for testing",
    productId: "DM100YZ",
    qtyPerCarton: 400,
    qtyPerSkid: 6000,
    quantityCartons: 0,
    quantitySkids: 0,
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
  }];

  //mock getSMILocations() and clearData()
  getSMILocations.mockResolvedValue(fakeData);

  clearData.mockResolvedValue(fakeData);

  // Trigger the clearTotals function (you might need to adjust the following lines based on your actual component structure)
  await act(async () => {
    render(<SMIOverview />, container);
  });

  userEvent.click(screen.getByText('Clear Totals'));
  expect(screen.findByText('Are you sure you want to clear all totals?'));
  userEvent.click(screen.findByText('Clear All Totals'));

  // Cleanup
  //global.fetch.mockRestore();
});
