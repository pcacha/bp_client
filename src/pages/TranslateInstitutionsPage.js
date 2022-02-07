import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import InstitutionCard from "../components/InstitutionCard";

/**
 * page of all registered institutions for translators to choose
 */
class TranslateInstitutionsPage extends Component {

    /**
     * current page state
     */
    state = {
        institutions: [],
        pendingApiCall: false,
    }

    /**
     * called when page is moutned
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch institutions from the server
        apiCalls.getAllInstitutions().then(response => {
            this.setState({institutions: response.data, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        });
    }

    /**
     * renders institutions page
     * @returns {JSX.Element} page
     */
    render() {

        // map institutions to institution cards
        const institutions = this.state.institutions.map(i =>
            <InstitutionCard key={i.institutionId} {...i} />
        );

        // define content
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