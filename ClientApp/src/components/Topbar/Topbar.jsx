import { React } from 'react';
import '../Styles/Topbar.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Switch } from "@mui/material";
  
const Topbar = ({user, isDarkTheme, changeTheme}) => {

  return (

  <div className="topbar container-fluid" 
    style={{background: isDarkTheme ? "#5a718f" : "white", borderBottom: isDarkTheme ? "3px solid rgb(195, 197, 227)" : "0px"}}>
    <div className="row">
      <div className="hdc-small-img">
        <img className="pt-2" src={require('../../img/hdcSmall.png')} style={{width:'90px', height:'30px'}}/>
      </div>
      <div className="toggleTheme">
        <LightModeIcon style={{color: isDarkTheme ? "white" : "#3b5b8a"}}/>
        <Switch checked={isDarkTheme} onChange={changeTheme} name="switch" />
        <ModeNightIcon style={{color:'#3b5b8a'}}/>
      </div>
      <div className="user">
        <div className="col-12">
          <div className="row" style={{color: isDarkTheme ? "white" : "black"}}>
            <div className="col-10">{user?.DisplayName}
            </div>
            <div className="col-2">
            <AccountCircleIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  )
};
  
export default Topbar;