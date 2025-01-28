import React, { useState, createContext, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [userLevel, setUserLevel] = useState(null);
  console.log(userLevel)

  const updateUserLevel = (level) => {
    setUserLevel(level);
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    const foundUser = JSON.parse(userInfo);

    if (!(userLevel) && foundUser) {
      //console.log(foundUser.department)
      updateUserLevel(foundUser.department);
    }
  }, [userLevel]);

  return (
    <UserContext.Provider value={{ userLevel, updateUserLevel }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;