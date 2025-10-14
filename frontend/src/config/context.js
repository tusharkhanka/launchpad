import React from "react";

export const AppContext = React.createContext();

export const defaultState = {
  windowWidth: window.innerWidth,
  windowHeight: 0,
  navbarToggle: true, // Sidebar open by default
  openedLink: null,
  searchText: '',
};
