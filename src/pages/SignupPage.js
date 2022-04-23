import React, {Component} from 'react';
import {connect} from "react-redux";
import ButtonWithProgress from "../components/ButtonWithProgress";
import * as authActions from "../store/authActions";
import Input from "../components/Input";

/**
 * page for user registration
 */
class SignupPage extends Component {

    /**
     * current page state
     */
    state = {
        username: "",
        email: "",
        password: "",
        passwordRepeat: "",
        pendingApiCall: false,
        errors: {},
        passwordRepeatConfirmed: true,
    }

    /**
     * called when is some text input changed
     * @param event input event
     */
    onChange = (event) => {
        if (event.target.name === "passwordRepeat") {
            // for password repeat
            const value = event.target.value;
            // check if passwords are the same
            const passwordRepeatConfirmed = this.state.password === value;
            const errors = {...this.state.errors};
            errors.passwordRepeat = passwordRepeatConfirmed ? "" : "Passwords do not match";
            this.setState({passwordRepeatConfirmed, errors});
        }
        else if (event.target.name === "password") {
            // for password
            const value = event.target.value;
            // check if passwords are the same
            const passwordRepeatConfirmed = this.state.passwordRepeat === value;
            const errors = {...this.state.errors};
            errors.passwordRepeat = passwordRepeatConfirmed ? "" : "Passwords do not match";
            delete errors[event.target.name];
            this.setState({passwordRepeatConfirmed, errors});
        }
        else {
            // for other fields
            const errors = {...this.state.errors};
            delete errors[event.target.name];
            this.setState({errors});
        }
        // update value
        this.setState({[event.target.name]: event.target.value});
    }

    /**
     * called when user clicks on sign up button
     */
    onClickSignup = (e) => {
        e.preventDefault();

        // extract user from state
        const user = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }
        this.setState({pendingApiCall: true});

        // send user sing up to server
        this.props.signup(user).then(response => {
            this.setState({pendingApiCall: false}, () => this.props.history.push("/"));
        }).catch(apiError => {
                // react on errors in user input
                let errors = {...this.state.errors};
                if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = {...apiError.response.data.validationErrors}
                }

                this.setState({
                    pendingApiCall: false,
                    errors
                })
            }
        );
    }

    /**
     * renders singup page
     * @returns {JSX.Element} page
     */
    render() {
        // defines if sing up btn is enabled
        let disabledSubmit = false;
        if (this.state.username === "" || this.state.email === "" || this.state.password === "" || this.state.passwordRepeat === "") {
            disabledSubmit = true;
        }

        // render page
        return (
            <div className="mx-auto bg-white mt-5 border rounded p-2 p-md-5 container auth-div gray-noise-background mb-3">
                <form>
                    <h2 className="mb-4 font-weight-bold">Sign up</h2>
                    <div className="form-group">
                        <Input
                            label="Name"
                            placeholder="Enter name" name="username" value={this.state.username}
                            onChange={this.onChange}
                            hasError={this.state.errors.username && true}
                            error={this.state.errors.username}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="E-mail"
                            placeholder="Enter e-mail" name="email" value={this.state.email}
                            onChange={this.onChange}
                            hasError={this.state.errors.email && true}
                            error={this.state.errors.email}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Password"
                            placeholder="Enter password" name="password" value={this.state.password}
                            onChange={this.onChange} type="password"
                            hasError={this.state.errors.password && true}
                            error={this.state.errors.password}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Confirm Password"
                            placeholder="Enter password again" name="passwordRepeat" value={this.state.passwordRepeat}
                            onChange={this.onChange} type="password"
                            hasError={this.state.errors.passwordRepeat && true}
                            error={this.state.errors.passwordRepeat}
                        />
                    </div>

                    <ButtonWithProgress  onClick={(e) => this.onClickSignup(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={this.state.pendingApiCall || !this.state.passwordRepeatConfirmed || disabledSubmit}
                                         pendingApiCall={this.state.pendingApiCall}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Sign up
                    </ButtonWithProgress>
                </form>
            </div>
        );
    }
}

/**
 * maps redux dispatch to page props
 * @param dispatch redux dispatch
 */
const mapDispatchToProps = (dispatch) => {
    return {
        signup: (user) => dispatch(authActions.signup(user)),
    }
}

export default connect(null, mapDispatchToProps)(SignupPage);