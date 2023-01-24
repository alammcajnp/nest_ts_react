import React, {Component} from 'react';
import {BrowserRouter, HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import AppFrame from "../app-frame/app-frame";
import AuthService from "../../service/core/auth.service";
import Wargames from "../../pages/wargames/wargames";
import Home from "../../pages/home/home";
import Donate from "../../pages/donate/donate";
import editWebsite from "../../pages/edit-website/edit-website";
import weCall from "../../pages/we-call/we-call";
import Staff from "../../pages/staff/staff";
import Alumni from "../../pages/alumni/alumni";
import contactUs from "../../pages/contact-us/contact-us";
import LoginSignup from "../../pages/login-signup";
import UserProfile from "../../pages/user-profile/user-profile";
import AdminFrame from "../admin-frame/admin-frame";
import Games from "../../pages/admin/games";
import Users from "../../pages/admin/users";
import AddGame from "../../pages/admin/add-game";
import AddLevel from "../../pages/admin/add-level";
import Levels from "../../pages/admin/levels";
import AdminLogin from "../../pages/admin/admin-login";
import ChangePassword from "../../pages/admin/change-password";


export class AppRouter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <React.Suspense fallback={<div>loading...</div>}>
                    <Router>
                        <Switch>
                            {/*** App Routes ***/}
                            <AppRoute exact path='/home' component={Home}/>
                            <AppRoute exact path='/' component={Home}/>
                            <AppRoute beforeLoginRoute={true} exact path='/login' component={LoginSignup}/>
                            <AppRoute beforeLoginRoute={true} exact path='/signup' component={LoginSignup}/>
                            <AppRoute beforeLoginRoute={true} exact path='/forget-password' component={LoginSignup}/>
                            <AppRoute beforeLoginRoute={true} exact path='/reset-password' component={LoginSignup}/>
                            <AppRoute afterLoginRoute={true} exact path='/profile' component={UserProfile}/>
                            <AppRoute exact path='/wargames' component={Wargames}/>
                            <AppRoute exact path='/wargames/:gameSlug' component={Wargames}/>
                            <AppRoute exact path='/wargames/:gameSlug/:levelSlug' component={Wargames}/>
                            <AppRoute exact path='/donate' component={Donate}/>
                            <AppRoute exact path='/edit-website' component={editWebsite}/>
                            <AppRoute exact path='/we-call' component={weCall}/>
                            <AppRoute exact path='/staff' component={Staff}/>
                            <AppRoute exact path='/alumni' component={Alumni}/>
                            <AppRoute exact path='/contact' component={contactUs}/>

                            {/*** Admin Routes ***/}
                            <AdminRoute isPublic={true} exact path='/admin' component={AdminLogin}/>
                            <AdminRoute isPublic={true} exact path='/admin/login' component={AdminLogin}/>
                            <AdminRoute exact path='/admin/games' component={Games}/>
                            <AdminRoute exact path='/admin/add-game' component={AddGame}/>
                            <AdminRoute exact path='/admin/edit-game/:id' component={AddGame}/>
                            <AdminRoute exact path='/admin/levels' component={Levels}/>
                            <AdminRoute exact path='/admin/add-level' component={AddLevel}/>
                            <AdminRoute exact path='/admin/edit-level/:id' component={AddLevel}/>
                            <AdminRoute exact path='/admin/users' component={Users}/>
                            <AdminRoute exact path='/admin/change-password' component={ChangePassword}/>

                            <AppRoute exact path='*'>
                                <Redirect to={`/`}/>
                            </AppRoute>

                        </Switch>
                    </Router>
                </React.Suspense>
            </BrowserRouter>
        );
    }
}

const AppRoute = ({beforeLoginRoute, afterLoginRoute, ...rest}) => (
    <AppFrame>
        {beforeLoginRoute ? <BeforeLoginRoute
            {...rest}
        /> : afterLoginRoute ? <AfterLoginRoute
            {...rest}
        /> : <Route
            {...rest}
        />}
    </AppFrame>
);

const AdminRoute = ({isPublic, component: Component, ...rest}) => {
    if (isPublic){
        return <AdminFrame>
            <Component {...rest}/>
        </AdminFrame>
    }

    return <AdminFrame>
        <Route
            {...rest}
            render={(props) => {
                return AuthService.isAdminLoggedIn() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{pathname: "/admin/login"}}/>
                )
            } }
        />
    </AdminFrame>
};

const BeforeLoginRoute = ({component: Component, ...rest}) => {
    return <Route
        {...rest}
        render={props =>
            AuthService.isUserLoggedIn() ? (
                <Redirect to={{pathname: "/"}}/>
            ) : (
                <Component {...props} />
            )
        }
    />
};

const AfterLoginRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            AuthService.isUserLoggedIn() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{pathname: "/"}}/>
            )
        }
    />
);
