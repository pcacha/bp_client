import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import CreateInstitutionPage from "./CreateInstitutionPage";
import UpdateInstitutionPage from "./UpdateInstitutionPage";

/**
 * Info page of instituion that is managed by logged in user
 */
class MyInstitutionPage extends Component {

    /**
     * current page state
     */
    state = {
        institution: {},
        pendingApiCall: false,
        isOwner: false,
    };

    /**
     * Called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch institution info from server
        apiCalls.getMyInstitution().then(response => {
            this.setState({institution: response.data, pendingApiCall: false, isOwner: true});
        }).catch(error => {
            // handles unauthorized state
            return handleError(error);
        }).catch(error => {
            // handles errors
            if (error.response.data && error.response.data.message === "User does not own an institution") {
                this.setState({pendingApiCall: false, isOwner: false});
            }
        });
    }

    /**
     * utility for react browser redirecting
     * @param path path to redirect
     */
    redirect = (path) => {
        this.props.history.push(path);
    }

    /**
     * renders user's institution page
     * @returns {JSX.Element} page
     */
    render() {
        const {pendingApiCall, institution, isOwner} = this.state;

        // if fetching from server is processing show spinner
        if(pendingApiCall) {
            return (
                <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2">
                    <Spinner/>
                </div>
            );
        }
        else if(isOwner) {
            // if user is owner of an institution show update page
            return (
                <UpdateInstitutionPage institution={institution} redirect={this.redirect} />
            );
        }
        else {
            return (
                // if user does not own institution show create page
                <CreateInstitutionPage redirect={this.redirect} />
            );
        }
    }
}

export default MyInstitutionPage;