import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import CreateInstitutionPage from "./CreateInstitutionPage";
import UpdateInstitutionPage from "./UpdateInstitutionPage";

class MyInstitutionPage extends Component {

    state = {
        institution: {},
        pendingApiCall: false,
        isOwner: false,
    };

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getMyInstitution().then(response => {
            this.setState({institution: response.data, pendingApiCall: false, isOwner: true});
        }).catch(error => {
            return handleError(error);
        }).catch(error => {
            if (error.response.data && error.response.data.message === "User does not own an institution") {
                this.setState({pendingApiCall: false, isOwner: false});
            }
        });
    }

    redirect = (path) => {
        this.props.history.push(path);
    }

    render() {
        const {pendingApiCall, institution, isOwner} = this.state;

        if(pendingApiCall) {
            return (
                <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2">
                    <Spinner/>
                </div>
            );
        }
        else if(isOwner) {
            return (
                <UpdateInstitutionPage institution={institution} redirect={this.redirect} />
            );
        }
        else {
            return (
                <CreateInstitutionPage redirect={this.redirect} />
            );
        }
    }
}

export default MyInstitutionPage;