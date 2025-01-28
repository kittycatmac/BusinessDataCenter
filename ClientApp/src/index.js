import 'bootstrap/dist/css/bootstrap.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import UserProvider from './components/Context/UserProvider';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');


ReactDOM.render(
  
  <BrowserRouter basename={baseUrl}>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();

