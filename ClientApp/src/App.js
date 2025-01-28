import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
// Style sheets
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './custom.css';
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// Components
import { Layout } from './components/Layout';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Error from './components/Error';
import ProtectedRoutes from './components/ProtectedRoutes';
import SessionTimeout from './components/SessionTimeout';
// Context
import { UserContext } from './components/Context/UserProvider';
// Below is an example to fetch data from .net in a class component
// api example
import { FetchData } from './components/FetchData';
// Components Pages
import Home from './components/Pages/Home';
import Login from './components/Pages/Login';
import NotLogin from './components/Pages/NotLogin';
import Inventory from './components/Pages/Inventory';
import JobPerformance from './components/Pages/JobPerformance';
import Team from './components/Pages/Team';
import Support from './components/Pages/Support';
// Components Pages subPages SMI
import SMILayout from './components/Pages/subPages/SMI/SMILayout';
import ChartOverview from './components/Pages/subPages/SMI/ChartOverview';
import SMILocations from './components/Pages/subPages/SMI/SMILocations';
import SMIOverview from './components/Pages/subPages/SMI/SMIOverview';
//Components Pages subPages JobPerformance
import ClientSurveys from './components/Pages/subPages/JobPerformance/ClientSurveys';
// Components Pages subPages SMI SMILocations
import ChartLocations from './components/Pages/subPages/SMI/SMILocations/ChartLocations';
import Hallway from './components/Pages/subPages/SMI/SMILocations/Hallway';
import DigitalRoom from './components/Pages/subPages/SMI/SMILocations/DigitalRoom';
import Landa from './components/Pages/subPages/SMI/SMILocations/Landa';
import Floor from './components/Pages/subPages/SMI/SMILocations/Floor';
import Trailer from './components/Pages/subPages/SMI/SMILocations/Trailer';
import Warehouse from './components/Pages/subPages/SMI/SMILocations/Warehouse';
//Components Pages subPages JobPerformance
import OnTimeSurveys from './components/Pages/subPages/JobPerformance/Surveys/OnTimeSurvey';
import QualitySurveys from './components/Pages/subPages/JobPerformance/Surveys/QualitySurveys';
import EditShipSurveys from './components/Pages/subPages/JobPerformance/Surveys/EditShipSurveys';
import EditJobSurveys from './components/Pages/subPages/JobPerformance/Surveys/EditJobSurveys';
import SearchIds from './components/Pages/subPages/JobPerformance/Surveys/SearchIds';

// Define theme settings
const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
};

function App() {
  const [user, setUser] = useState(null);

  const { updateUserLevel } = useContext(UserContext);

  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // This function is triggered when the Switch component is toggled
  const changeTheme = () => {
    //setIsDarkTheme(!isDarkTheme);
    setIsDarkTheme((prevIsDarkTheme) => {
      const newTheme = !prevIsDarkTheme ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return !prevIsDarkTheme;
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("userInfo");
    const loggedInToken = sessionStorage.getItem("storedToken");

    if (loggedInUser && loggedInToken) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  return (
    <ThemeProvider theme={isDarkTheme ? createTheme(dark) : createTheme(light)}>
      <CssBaseline />
      <SessionTimeout user={user}/>
      <div>
        <Topbar user={user} isDarkTheme={isDarkTheme} changeTheme={changeTheme}/>
        <Sidebar user={user} isDarkTheme={isDarkTheme}/>
        <Layout>
          <Routes>
            {/* Home */}
            <Route exact path='/' element={<Home user={user}/>} />
            {/*Not Logged In*/}
            <Route exact path='/NotLogin' element={<NotLogin/>} />
            <Route element={
              <ProtectedRoutes/>
              } >
              <Route path='/Inventory' element={<Inventory/>} />
              <Route path='/Inventory/SMI' element={<SMILayout />} >
                <Route path='/Inventory/SMI/Overview' element={<SMIOverview/>} />
                <Route path='/Inventory/SMI' element={<ChartOverview/>} />
                <Route path='/Inventory/SMI/Locations' element={<SMILocations/>} >
                  <Route path='/Inventory/SMI/Locations/Hallway' element={<Hallway/>} />
                  <Route path='/Inventory/SMI/Locations/Warehouse' element={<Warehouse/>} />
                  <Route path='/Inventory/SMI/Locations/DigitalRoom' element={<DigitalRoom/>} />
                  <Route path='/Inventory/SMI/Locations/Landa' element={<Landa/>} />
                  <Route path='/Inventory/SMI/Locations/Trailer' element={<Trailer/>} />
                  <Route path='/Inventory/SMI/Locations/Floor' element={<Floor/>} />
                  <Route path='/Inventory/SMI/Locations' element={<ChartLocations/>} />
                </Route>
              </Route>
            </Route>
            {/* Job Performance */}
            <Route element={
              <ProtectedRoutes/> 
              } >
              <Route path='/JobPerformance' element={<JobPerformance/>} />
              <Route path='/JobPerformance/Surveys' element={<ClientSurveys />} >
                <Route path='/JobPerformance/Surveys/OnTime' element={<OnTimeSurveys />} />
                <Route path='/JobPerformance/Surveys/Quality' element={<QualitySurveys />} /> 
                <Route path='/JobPerformance/Surveys/EditShip' element={<EditShipSurveys />} />
                <Route path='/JobPerformance/Surveys/EditJob' element={<EditJobSurveys />} /> 
                <Route path='/JobPerformance/Surveys/SearchIds' element={<SearchIds />} />
              </Route>
            </Route>
            {/* Team */}
            <Route path='/Team' element={
              <ProtectedRoutes user={user}>
                <Team />
              </ProtectedRoutes>
            } />
            {/* Support */}
            <Route path='/Support' element={
              <ProtectedRoutes user={user}>
                <Support />
              </ProtectedRoutes>
            } />
            <Route path='/Login' element={<Login setUser={setUser} updateUserLevel={updateUserLevel}/>} />
            <Route path='*' element={<Error />} />
          </Routes>
        </Layout>
      </div>
    </ThemeProvider>
  );
}
export default App;