import React from "react";
import { fireEvent, screen } from '@testing-library/react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

import Login from "../login";

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

//TODO: add valid user credentials username and passord for test to pass
it("Logins in user through inputs then goes to Home page", () => {
    act(() => {
      render(
        <Login />
      , container);
    });
    //console.debug(container);
    const inputNodeUserName = screen.getByPlaceholderText('User Name');
    //console.debug(inputNodeUserName)
    fireEvent.change(inputNodeUserName, {target: { value: ''}});
    expect(inputNodeUserName.value).toBe('');

    const inputNodePassword = screen.getByPlaceholderText('Password');
    //console.debug(inputNodePassword);
    fireEvent.change(inputNodePassword, {target: { value: ''}});
    expect(inputNodePassword.value).toBe('');

    // Submits login inputs
    fireEvent.click(screen.getByText('Login'));
    
    expect(screen.findByText(""));
});

//TODO: add valid user credentials username and passord for test to pass
it("Logins in user through setUser prop goes to Home page", async () => {
    const fakeUser = {
      UserName: "",
      password: "",
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeUser)
      })
    );
  
    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(<Login setUser={fakeUser}/>, container);
    });

    // Submits login inputs
    fireEvent.click(screen.getByText('Login'));
    // TODO: add full display name below for UI on home page
    expect(screen.findByText(""));

    global.fetch.mockRestore();
});

