import React from "react";
import PropTypes from "prop-types";
import { login, sso } from "../../services/auth";
import { setUserPayload, resetUserPayload } from "../../config/helper";
import { history } from "../../config/history";
import Loader from "../../components/Loader";

class LoginContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, error: false, message: null };
    }

    onSubmitForm = async (values) => {
        console.log("Login form values: ", values);
        const { email, password } = values;

        // Set state to loading
        this.setState({ loading: true, error: false, message: null });

        const newState = {
            loading: false,
            error: false,
            message: null,
        };

        // Make api call
        const response = await login({ email, password });

        // If response successfull
        if (response) {
            setUserPayload(response.data);
            history.push("/home");
        } else {
            resetUserPayload();
            newState.error = true;
            newState.message = response?.message;
            this.setState(newState);
        }
    };


    onSubmitGoogleFailed = () => {
       console.log("Error connecting to google client");
        return;
    };

    onSubmitGoogle = async (values) => {
        console.log("Google form values: ", values);

        // Get tokenId from google response
        const { credential } = values;

        // Return error if token not passed
        if (!credential) {
            this.setState({ error: true, message: "You are not allowed to login!" });
            return;
        }

        // Set state to loading
        this.setState({ loading: true, error: false, message: null });

        const newState = {
            loading: false,
            error: false,
            message: null,
        };

        // Make api call
        const response = await sso({ token: credential });

        // If response successfull
        if (response) {
            setUserPayload(response.data);
            this.setState({ loading: false, error: false, message: null }, () => {
                history.push("/home");
            });
        } else {
            resetUserPayload();
            newState.error = true;
            newState.message = response?.message;
            this.setState(newState);
        }
    };

    render() {
        console.log("LoginContainer Props: ", this.props);
        console.log("LoginContainer State: ", this.state);

        const { children } = this.props;
        const { loading } = this.state;

        if (loading) {
            return <Loader />;
        }

        return React.cloneElement(children, {
            loginPayload: {
                ...this.state,
                onSubmitForm: this.onSubmitForm,
                onSubmitGoogle: this.onSubmitGoogle,
            },
        });
    }
}

LoginContainer.propTypes = {
    children: PropTypes.element.isRequired,
};

LoginContainer.defaultProps = {};

export default LoginContainer;
// import React, { useState, useContext } from "react";
// import PropTypes from "prop-types";
// import { login, sso } from "../../services/auth";
// import { AuthContext } from "../../context/AuthContext";
// import { history } from "../../config/history";
// import Loader from "../../components/Loader";

// const LoginContainer = ({ children }) => {
//   const { login: loginContext, logout } = useContext(AuthContext);

//   const [state, setState] = useState({
//     loading: false,
//     error: false,
//     message: null,
//   });

//   const onSubmitForm = async (values) => {
//     const { email, password } = values;
//     setState({ loading: true, error: false, message: null });

//     const response = await login({ email, password });

//     if (response && !response?.isError) {
//       loginContext(response.data); // ✅ updates AuthContext + localStorage
//       setState({ loading: false, error: false, message: null });
//       history.push("/");
//     } else {
//       logout();
//       setState({
//         loading: false,
//         error: true,
//         message: response?.message,
//       });
//     }
//   };

//   const onSubmitGoogle = async (values) => {
//     const { credential } = values;

//     if (!credential) {
//       setState({ loading: false, error: true, message: "You are not allowed to login!" });
//       return;
//     }

//     setState({ loading: true, error: false, message: null });

//     const response = await sso({ token: credential });

//     if (response && !response?.isError) {
//       loginContext(response.data); // ✅ updates AuthContext + localStorage
//       setState({ loading: false, error: false, message: null });
//       history.push("/");
//     } else {
//       logout();
//       setState({
//         loading: false,
//         error: true,
//         message: response?.message,
//       });
//     }
//   };

//   if (state.loading) {
//     return <Loader />;
//   }

//   return React.cloneElement(children, {
//     loginPayload: {
//       ...state,
//       onSubmitForm,
//       onSubmitGoogle,
//     },
//   });
// };

// LoginContainer.propTypes = {
//   children: PropTypes.element.isRequired,
// };

// export default LoginContainer;

