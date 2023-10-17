import React, { createContext, useContext, useState } from "react";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState("default");

  return (
    <AppStateContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  return useContext(AppStateContext);
};
