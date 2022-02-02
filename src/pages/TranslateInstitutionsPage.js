import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import InstitutionCard from "../components/InstitutionCard";

class TranslateInstitutionsPage extends Component {

    state = {
        institutions: [],
        pendingApiCall: false,
    }

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getAllInstitutions().then(response => {
            this.setState({institutions: response.data, pendingApiCall: false});
        }).catch(error => {
            return handleError(error);
        });
    }

    render() {

        const institutions = this.state.institutions.map(i =>
            <InstitutionCard key={i.institutionId} {...i} />
        );

        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.institutions.length === 0 ? <h4>There are no institutions</h4> : institutions;
        }

        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Institutions</h2>
                {content}
            </div>
        );
    }
}

export default TranslateInstitutionsPage;