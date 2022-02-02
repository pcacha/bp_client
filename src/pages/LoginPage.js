import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import ButtonWithProgress from "../components/ButtonWithProgress";
import * as authActions from "../store/authActions";
import Input from "../components/Input";

class LoginPage extends Component {

    state = {
        username: "",
        password: "",
        apiError: {},
        pendingApiCall: false
    }

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value, apiError: {}});
    }

    onClickLogin = () => {
        const body = {
            username: this.state.username,
            password: this.state.password,
        }
        this.setState({pendingApiCall: true});

        this.props.login(body)
            .then(response => {
                this.setState({pendingApiCall: false}, () => {
                    this.props.history.push("/");
                });
            })
            .catch(error => {
                if (error.response) {
                    this.setState({apiError: error.response.data, pendingApiCall: false});
                }
            });
    }

    render() {
        let disabledSubmit = false;
        if (this.state.username === "" || this.state.password === "") {
            disabledSubmit = true;
        }

        return (
            <form className="mx-auto bg-white mt-5 border rounded p-2 p-md-5 container auth-div gray-noise-background mb-3">
                <h4 className="mb-4 font-weight-bold">Log in</h4>

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
                    onClick={this.onClickLogin}
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


const mapDispatchToProps = (dispatch) => {
    return {
        login: (body) => dispatch(authActions.login(body)),
    }
}

export default connect(null, mapDispatchToProps)(LoginPage);