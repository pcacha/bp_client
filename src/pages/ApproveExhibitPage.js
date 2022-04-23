import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import ApproveExhibitCard from "../components/ApproveExhibitCard";
import NoContentMessage from "../components/NoContentMessage";
import PageContentContainer from "../components/PageContentContainer";

/**
 * Page for rendering exhibits where official text can be set
 */
class ApproveExhibitPage extends Component {

    /**
     * current page state
     */
    state = {
        languages: [],
        exhibits: [],
        pendingApiCall: false,
    }

    /**
     * Called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // get exhibits to approve from server
        apiCalls.getExhibitsApproveTranslations().then(response => {
            let languages = response.data.languages;

            // set default props to fetched exhibits
            let exhibits = response.data.exhibits;
            for(let ex of exhibits) {
                ex.buttonDisabled = true;
                ex.lang = -1;
                ex.selectLang = this.selectLang;
            }

            this.setState({languages, exhibits, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        });
    }

    /**
     * called when language is selected
     * @param exhibitId exhibit id
     * @param languageId language id
     */
    selectLang = (exhibitId, languageId) => {
        let exhibits = [];
        for(let ex of this.state.exhibits) {
            if(ex.exhibitId !== exhibitId) {
                exhibits.push(ex);
            }
            else {
                // set language for exhibit
                exhibits.push({...ex, lang: languageId, buttonDisabled: false});
            }
        }
        // update state
        this.setState({exhibits});
    }

    /**
     * renders page with exhibits where official text can be set
     * @returns {JSX.Element} page
     */
    render() {

        // map exhibits to its view cards
        const exhibits = this.state.exhibits.map(ex =>
            <ApproveExhibitCard key={ex.exhibitId} {...ex} languages={this.state.languages} />
        );

        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            // if fetching data ended show fetched exhibits or message that there are none
            content = this.state.exhibits.length === 0 ? <NoContentMessage text="There are no exhibits"/> : exhibits;
        }

        // render page
        return (
            <PageContentContainer>
                <h2 className="mb-5 font-weight-bold">Exhibits</h2>
                {content}
            </PageContentContainer>
        );
    }
}

export default ApproveExhibitPage;