import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";

class UserDetailPage extends Component {

    state = {
        userId: this.props.match.params.userId,
        username: "",
        email: "",
        createdAt: null,
        isBanned: false,
        isTranslator: true,
        isInstitutionOwner: false,
        institutionName: "",
        pendingApiCall: true,
        pendingApiCallUsernameUpdate: false,
        pendingApiCallChangePassword: false,
        pendingApiCallTranslator: false,
        pendingApiCallBan: false,
        pendingApiCallRemoveInstitution: false,
        usernameUpdated: false,
        errors: {},
    }

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getUser(this.state.userId).then(response => {
            const {
                username,
                email,
                createdAt,
                isBanned,
                isTranslator,
                isInstitutionOwner,
                institutionName
            } = response.data;

            this.setState({username, email, createdAt, isBanned, isTranslator, isInstitutionOwner, institutionName, pendingApiCall: false});
        }).catch(error => {
            return handleError(error);
        })
    }

    onChange = (event) => {
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, usernameUpdated: false, [event.target.name]: event.target.value});
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

    onClickUsernameUpdate = () => {
        this.setState({pendingApiCallUsernameUpdate: true});

        apiCalls.adminUpdateUsername(this.state.userId, {username: this.state.username}).then(response => {
            this.setState({pendingApiCallUsernameUpdate: false, usernameUpdated: true});
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
            this.handleApiError(apiError, "pendingApiCallUsernameUpdate");
        });
    }

    onPasswordChange = () => {
        const {username, email} = this.state;
        if(window.confirm("Do you really want to generate new password for user " + username + " and send it to mail: " + email)) {
            this.setState({pendingApiCallChangePassword: true});

            apiCalls.adminChangePassword(this.state.userId).then(response => {
                this.setState({pendingApiCallChangePassword: false});
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    onTranslatorChange = () => {
        const {userId, isTranslator} = this.state;
        if(window.confirm("Do you really want to change translator rights?")) {
            this.setState({pendingApiCallTranslator: true});

            apiCalls.adminChangeTranslator(userId, {value: !isTranslator}).then(response => {
                this.setState({pendingApiCallTranslator: false, isTranslator: !isTranslator});
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    onBanChange = () => {
        const {userId, isBanned} = this.state;
        if(window.confirm("Do you really want to change access rights?")) {
            this.setState({pendingApiCallBan: true});

            apiCalls.adminChangeBan(userId, {value: !isBanned}).then(response => {
                this.setState({pendingApiCallBan: false, isBanned: !isBanned});
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    onInstitutionRemove = () => {
        const {userId, institutionName} = this.state;
        if(window.confirm("Do you really want to remove managerial rights? It may cause deletion of institution: " + institutionName)) {
            this.setState({pendingApiCallRemoveInstitution: true});

            apiCalls.adminRemoveInstitution(userId).then(response => {
                this.setState({pendingApiCallRemoveInstitution: false, isInstitutionOwner: false, institutionName: ""});
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    render() {
        const {
            username,
            email,
            createdAt,
            isBanned,
            isTranslator,
            isInstitutionOwner,
            institutionName,
            pendingApiCall,
            pendingApiCallUsernameUpdate,
            pendingApiCallChangePassword,
            pendingApiCallTranslator,
            pendingApiCallBan,
            pendingApiCallRemoveInstitution,
            usernameUpdated,
            errors
        } = this.state;

        let content = <Spinner/>;
        if (!pendingApiCall) {
            content =
                <div>
                    <div className="mb-4">
                        <span className="font-weight-bold">Registration date: </span>
                        {new Date(createdAt).toLocaleDateString("en-US")}
                    </div>

                    <form className="mb-4">
                        {
                            usernameUpdated &&
                            <div className="alert alert-success" role="alert">
                                Username updated
                            </div>
                        }

                        <div className="form-group">
                            <Input
                                label="Name"
                                placeholder="Enter name" name="username" value={username}
                                onChange={this.onChange}
                                hasError={errors.username && true}
                                error={errors.username}
                            />
                        </div>

                        <ButtonWithProgress  onClick={this.onClickUsernameUpdate}
                                             className="btn btn-primary w-100 my-2"
                                             disabled={pendingApiCallUsernameUpdate || username === ""}
                                             pendingApiCall={pendingApiCallUsernameUpdate}
                                             hasChildren>
                            <i className="fa fa-paper-plane" /> Update username
                        </ButtonWithProgress>
                    </form>

                    <h5>Password Change</h5>
                    <p>Generate new password and send it to email: <span className="font-weight-bold">{email}</span></p>
                    <ButtonWithProgress  onClick={this.onPasswordChange}
                                         className="btn btn-danger btn-lg my-1"
                                         disabled={pendingApiCallChangePassword}
                                         pendingApiCall={pendingApiCallChangePassword}
                                         hasChildren>
                        <i className="fa fa-key"/> Generate new password
                    </ButtonWithProgress>

                    <h5 className="mt-4">Translator Rights</h5>
                    <p>Change user's right to translate</p>
                    <ButtonWithProgress  onClick={this.onTranslatorChange}
                                         className={"btn btn-lg my-1 " + (isTranslator ? "btn-primary" : "btn-secondary")}
                                         disabled={pendingApiCallTranslator}
                                         pendingApiCall={pendingApiCallTranslator}
                                         hasChildren>
                        <i className="fa fa-globe"/> {isTranslator ? "Translator rights on" : "Translator rights off"}
                    </ButtonWithProgress>

                    {
                        isInstitutionOwner &&
                        <>
                            <h5 className="mt-4">Institution</h5>
                            <p>User is a manager of: <span className="font-weight-bold">{institutionName}</span></p>
                            <ButtonWithProgress  onClick={this.onInstitutionRemove}
                                                 className="btn btn-lg my-1 btn-danger"
                                                 disabled={pendingApiCallRemoveInstitution}
                                                 pendingApiCall={pendingApiCallRemoveInstitution}
                                                 hasChildren>
                                <i className="fa fa-times"/> Remove managerial rights
                            </ButtonWithProgress>
                        </>
                    }

                    <h5 className="mt-4">Ban</h5>
                    <p>Change user's access to the system</p>
                    <ButtonWithProgress  onClick={this.onBanChange}
                                         className={"btn btn-lg my-1 " + (isBanned ? "btn-danger" : "btn-primary")}
                                         disabled={pendingApiCallBan}
                                         pendingApiCall={pendingApiCallBan}
                                         hasChildren>
                        <i className="fa fa-user"/> {isBanned ? "Banned" : "Access allowed"}
                    </ButtonWithProgress>
                </div>
        }

        return (
            <div className="mx-auto mt-5 border rounded p-md-5 p-2 container gray-noise-background mb-3">
                <h2 className="mb-5">User Details</h2>
                {content}
            </div>
        );
    }
}

export default UserDetailPage;