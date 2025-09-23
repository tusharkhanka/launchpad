// import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { AuthProvider } from "../context/AuthContext";
// import ProtectedRoute from "../router/ProtectedRoute";

// import Login from "./Login";
// import Home from "./Home";

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Switch>
//           <Route path="/login" element={<Login />} />
//           {/* <Route path="/signup" element={<Signup />} /> */}
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//             }
//           />
//         </Switch>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
import React from "react";
import { Router } from "react-router-dom";
import { history } from "../config/history";
import AppRouter from "../router/index";
import ScrollToTop from "../components/ScrollToTop";
import ClearCache from "react-clear-cache";

// Container
import SessionStorageContainer from "../containers/auth/SessionStorageContainer";

// Material Ui Theme
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";

// Material UI theme override
const theme = createTheme({
  palette: {
    primary: {
      light: "#1da1f2",
      main: "#1da1f2",
      dark: "#1da1f2",
      contrastText: "#fff",
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (process.env.REACT_APP_ENV === "production") {
      return (
        <ClearCache duration={300000}>
          {({ isLatestVersion, emptyCacheStorage }) => {
            if (!isLatestVersion) {
              emptyCacheStorage();
              return null;
            }

            return (
              <MuiThemeProvider theme={theme}>
                <SessionStorageContainer>
                  <Router history={history}>
                    <ScrollToTop />
                    <AppRouter />
                  </Router>
                </SessionStorageContainer>
              </MuiThemeProvider>
            );
          }}
        </ClearCache>
      );
    }

    return (
    //   <MuiThemeProvider theme={theme}>
        <SessionStorageContainer>
          <Router history={history}>
            <ScrollToTop />
            <AppRouter />
          </Router>
        </SessionStorageContainer>
    //   </MuiThemeProvider>
    );
  }
}

export default App;
