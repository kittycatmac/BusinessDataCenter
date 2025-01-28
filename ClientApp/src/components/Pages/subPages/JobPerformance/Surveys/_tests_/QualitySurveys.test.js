import React from "react";
import { screen, prettyDOM } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import QualitySurveys from "../QualitySurveys";
// API calls for mocking
import { getShippingsForJobs } from '../../../../../../services/SurveyAPIs/shippingsApi';
import { checkforJobSurvey } from '../../../../../../services/SurveyAPIs/surveyTableApi';

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

const QualityTestData = [
    {
        "shShipid": 80818,
        "shQuid": 18,
        "shJobnum": 96492,
        "shDest1": "Shipped to Provided Goods Inventory",
        "shShipdate": "2023-10-08T00:00:00-06:00",
        "shQuantity": 90000,
        "shShipvia": "Automatic transfer",
        "reL_JsJob21000": {
            "js2ProjMgr": "Debbie Cornwell"
        },
        "reL_Jobinf": {
            "jobDesc": "UTAH OFF PAGE OCT '23"
        }
    },
    {
        "shShipid": 80819,
        "shQuid": 19,
        "shJobnum": 96492,
        "shDest1": "Shipped to Provided Goods Inventory",
        "shShipdate": "2023-10-08T00:00:00-06:00",
        "shQuantity": 14000,
        "shShipvia": "Automatic transfer",
        "reL_JsJob21000": {
            "js2ProjMgr": "Debbie Cornwell"
        },
        "reL_Jobinf": {
            "jobDesc": "UTAH OFF PAGE OCT '23"
        }
    },
    {
        "shShipid": 80820,
        "shQuid": 28,
        "shJobnum": 96492,
        "shDest1": "Shipped to Provided Goods Inventory",
        "shShipdate": "2023-10-08T00:00:00-06:00",
        "shQuantity": 1805,
        "shShipvia": "Automatic transfer",
        "reL_JsJob21000": {
            "js2ProjMgr": "Debbie Cornwell"
        },
        "reL_Jobinf": {
            "jobDesc": "UTAH OFF PAGE OCT '23"
        }
    },
    {
        "shShipid": 80821,
        "shQuid": 29,
        "shJobnum": 96492,
        "shDest1": "Shipped to Provided Goods Inventory",
        "shShipdate": "2023-10-08T00:00:00-06:00",
        "shQuantity": 2550,
        "shShipvia": "Automatic transfer",
        "reL_JsJob21000": {
            "js2ProjMgr": "Debbie Cornwell"
        },
        "reL_Jobinf": {
            "jobDesc": "UTAH OFF PAGE OCT '23"
        }
    },
    {
        "shShipid": 80822,
        "shQuid": 19,
        "shJobnum": 96492,
        "shDest1": "Shipped to Provided Goods Inventory",
        "shShipdate": "2023-10-08T00:00:00-06:00",
        "shQuantity": 96000,
        "shShipvia": "Automatic transfer",
        "reL_JsJob21000": {
            "js2ProjMgr": "Debbie Cornwell"
        },
        "reL_Jobinf": {
            "jobDesc": "UTAH OFF PAGE OCT '23"
        }
    },
    {
        "shShipid": 80823,
        "shQuid": 15,
        "shJobnum": 96492,
        "shDest1": "Shipped to Provided Goods Inventory",
        "shShipdate": "2023-10-08T00:00:00-06:00",
        "shQuantity": 90000,
        "shShipvia": "Automatic transfer",
        "reL_JsJob21000": {
            "js2ProjMgr": "Debbie Cornwell"
        },
        "reL_Jobinf": {
            "jobDesc": "UTAH OFF PAGE OCT '23"
        }
    }
];

