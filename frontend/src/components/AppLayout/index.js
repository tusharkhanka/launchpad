import React from "react";
import { AppContext } from "config/context";
import Navbar from "components/Navbar";
import SideBar from "components/SideBar";
import MainWrapper from "components/MainWrapper";
import { defaultState } from "config/context";

import { withRouter } from 'react-router-dom';
import styles from "./style.module.scss";

class AppLayout extends React.PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      ...defaultState,
      windowWidth: window.innerWidth,
      windowHeight: 0,
      navbarToggle: false,
      openedLink: null,
      handleNavbarToggle: () => {
        this.setState({ navbarToggle: !this.state.navbarToggle });
      },
      searchText: '',
    };
  }

  handleSearchTextChange = (value) => {
    this.setState({ searchText: value });
  };

  componentDidUpdate(prevProps) {
    if (this.state.searchText && (this.props.location.pathname !== prevProps.location.pathname)) {
      this.handleSearchTextChange('');
    }
  }

  render() {
    const { children } = this.props;

    return (
      <AppContext.Provider value={{ ...this.state, handleSearchTextChange: this.handleSearchTextChange }}>
        <div className={styles["app-layout__root"]}>
          <Navbar />
          <SideBar />
          <MainWrapper children={children} />
        </div>
      </AppContext.Provider>
    );
  }
}

export default withRouter(AppLayout);
