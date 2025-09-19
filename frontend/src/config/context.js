import React from "react";

export const AppContext = React.createContext();

export const defaultState = {
  windowWidth: window.innerWidth,
  windowHeight: 0,
  navbarToggle: false,
  openedLink: null,
  searchText: '',
};
