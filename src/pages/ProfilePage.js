import React, {Component} from 'react';
import Input from "../components/Input";
import * as authActions from "../store/authActions";
import {connect} from "react-redux";
import ButtonWithProgress from "../components/ButtonWithProgress";
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";

class ProfilePage extends Component {

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

    onChange = (event) => {
        if (event.target.name === "passwordRepeat") {
            const value = event.target.value;
            const passwordRepeatConfirmed = this.state.password === value;
            const errors = {...this.state.errors};
            errors.passwordRepeat = passwordRepeatConfirmed ? "" : "Passwords do not match";
            this.setState({passwordRepeatConfirmed, errors, passwordUpdated: false});
        } else if (event.target.name === "password") {
            const value = event.target.value;
            const passwordRepeatConfirmed = this.state.passwordRepeat === value;
            const errors = {...this.state.errors};
            errors.passwordRepeat = passwordRepeatConfirmed ? "" : "Passwords do not match";
            delete errors[event.target.name];
            this.setState({passwordRepeatConfirmed, errors, passwordUpdated: false});
        } else {
            const errors = {...this.state.errors};
            delete errors[event.target.name];
            this.setState({errors, userUpdated: false});
        }
        this.setState({[event.target.name]: event.target.value});
    }

    handleApiError = (apiError, apiCall) => {
        if (apiError.response.data && apiError.response.data.validationErrors) {
            let errors = {
                ...this.state.errors,
                ...apiError.response.data.validationErrors
            };
            this.setState({
                [apiCall]: false,
                errors
            });
        }
    }

    onClickUserUpdate = () => {
        this.setState({pendingApiCallUpdateUser: true});
        const {username, email} = this.state;

        apiCalls.updateUser({username, email}).then(response => {
            this.setState({pendingApiCallUpdateUser: false, userUpdated: true});
            this.props.setUsername(username);
            this.props.setEmail(email);
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
            this.handleApiError(apiError, "pendingApiCallUpdateUser");
        });
    }

    onClickPasswordUpdate = () => {
        this.setState({pendingApiCallUpdatePassword: true});
        const {password} = this.state;

        apiCalls.updatePassword({password}).then(response => {
            let errors = {...this.state.errors};
            delete errors["passwordRepeat"];
            this.setState({errors, pendingApiCallUpdatePassword: false, passwordUpdated: true, password: "", passwordRepeat: ""});
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
                this.handleApiError(apiError, "pendingApiCallUpdatePassword");
        });
    }

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

        return (
            <div className="mx-auto mt-5 border rounded p-md-5 p-2 container gray-noise-background mb-3">
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

                    <ButtonWithProgress onClick={this.onClickUserUpdate}
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

                    <ButtonWithProgress onClick={this.onClickPasswordUpdate}
                                        className="btn btn-primary w-100 my-2"
                                        disabled={pendingApiCallUpdatePassword || !passwordRepeatConfirmed || password === "" || passwordRepeat === ""}
                                        pendingApiCall={pendingApiCallUpdatePassword}
                                        hasChildren>
                        <i className="fa fa-paper-plane" /> Change password
                    </ButtonWithProgress>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUsername: (username) => dispatch(authActions.setUsername(username)),
        setEmail: (email) => dispatch(authActions.setEmail(email))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);