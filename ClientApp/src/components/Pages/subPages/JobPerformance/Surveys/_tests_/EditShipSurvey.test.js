import React from "react";
import { screen, prettyDOM } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import EditShipSurveys from "../EditShipSurveys";
// API calls for mocking
import { checkforSurvey } from '../../../../../../services/SurveyAPIs/surveyTableApi';

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

let container = null;
beforeEach(() => {
  // DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const checkforSurveyTestDataDB =  [
    {
      jobId: 96617,
      shShipid: 77575,
    }

];

const UITestData = [
    {
        "id": 1086,
        "projMgr": "Allen Harris",
        "jobId": 96617,
        "jobDesc": "STUDENT INSIDER NAU FALL 23",
        "itemDesc": "STUDENT INSIDER FALL 2023 NAU EDITION",
        "prodId": 1,
        "shQuantity": 22000,
        "shQuid": 1,
        "itemValue": 506.59,
        "shShipid": 77575,
        "shShipdate": "2023-08-15T00:00:00",
        "shipValueTotal": 11145.04,
        "shippedOnTime": 2,
        "shippedProdQuality": 2,
        "surveyCompleted": "2023-09-19T14:10:01",
        "jobSurveyCompleted": "2023-09-19T14:10:29",
        "qualityComments": "dfgfg",
        "onTimeComments": "dfgdfg"
    }
]

jest.mock('../../../../../../services/SurveyAPIs/surveyTableApi', () => ({
    checkforSurvey: jest.fn(),
}));

jest.mock('../Data/GetDesc', () => ({
    populateDesc: jest.fn(),
}));

// mock data for project managers and shipped items/orders
test('EditShipSurvey displays data', async () => {

    checkforSurveyTestDataDB.forEach(data => {
        // Mock the response for checkforSurvey
        checkforSurvey.mockResolvedValue(UITestData);
    });

    await act(async() => {
        render(
            <EditShipSurveys />,
            container);
    });

    // input values
    const jobIdInput = screen.getByRole('textbox', { name: 'Job Id' });;
    userEvent.type(jobIdInput, '96617');
    const shipIdInput = screen.getByRole('textbox', { name: 'Ship Id' }); 
    userEvent.type(shipIdInput, '77575');
    // click serch button
    const searchJobIdShipId = screen.getByText("Search");
    userEvent.click(searchJobIdShipId);
    // checks the UI for data
    await screen.findByText('Project Manager', { visible: true });
    await screen.findByText('Allen Harris', { visible: true });
    await screen.findByText('Shipment Id', { visible: true });
    await screen.findByText('77575', { visible: true });
    await screen.findByText('Shipment Quanity', { visible: true });
    await screen.findByText('22000', { visible: true });
    await screen.findByText('Total Value of Shipment', { visible: true });
    await screen.findByText('11145.04', { visible: true });
    await screen.findByText('Ship Date', { visible: true });
    await screen.findByText('8/15/2023', { visible: true });
    await screen.findByText('Ship Timing', { visible: true });
    //await screen.findByText('Slightly Late', { visible: true });
    await screen.findByText('Ship Survey Date', { visible: true });
    await screen.findByText('9/19/2023', { visible: true });
    await screen.findByText('Shipment Survey Comments', { visible: true });
    await screen.findByText('dfgdfg', { visible: true });
    //console.log(container.innerHTML);
    //console.log(prettyDOM(document.body));

});