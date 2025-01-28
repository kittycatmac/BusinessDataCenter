import React from "react";
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Floor from "../Floor";
import { getLocationData } from '../../../../../../services/InventoryAPIs/smiLocationsTableApi';

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

jest.mock('../../../../../../services/InventoryAPIs/smiLocationsTableApi');

it("renders data to the overview tab, selects a row and shows row data in pull product", async () => {

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

  getLocationData.mockResolvedValue(fakeData);
  
  await act(async () => {
    render(<Floor />, container);
  });

  await waitFor(() => {
    // grabs grid node
    const grid = screen.getByRole("grid");
    // checking grid for smiId
    expect(grid).toHaveTextContent(100004);
  });

  // checking screen for date
  expect(screen.findByText("10/13/2022 04:56 PM"));
  // checking product Id
  expect(await screen.getByText("DM100YZ")).toBeInTheDocument();
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
  expect(screen.findByText(totalOH));
  //});
  // grab checkbox and select
  const checkbox = screen.getByLabelText('Select row');
  expect(checkbox.checked).toBe(false);
  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(true);
  // checks pull product 
  const pullProductBtn = screen.getByText('Pull Product');
  fireEvent.click(pullProductBtn);
  expect(screen.getAllByText('100004'));
  expect(screen.getAllByText('Floor'));
})