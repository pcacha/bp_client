import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import ButtonWithProgress from "../components/ButtonWithProgress";
import * as authActions from "../store/authActions";
import Input from "../components/Input";

/**
 * page for logging in to the system
 */
class LoginPage extends Component {

    /**
     * current page state
     */
    state = {
        username: "",
        password: "",
        apiError: {},
        pendingApiCall: false
    }

    /**
     * called on input text change
     * @param event input event
     */
    onChange = (event) => {
        // update new value in state
        this.setState({[event.target.name]: event.target.value, apiError: {}});
    }

    /**
     * called when user submit login
     */
    onClickLogin = (e) => {
        e.preventDefault();

        // extract credentials from state
        const body = {
            username: this.state.username,
            password: this.state.password,
        }
        this.setState({pendingApiCall: true});

        // send credentials to server
        this.props.login(body)
            .then(response => {
                // set new state and redirect
                this.setState({pendingApiCall: false}, () => {
                    this.props.history.push("/");
                });
            })
            .catch(error => {
                // handle errors in user input
                if (error.response) {
                    this.setState({apiError: error.response.data, pendingApiCall: false});
                }
            });
    }

    /**
     * Renders login page
     * @returns {JSX.Element} login page
     */
    render() {
        // defines whether submit button is enabled
        let disabledSubmit = false;
        if (this.state.username === "" || this.state.password === "") {
            disabledSubmit = true;
        }

        return (
            <form className="mx-auto bg-white mt-5 border rounded p-2 p-md-5 container auth-div gray-noise-background mb-3">
                <h2 className="mb-4 font-weight-bold">Log in</h2>

                <div className="form-group">
                    <Input label="Name" name="username" placeholder="Enter name"
                           value={this.state.username}
                           onChange={this.onChange}
                           hasError={this.state.apiError.username && true}
                           error={this.state.apiError.username} />
                </div>

                <div className="form-group">
                    <Input label="Password" name="password" placeholder="Enter password" type="password"
                           value={this.state.password}
                           onChange={this.onChange}
                           hasError={this.state.apiError.password && true}
                           error={this.state.apiError.password}/>
                </div>

                <ButtonWithProgress
                    className="btn btn-primary w-100 my-2"
                    onClick={(e) => this.onClickLogin(e)}
                    disabled={disabledSubmit || this.state.pendingApiCall}
                    pendingApiCall={this.state.pendingApiCall}
                    hasChildren>
                    <i className="fa fa-paper-plane" /> Log in
                </ButtonWithProgress>

                <Link to="/signup">Don't have an account? Sign up</Link>
            </form>
        );
    }
}


/**
 * maps redux state to page props
 * @param dispatch redux dispatch
 */
const mapDispatchToProps = (dispatch) => {
    return {
        login: (body) => dispatch(authActions.login(body)),
    }
}

export default connect(null, mapDispatchToProps)(LoginPage);