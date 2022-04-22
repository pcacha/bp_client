import React, {Component} from 'react';
import {Link, NavLink} from "react-router-dom";
import NavigationItem from "../components/NavigationItem";
import {connect} from "react-redux";
import * as authActions from "../store/authActions";

/**
 * web navigation
 */
class Navigation extends Component {

    // renders navigation in the top of webpage
    render() {
        const {user} = this.props;

        // render navigation
        return (
            <div className="position-sticky w-100 fixed-header">
                <nav className="blue-nav navbar navbar-expand-lg navbar-light" id="blue-nav">
                    <div className="container">
                        <Link className="navbar-brand" to="/">CTS</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto d-flex align-items-center">
                                <NavigationItem exact to="/">Home</NavigationItem>
                                {user.isAdmin && <NavigationItem to="/users">Users</NavigationItem>}
                                {user.isTranslator && <NavigationItem to="/institutions">Translate</NavigationItem>}
                                {user.isInstitutionOwner && <NavigationItem to="/approve">Approve</NavigationItem>}
                                {
                                    user.isLoggedIn ?
                                        <li className="nav-item dropdown">
                                            <a className="nav-link" id="navbarDropdown" role="button" href="/#"
                                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                {user.username + " "}
                                                <i className="fa fa-user" aria-hidden="true"/>
                                            </a>

                                            <div className="my-dropdown dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                                {
                                                    user.isTranslator &&
                                                    <NavLink className="dropdown-item" to="/myTranslations">
                                                        <i className="fa fa-globe" /> My Translations
                                                    </NavLink>
                                                }
                                                <NavLink className="dropdown-item" to="/myInstitution">
                                                    <i className="fa fa-home" /> My Institution
                                                </NavLink>
                                                <NavLink className="dropdown-item" to="/profile">
                                                    <i className="fa fa-user" /> My Profile
                                                </NavLink>
                                                <div className="dropdown-divider"/>
                                                <a onClick={(e) => {e.preventDefault(); this.props.logout();}} href="/#" className="dropdown-item" id="logout">
                                                    <i className="fa fa-sign-out" /> Logout
                                                </a>
                                            </div>
                                        </li>
                                        :
                                        <>
                                            <NavigationItem to="/signup">Signup</NavigationItem>
                                            <NavigationItem to="/login">Login</NavigationItem>
                                        </>
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

/**
 * maps redux state to props
 * @param state redux state
 */
const mapStateToProps = (state) => {
    return {
        user: state,
    };
}

/**
 * maps redux dispatch to props
 * @param dispatch redux dispatch
 */
const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(authActions.logout()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);