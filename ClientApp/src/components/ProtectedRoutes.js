import React, { useState, useEffect  } from 'react';
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({redirectPath = '/NotLogin', children }) => {
    const loggedInUser = sessionStorage.getItem("userInfo");
    const loggedInToken = sessionStorage.getItem("storedToken");
    //console.log(loggedInUser);

    if(!(loggedInUser && loggedInToken)) {
        return <Navigate to={redirectPath} replace />
    } else {
        return children ? children : <Outlet />;
    }
};

export default ProtectedRoutes;