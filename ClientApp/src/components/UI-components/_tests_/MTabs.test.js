import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

import MTabs from "../MTabs";

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

const tabs = [
    {
        label: "Overview",
        Component: <div> </div>
    },
    {
        label: "Skids",
        Component: <div> </div>
    },
    {
        label: "Cartons",
        Component: <div> </div>
    },
];

const setTabsLabelsMock = jest.fn();

it("renders", () => {
  
  act(() => {
    render(<MTabs tabs={tabs} setTabsLabels={setTabsLabelsMock}
    />, container);
  });

  //expect(container.textContent).toBe("");

});