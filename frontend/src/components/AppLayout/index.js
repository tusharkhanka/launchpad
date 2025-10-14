import React from "react";
import { AppContext } from "config/context";
import Navbar from "components/Navbar";
import SideBar from "components/SideBar";
import MainWrapper from "components/MainWrapper";
import OnboardingModal from "components/OnboardingModal";
import { defaultState } from "config/context";
import { listOrganizations } from "services/organizations";

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
      navbarToggle: true, // Sidebar open by default
      openedLink: null,
      handleNavbarToggle: () => {
        this.setState({ navbarToggle: !this.state.navbarToggle });
      },
      searchText: '',
      showOnboarding: false,
      onboardingCompleted: false,
    };
  }

  handleSearchTextChange = (value) => {
    this.setState({ searchText: value });
  };

  componentDidMount() {
    this.checkForOrganizations();
  }

  componentDidUpdate(prevProps) {
    if (this.state.searchText && (this.props.location.pathname !== prevProps.location.pathname)) {
      this.handleSearchTextChange('');
    }
  }

  checkForOrganizations = async () => {
    try {
      const response = await listOrganizations();
      const organizations = response?.data || [];
      
      // Show onboarding if no organizations exist
      if (organizations.length === 0) {
        this.setState({ showOnboarding: true });
      } else {
        this.setState({ showOnboarding: false, onboardingCompleted: true });
      }
    } catch (error) {
      console.error("Error checking organizations:", error);
      // On error, show onboarding to be safe
      this.setState({ showOnboarding: true });
    }
  };

  handleOnboardingComplete = () => {
    this.setState({ 
      showOnboarding: false, 
      onboardingCompleted: true 
    });
    // Refresh the organizations list
    this.checkForOrganizations();
  };

  handleOnboardingClose = () => {
    this.setState({ showOnboarding: false });
  };

  render() {
    const { children } = this.props;
    const { showOnboarding } = this.state;

    return (
      <AppContext.Provider value={{ ...this.state, handleSearchTextChange: this.handleSearchTextChange }}>
        <div className={styles["app-layout__root"]}>
          <Navbar />
          <SideBar />
          <MainWrapper children={children} />
          
          <OnboardingModal
            open={showOnboarding}
            onClose={this.handleOnboardingClose}
            onComplete={this.handleOnboardingComplete}
          />
        </div>
      </AppContext.Provider>
    );
  }
}

export default withRouter(AppLayout);
