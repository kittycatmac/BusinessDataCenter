import React, { useState, useRef, useContext } from 'react';
import { UserContext } from '../Context/UserProvider';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import '../Styles/Sidebar.css';

const Nav = styled.div`
  background: #5a718f;
  position: absolute;
  height: 50px;
  width: 100%;
  top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 1rem;
  margin-right: 1rem;
  font-size: 2rem;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #fff;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 40px;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 200ms;
  z-index: 10; 
  direction: rtl;
  overflow:auto;
`;

const SidebarWrap = styled.div`
  width: 100%;
  direction:ltr;
`;

const Sidebar = ({user, isDarkTheme}) => {

  const navigate = useNavigate();
  
  function clearLogin() { 
    //sessionStorage.removeItem('user'); 
    sessionStorage.removeItem('storedToken'); 
    sessionStorage.removeItem('userInfo'); 
    navigate('/');
    window.location.reload();
  }

  // User levels
  const { userLevel } = useContext(UserContext);
  //console.log(userLevel)

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  // closes menu when click outside menu
  const ref = useRef();
  const closeOpenMenus = (e)=>{
    if(ref.current && sidebar && !ref.current.contains(e.target)){
      setSidebar(false)
    }
  }
  document.addEventListener('mousedown',closeOpenMenus);

  return (
    <>
      <IconContext.Provider value={{ color: '#1e2733' }}>
        <Nav>
          <NavIcon to='#'>
            <FaIcons.FaBars className="menuFaBars" onClick={showSidebar} />
          </NavIcon>
          <NavLink to="/" 
            className={({ isActive }) => (isActive ? 'link active' : 'link')}
            >Hudson Data Center
          </NavLink>
            {!user ?
          <NavLink
            to='/login'
            className={({ isActive }) => (isActive ? 'link active mr-3' : 'link mr-3')}
          >
            Login
          </NavLink>
          : 
          <NavLink 
            to="/" onClick={ clearLogin }
            className= {({ isActive }) => (isActive ? 'link active mr-3' : 'link mr-3')}
          >
            Log Out
          </NavLink>
            }
        </Nav>
        <SidebarNav sidebar={sidebar} ref={ref} style={{background: isDarkTheme ? "#5a718f" : "white"}}>
          <SidebarWrap>
            <div className="navicon">
            <NavIcon to='#'>
              <AiIcons.AiOutlineClose className="menuClose" onClick={showSidebar} />
            </NavIcon>
            </div>
            {SidebarData.map((item, index) => {
              if (item.allowedLevels.includes(userLevel)) {
                return <SubMenu item={item} key={index} />;
              }
            })}
            <div className="send">
              <img className="mt-5 pt-3 ml-5 pl-4" src={require('../../img/send-it.png')} style={{width:'80px', height:'80px'}}/>
            </div>
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;