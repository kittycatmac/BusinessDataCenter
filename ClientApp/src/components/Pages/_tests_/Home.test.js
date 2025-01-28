import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { screen } from '@testing-library/react';
import { act } from "react-dom/test-utils";
import '@testing-library/jest-dom/extend-expect'
import Home from "../Home";

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

it("renders with or without a name", async() => {
  act(() => {
    render(<Home />, container);
  });
  // Without name
  expect(screen.getByRole("heading")).toHaveTextContent('Welcome to Hudson Data Center');

  const prop = {DisplayName:'Jane Doe'};
  act(() => {
    render(<Home user={prop}/>, container);
  });
  // With name
  expect(screen.getByRole("heading")).toHaveTextContent('Welcome Jane Doe to Hudson Data Center');
});