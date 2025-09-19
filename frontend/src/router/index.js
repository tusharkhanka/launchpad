// src/AppRouter.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Switch, Redirect } from "react-router-dom";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { getUserPayload } from "config/helper";
// Views
import Login from "../views/Login";
import Home from "../views/Home";
import AdminPanel from "../views/AdminPanel";
import Teams from "../views/Teams";
import AppLayout from "../components/AppLayout";

import LoginContainer from "../containers/auth/LoginContainer";

const routes = [
    {
        name: "home",
        exact: true,
        path: "/home",
        component: Home,
    },
    {
        name: "admin",
        exact: true,
        path: "/admin",
        component: AdminPanel,
    },
    {
        name: "teams",
        exact: true,
        path: "/teams",
        component: Teams,
    },
]

const AppRoutes = (props) => {
    const userPayload = getUserPayload();
    console.log("userPayload", userPayload);
    if (!userPayload) return <Redirect to="/login" />;

    return (
        <AppLayout>
            <Switch>
                {routes.map((route, index) => {
                    return (
                        <Route
                            key={index}
                            exact={route.exact}
                            path={route.path}
                            component={route.component}
                            render={route.render}
                        />
                    );
                })}
            </Switch>
        </AppLayout>
    );
};


const AppRouter = () => {
    console.log("reached in router")
    return (
        // <AuthProvider>
            // <Router>
                <Switch>
                    {/* Wrap Login inside LoginContainer */}
                    <Route
                        path="/login"
                        render={(props) => (
                            <LoginContainer>
                                <Login />
                            </LoginContainer>
                        )}
                    />
                    {/* 
                    Protected Home Route
                    <ProtectedRoute exact path="/" component={Home} /> */}
                    <Route path="/home" component={AppRoutes} />

                    {/* Catch-all redirect */}
                </Switch>
            // </Router>
        // </AuthProvider>
    );
};

export default AppRouter;
