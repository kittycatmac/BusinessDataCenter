import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { screen } from '@testing-library/react';
import { act } from "react-dom/test-utils";
import userEvent from '@testing-library/user-event';

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

import Topbar from "../Topbar";

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

it("renders with image and icons", () => {
  
  act(() => {
    render(<Topbar 
    />, container);
  });

  // HDC image
  const testImage = container.querySelector("img");
  expect(testImage.src).toContain("http://localhost/hdcSmall.png");
  // user icon
  const testAccountIcon = screen.getByTestId("AccountCircleIcon");
  expect(testAccountIcon.getAttribute('class') === 'MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root').toBe(true);
  // toggle icons
  const testLightModeIcon = screen.getByTestId("LightModeIcon");
  const testMuiSwitchIcons = container.querySelector(".toggleTheme span")
  const testNightModeIcon = screen.getByTestId("ModeNightIcon");
  expect(testLightModeIcon.getAttribute('viewBox') === '0 0 24 24').toBe(true);
  expect(testMuiSwitchIcons.getAttribute('class') === 'MuiSwitch-root MuiSwitch-sizeMedium css-julti5-MuiSwitch-root').toBe(true);
  expect(testNightModeIcon.getAttribute('viewBox') === '0 0 24 24').toBe(true);
});

it("changes color theme", () => {
  
    act(() => {
      render(<Topbar 
      />, container);
    });

    // creates user event 
    const user = userEvent.setup();
    // clicks toggle icon
    const toggleIcon = container.querySelector("span .MuiSwitch-sizeMedium");
    user.click(toggleIcon);
    const span = container.querySelector("span .MuiSwitch-track");
    // checks for class change when in darkmode
    expect(span.classList.contains("css-g5sy4h"))
});