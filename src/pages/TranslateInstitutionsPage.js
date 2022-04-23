import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import InstitutionCard from "../components/InstitutionCard";
import NoContentMessage from "../components/NoContentMessage";
import PageContentContainer from "../components/PageContentContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import PageInfo from "../components/PageInfo";

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
            content = this.state.institutions.length === 0 ? <NoContentMessage text="There are no institutions"/> : institutions;
        }

        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <li className="breadcrumb-item active">Translate - Institutions</li>
                </Breadcrumbs>

                <PageInfo name="Institutions">Choose the institution whose information labels you want to translate</PageInfo>
                {content}
            </PageContentContainer>
        );
    }
}

export default TranslateInstitutionsPage;