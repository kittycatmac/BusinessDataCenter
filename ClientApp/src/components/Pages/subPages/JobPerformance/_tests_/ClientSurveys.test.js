import React from "react";
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from 'react-router-dom';
import ClientSurveys from "../ClientSurveys";

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

// Mock both react-chartjs-2 and chart.js
jest.mock('react-chartjs-2', () => ({
  Bubble: () => <div data-testid="chart-mock" />,
}));

jest.mock('chart.js', () => {
  return {
    ...jest.requireActual('chart.js'), // Use the actual module
    LinearScale: jest.fn(),
    CategoryScale: jest.fn(),
    BarElement: jest.fn(),
    PointElement: jest.fn(),
    LineElement: jest.fn(),
    Legend: jest.fn(),
    Tooltip: jest.fn(),
  };
});

it("checks for breadcrumb links", async() => {
  act(() => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/JobPerformance/Surveys/OnTime' }]}>
        <ClientSurveys />
      </MemoryRouter>
    , container);
  });
  expect(screen.getByLabelText("breadcrumb")).toHaveTextContent(
    /Client Surveys\s*\/\s*On Time Surveys\s*\/\s*Quality Surveys\s*\/\s*Edit On Time Surveys\s*\/\s*Edit Quality Surveys\s*\/\s*Search Job Ids/
  );
});