const checkforSurveyJobTestData =  [
    {
      jobId: 96492,
      shDest: 'Shipped to Provided Goods Inventory',
      shShipvia: 'Automatic transfer',
      shShipid: 80818,
      shQuantity: 90000,
      shQuid: 18,
      shShipdate: '2023-10-08T00:00:00-06:00',
      projMgr: 'Debbie Cornwell',
      jobDesc: "UTAH OFF PAGE OCT '23"
    },
    {
      jobId: 96492,
      shDest: 'Shipped to Provided Goods Inventory',
      shShipvia: 'Automatic transfer',
      shShipid: 80819,
      shQuantity: 14000,
      shQuid: 19,
      shShipdate: '2023-10-08T00:00:00-06:00',
      projMgr: 'Debbie Cornwell',
      jobDesc: "UTAH OFF PAGE OCT '23"
    },
    {
      jobId: 96492,
      shDest: 'Shipped to Provided Goods Inventory',
      shShipvia: 'Automatic transfer',
      shShipid: 80820,
      shQuantity: 1805,
      shQuid: 28,
      shShipdate: '2023-10-08T00:00:00-06:00',
      projMgr: 'Debbie Cornwell',
      jobDesc: "UTAH OFF PAGE OCT '23"
    },
    {
      jobId: 96492,
      shDest: 'Shipped to Provided Goods Inventory',
      shShipvia: 'Automatic transfer',
      shShipid: 80821,
      shQuantity: 2550,
      shQuid: 29,
      shShipdate: '2023-10-08T00:00:00-06:00',
      projMgr: 'Debbie Cornwell',
      jobDesc: "UTAH OFF PAGE OCT '23"
    },
    {
      jobId: 96492,
      shDest: 'Shipped to Provided Goods Inventory',
      shShipvia: 'Automatic transfer',
      shShipid: 80822,
      shQuantity: 96000,
      shQuid: 19,
      shShipdate: '2023-10-08T00:00:00-06:00',
      projMgr: 'Debbie Cornwell',
      jobDesc: "UTAH OFF PAGE OCT '23"
    },
    {
      jobId: 96492,
      shDest: 'Shipped to Provided Goods Inventory',
      shShipvia: 'Automatic transfer',
      shShipid: 80823,
      shQuantity: 90000,
      shQuid: 15,
      shShipdate: '2023-10-08T00:00:00-06:00',
      projMgr: 'Debbie Cornwell',
      jobDesc: "UTAH OFF PAGE OCT '23"
    }
];

// Mocking the api call
jest.mock('../../../../../../services/SurveyAPIs/shippingsApi', () => ({
    getShippingsForJobs: jest.fn(),
}));

jest.mock('../../../../../../services/SurveyAPIs/surveyTableApi', () => ({
    checkforJobSurvey: jest.fn(),
}));

jest.mock('../Data/GetDesc', () => ({
    populateDesc: jest.fn(),
  }));

// mock data for project managers and shipped items/orders
test('QualitySurvey displays data', async () => {
    // mocks getShippingsForJobs
    getShippingsForJobs.mockResolvedValue(QualityTestData);
    // Mock the setProjMngr function
    const setProjMngr = jest.fn();
    checkforSurveyJobTestData.forEach(data => {
        // Mock the response for checkforJobSurvey
        checkforJobSurvey.mockResolvedValue([]);
    });

    await act(async() => {
        render(
            <QualitySurveys setProjMngr={setProjMngr}/>,
            container);
    });

    //checks for project manager dropdown
    const projectManagerDropdown = screen.getByLabelText("Project Manager");
    userEvent.click(projectManagerDropdown);
    const allOption = screen.getByText("All");
    userEvent.click(allOption);
    const debbieCornwellElements = await screen.findAllByText("Debbie Cornwell");
    debbieCornwellElements.forEach(element => {
        expect(element).toBeVisible();
    });
    userEvent.click(document.body);
    // checks for job data
    expect(screen.getByText('Job 96492')).toBeVisible();
    expect(screen.getByText('UTAH OFF PAGE OCT \'23')).toBeVisible();
    // checks panel expand for item
    // const element = screen.findByText('Shipped items')
    // userEvent.click(element, { target: { 'aria-expanded': true } });
    // await screen.findByText('Shipid', { visible: true });
    // await screen.findByText('80818', { visible: true });
    //console.log(container.innerHTML);
    //console.log(prettyDOM(document.body));

});