import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import PageContentContainer from "../components/PageContentContainer";

/**
 * page for viewing details about user
 */
class UserDetailPage extends Component {

    /**
     * current page state
     */
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

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // get user details from server
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
            // handle unauthorized state
            return handleError(error);
        })
    }

    /**
     * called when text inputs are changed
     * @param event
     */
    onChange = (event) => {
        // delete errors and set new value
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, usernameUpdated: false, [event.target.name]: event.target.value});
    }

    /**
     * handles error from http request
     * @param apiError error
     * @param apiCall api call name
     */
    handleApiError = (apiError, apiCall) => {
        if (apiError.response.data && apiError.response.data.validationErrors) {
            // add errors
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

    /**
     * called when admin updates username
     */
    onClickUsernameUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUsernameUpdate: true});

        // send request to server to update username
        apiCalls.adminUpdateUsername(this.state.userId, {username: this.state.username}).then(response => {
            this.setState({pendingApiCallUsernameUpdate: false, usernameUpdated: true});
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle input errors
            this.handleApiError(apiError, "pendingApiCallUsernameUpdate");
        });
    }

    /**
     * called when admin wants to change user's password by sending it to mail
     */
    onPasswordChange = () => {
        const {username, email} = this.state;
        // ask before changing password
        if(window.confirm("Do you really want to generate a new password for user " + username + " and send it to this e-mail: " + email)) {
            this.setState({pendingApiCallChangePassword: true});

            // send request to change password by sending new password to user's mail
            apiCalls.adminChangePassword(this.state.userId).then(response => {
                this.setState({pendingApiCallChangePassword: false});
            }).catch(error => {
                // handle unauthorized state
                return handleError(error);
            });
        }
    }

    /**
     * called when admin wants to change user's rights to translate
     */
    onTranslatorChange = () => {
        const {userId, isTranslator} = this.state;
        // ask before changing rights
        if(window.confirm("Do you really want to change translation rights?")) {
            this.setState({pendingApiCallTranslator: true});

            // send request to server to change user's translation rights
            apiCalls.adminChangeTranslator(userId, {value: !isTranslator}).then(response => {
                this.setState({pendingApiCallTranslator: false, isTranslator: !isTranslator});
            }).catch(error => {
                // handle unauthorized state
                return handleError(error);
            });
        }
    }

    /**
     * called when admin wants to change user's ban
     */
    onBanChange = () => {
        const {userId, isBanned} = this.state;
        // ask before changing ban
        if(window.confirm("Do you really want to change access rights?")) {
            this.setState({pendingApiCallBan: true});

            // send request to change ban of user to server
            apiCalls.adminChangeBan(userId, {value: !isBanned}).then(response => {
                this.setState({pendingApiCallBan: false, isBanned: !isBanned});
            }).catch(error => {
                // handle unauthorized state
                return handleError(error);
            });
        }
    }

    /**
     * called when admin wants to remove institution from user
     */
    onInstitutionRemove = () => {
        // ask before removing institution
        const {userId, institutionName} = this.state;
        if(window.confirm("Do you really want to remove managerial rights? It may cause deletion of this institution: " + institutionName)) {
            this.setState({pendingApiCallRemoveInstitution: true});

            // send request to server to remove institution management to server
            apiCalls.adminRemoveInstitution(userId).then(response => {
                this.setState({pendingApiCallRemoveInstitution: false, isInstitutionOwner: false, institutionName: ""});
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    /**
     * renders user details page
     * @returns {JSX.Element} page
     */
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

        // define content
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
                                label="Username"
                                placeholder="Enter name" name="username" value={username}
                                onChange={this.onChange}
                                hasError={errors.username && true}
                                error={errors.username}
                            />
                        </div>

                        <ButtonWithProgress  onClick={(e) => this.onClickUsernameUpdate(e)}
                                             className="btn btn-primary w-100 my-2"
                                             disabled={pendingApiCallUsernameUpdate || username === ""}
                                             pendingApiCall={pendingApiCallUsernameUpdate}
                                             hasChildren>
                            <i className="fa fa-paper-plane" /> Update username
                        </ButtonWithProgress>
                    </form>

                    <div className="card thick-top-border border-dark no-rounded thick-side-borders my-rounded-top no-bottom-border">
                        <div className="card-body">
                            <h5>Password Change</h5>
                            <p>Generate a new password and send it to an e-mail address: <span className="font-weight-bold">{email}</span></p>
                            <ButtonWithProgress  onClick={this.onPasswordChange}
                                                 className="btn btn-danger btn-lg my-1"
                                                 disabled={pendingApiCallChangePassword}
                                                 pendingApiCall={pendingApiCallChangePassword}
                                                 hasChildren>
                                <i className="fa fa-key"/> Generate new password
                            </ButtonWithProgress>
                        </div>
                    </div>

                    <div className="card thick-side-borders border-dark no-rounded no-bottom-border">
                        <div className="card-body">
                            <h5>Translation Rights</h5>
                            <p>Change user's right to translate</p>
                            <ButtonWithProgress  onClick={this.onTranslatorChange}
                                                 className={"btn btn-lg my-1 " + (isTranslator ? "btn-primary" : "btn-secondary")}
                                                 disabled={pendingApiCallTranslator}
                                                 pendingApiCall={pendingApiCallTranslator}
                                                 hasChildren>
                                <i className="fa fa-globe"/> {isTranslator ? "Translation rights on" : "Translation rights off"}
                            </ButtonWithProgress>
                        </div>
                    </div>

                    {
                        isInstitutionOwner &&
                        <div className="card thick-side-borders border-dark no-rounded no-bottom-border">
                            <div className="card-body">
                                <h5>Institution</h5>
                                <p>The user is a manager of: <span className="font-weight-bold">{institutionName}</span></p>
                                <ButtonWithProgress  onClick={this.onInstitutionRemove}
                                                     className="btn btn-lg my-1 btn-danger"
                                                     disabled={pendingApiCallRemoveInstitution}
                                                     pendingApiCall={pendingApiCallRemoveInstitution}
                                                     hasChildren>
                                    <i className="fa fa-times"/> Remove managerial rights
                                </ButtonWithProgress>
                            </div>
                        </div>
                    }

                    <div className="card thick-side-borders border-dark no-rounded thick-bottom-border my-rounded-bottom">
                        <div className="card-body">
                            <h5>Ban</h5>
                            <p>Change user's access to the system</p>
                            <ButtonWithProgress  onClick={this.onBanChange}
                                                 className={"btn btn-lg my-1 " + (isBanned ? "btn-danger" : "btn-primary")}
                                                 disabled={pendingApiCallBan}
                                                 pendingApiCall={pendingApiCallBan}
                                                 hasChildren>
                                <i className="fa fa-user"/> {isBanned ? "Banned" : "Access allowed"}
                            </ButtonWithProgress>
                        </div>
                    </div>
                </div>
        }

        // render page
        return (
            <PageContentContainer>
                <h2 className="mb-5">User Details</h2>
                {content}
            </PageContentContainer>
        );
    }
}

export default UserDetailPage;