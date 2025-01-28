import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { UserContext } from './components/Context/UserProvider';

const userLevel = 'Information Technology';

it('renders without crashing', async () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <UserContext.Provider value={userLevel}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </UserContext.Provider>
    , div);
  await new Promise(resolve => setTimeout(resolve, 1000));
});
