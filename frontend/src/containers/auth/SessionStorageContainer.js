import React from "react";
import PropTypes from "prop-types";
import { history } from "../../config/history";
import { getUserPayload, isAuthenticated, resetUserPayload } from "../../config/helper";

class SessionStorageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // Get userpayload from localstorage
        const userPayload = getUserPayload();

        const auth = isAuthenticated();

        if (!auth) {
            resetUserPayload();   // clears storage
            history.push("/login");
        }

        // If user not found then redirect to login
        if (!userPayload) {
            history.push("/login");
        } else {
            if (["/home", "/login"].includes(history.location.pathname)) {
                history.push("/home");
            } else {
                history.push(history.location.pathname || "/home");
            }
        }
    }

    render() {
        const { children } = this.props;

        return children;
    }
}

SessionStorageContainer.propTypes = {
    children: PropTypes.element.isRequired,
};

SessionStorageContainer.defaultProps = {};

export default SessionStorageContainer;