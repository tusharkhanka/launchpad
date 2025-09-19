import React from "react";
import { AppContext } from "config/context";
import styles from "./style.module.scss";

const MainWrapper = ({ children }) => {
  return (
    <AppContext.Consumer>
      {({ navbarToggle }) => (
        <main
          className={`${styles["main-wrapper__main"]} ${navbarToggle ? styles["main-wrapper__main--shifted"] : ""}`}
        >
          {children}
        </main>
      )}
    </AppContext.Consumer>
  );
};

export default MainWrapper;
