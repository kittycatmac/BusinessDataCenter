import React from "react";
import { fireEvent, screen } from '@testing-library/react';
import { render, unmountComponentAtNode } from "react-dom";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import { act } from "react-dom/test-utils";
import { MemoryRouter as Router } from 'react-router-dom';
import { UserContext } from '../../Context/UserProvider';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

import Sidebar from "../Sidebar";

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

const userLevel = 'Information Technology';

it("checks Login button", async() => {

    await act(async () => {
        render(
            <UserContext.Provider value={userLevel}>
                <Router>
                    <Sidebar />
                </Router>
            </UserContext.Provider>
            , container);
    });

    const user = userEvent.setup()
    
    user.click(screen.getByText('Login'));
    expect(screen.findByText("Login"));
});

it("checks Home link", async() => {

    await act(async () => {
        render(
            <UserContext.Provider value={userLevel}>
                <Router>
                    <Sidebar />
                </Router>
            </UserContext.Provider>
            , container);
    });

    const user = userEvent.setup()
    
    user.click(screen.getByText('Hudson Data Center'));
    expect(screen.findByText("Hudson Data Center"));
});

it("opens side nav", async() => {

    await act(async () => {
        render(
            <UserContext.Provider value={userLevel}>
                <Router>
                    <Sidebar />
                </Router>
            </UserContext.Provider>
            , container);
    });

    const user = userEvent.setup()
    
    user.click(container.getElementsByClassName('menuFaBars'));
    expect(screen.findByText("Inventory"));
});

it("opens sub menu", async() => {

    await act(async () => {
        render(
            <UserContext.Provider value={userLevel}>
                <Router>
                    <Sidebar />
                </Router>
            </UserContext.Provider>
            , container);
    });

    expect(screen.findByText("Sheet Material"));
});