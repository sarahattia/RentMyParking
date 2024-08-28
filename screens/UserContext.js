import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    id: '',
    phone: '',
    email: '',
    password: '',
    user: 'to rent',
    parkAddress: '',
    streetNumber: '',
    city: '',
    sizeOfPark: '',
    howToOpenPark: '',
    note: '',
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
