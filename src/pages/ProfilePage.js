import React, {Component} from 'react';
import Input from "../components/Input";
import * as authActions from "../store/authActions";
import {connect} from "react-redux";
import ButtonWithProgress from "../components/ButtonWithProgress";
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import PageContentContainer from "../components/PageContentContainer";
import Breadcrumbs from "../components/Breadcrumbs";

/**
 * page with user's profile
 */
class ProfilePage extends Component {

    /**
     * current page state
     */
    state = {
        username: this.props.user.username,
        email: this.props.user.email,
        password: "",
        passwordRepeat: "",
        passwordRepeatConfirmed: true,
        pendingApiCallUpdateUser: false,
        pendingApiCallUpdatePassword: false,
        userUpdated: false,
        passwordUpdated: false,
        errors: {},
    }

    /**
     * called when some of the text inputs change value
     * @param event input event
     */
    onChange = (event) => {
        if (event.target.name === "passwordRepeat") {
            // for password repeat input
            const value = event.target.value;
            // checks if passwords are the same
            const passwordRepeatConfirmed = this.state.password === value;
            const errors = {...this.state.errors};
            errors.passwordRepeat = passwordRepeatConfirmed ? "" : "Passwords do not match";
            this.setState({passwordRepeatConfirmed, errors, passwordUpdated: false});
        } else if (event.target.name === "password") {
            // for password input
            const value = event.target.value;
            // check if password are the same
            const passwordRepeatConfirmed = this.state.passwordRepeat === value;
            const errors = {...this.state.errors};
            errors.passwordRepeat = passwordRepeatConfirmed ? "" : "Passwords do not match";
            delete errors[event.target.name];
            // update password confirmed value and errors
            this.setState({passwordRepeatConfirmed, errors, passwordUpdated: false});
        } else {
            // for other fields
            const errors = {...this.state.errors};
            delete errors[event.target.name];
            this.setState({errors, userUpdated: false});
        }
        // change value for input
        this.setState({[event.target.name]: event.target.value});
    }

    /**
     * handles error from http request
     * @param apiError error
     * @param apiCall api call name
     */
    handleApiError = (apiError, apiCall) => {
        if (apiError.response.data && apiError.response.data.validationErrors) {
            let errors = {
                ...this.state.errors,
                ...apiError.response.data.validationErrors
            };
            // set new errors and set api call to false
            this.setState({
                [apiCall]: false,
                errors
            });
        }
    }

    /**
     * called when user submit user info update
     */
    onClickUserUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUpdateUser: true});
        const {username, email} = this.state;

        // sends updated info to server
        apiCalls.updateUser({username, email}).then(response => {
            this.setState({pendingApiCallUpdateUser: false, userUpdated: true});
            this.props.setUsername(username);
            this.props.setEmail(email);
        }).catch(error => {
            // handles unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle errors in input
            this.handleApiError(apiError, "pendingApiCallUpdateUser");
        });
    }

    /**
     * called when user submit password update
     */
    onClickPasswordUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUpdatePassword: true});
        const {password} = this.state;

        // sends new password to server
        apiCalls.updatePassword({password}).then(response => {
            let errors = {...this.state.errors};
            delete errors["passwordRepeat"];
            this.setState({errors, pendingApiCallUpdatePassword: false, passwordUpdated: true, password: "", passwordRepeat: ""});
        }).catch(error => {
            // handles unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle errors in input
            this.handleApiError(apiError, "pendingApiCallUpdatePassword");
        });
    }

    /**
     * renders user profile page
     * @returns {JSX.Element} page
     */
    render() {
        const {
            username,
            email,
            password,
            passwordRepeat,
            pendingApiCallUpdateUser,
            pendingApiCallUpdatePassword,
            passwordRepeatConfirmed,
            userUpdated,
            passwordUpdated,
            errors,
        } = this.state;
        const {createdAt} = this.props.user;

        // render page
        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <li className="breadcrumb-item active">My Profile</li>
                </Breadcrumbs>

                <h2 className="mb-4 font-weight-bold">My Profile</h2>

                <div className="mb-4">
                    <span className="font-weight-bold">Registration date: </span>
                    {new Date(createdAt * 1).toLocaleDateString("en-US")}
                </div>

                <form className="mb-4">
                    {
                        userUpdated &&
                        <div className="alert alert-success" role="alert">
                            Personal information has been updated
                        </div>
                    }

                    <div className="form-group">
                        <Input label="Name" name="username"
                               value={username}
                               onChange={this.onChange} hasError={errors.username && true}
                               error={errors.username}/>
                    </div>

                    <div className="form-group">
                        <Input label="E-mail" name="email"
                               value={email}
                               onChange={this.onChange} hasError={errors.email && true}
                               error={errors.email}/>
                    </div>

                    <ButtonWithProgress onClick={(e) => this.onClickUserUpdate(e)}
                                        className="btn btn-primary w-100 my-2"
                                        disabled={pendingApiCallUpdateUser || username === "" || email === ""}
                                        pendingApiCall={pendingApiCallUpdateUser}
                                        hasChildren>
                        <i className="fa fa-paper-plane" /> Update information
                    </ButtonWithProgress>
                </form>

                <form>
                    {
                        passwordUpdated &&
                        <div className="alert alert-success" role="alert">
                            Password ha been updated
                        </div>
                    }

                    <div className="form-group">
                        <Input
                            label="Password"
                            placeholder="Enter password" name="password" value={password}
                            onChange={this.onChange} type="password"
                            hasError={errors.password && true}
                            error={errors.password}
                        />
                    </div>

                    <div className="form-group">
                        <Input
                            label="Confirm Password"
                            placeholder="Enter password again" name="passwordRepeat" value={passwordRepeat}
                            onChange={this.onChange} type="password"
                            hasError={errors.passwordRepeat && true}
                            error={errors.passwordRepeat}
                        />
                    </div>

                    <ButtonWithProgress onClick={(e) => this.onClickPasswordUpdate(e)}
                                        className="btn btn-primary w-100 my-2"
                                        disabled={pendingApiCallUpdatePassword || !passwordRepeatConfirmed || password === "" || passwordRepeat === ""}
                                        pendingApiCall={pendingApiCallUpdatePassword}
                                        hasChildren>
                        <i className="fa fa-paper-plane" /> Change password
                    </ButtonWithProgress>
                </form>
            </PageContentContainer>
        );
    }
}

/**
 * map redux state to page props
 * @param state redux state
 */
const mapStateToProps = (state) => {
    return {
        user: state,
    };
}

/**
 * map redux dispatch to props
 * @param dispatch redux dispatch
 */
const mapDispatchToProps = (dispatch) => {
    return {
        setUsername: (username) => dispatch(authActions.setUsername(username)),
        setEmail: (email) => dispatch(authActions.setEmail(email))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);