import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import TranslateExhibitCard from "../components/TranslateExhibitCard";
import NoContentMessage from "../components/NoContentMessage";

/**
 * page containing exhibits to translate in allowed languages
 */
class TranslateExhibitPage extends Component {

    /**
     * current page state
     */
    state = {
        languages: [],
        exhibits: [],
        pendingApiCall: false,
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch exhibits and languages from server
        apiCalls.getExhibitsTranslate(this.props.match.params.institutionId).then(response => {
            let languages = response.data.languages;

            // add default props to exhibits
            let exhibits = response.data.exhibits;
            for(let ex of exhibits) {
                ex.buttonsDisabled = true;
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
     * Called when user selects language
     * @param exhibitId exhibit id
     * @param languageId language id
     */
    selectLang = (exhibitId, languageId) => {
        let exhibits = [];
        // update selected language for given exhibit in state
        for(let ex of this.state.exhibits) {
            if(ex.exhibitId !== exhibitId) {
                exhibits.push(ex);
            }
            else {
                // change language to value from param
                exhibits.push({...ex, lang: languageId, buttonsDisabled: false});
            }
        }
        this.setState({exhibits});
    }

    /**
     * renders page with exhibits to translate to allowed languages
     * @returns {JSX.Element} page
     */
    render() {

        // map exhibits to translate exhibits cards
        const exhibits = this.state.exhibits.map(ex =>
            <TranslateExhibitCard key={ex.exhibitId} {...ex} languages={this.state.languages} institutionId={this.props.match.params.institutionId} />
        );

        // define content
        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.exhibits.length === 0 ? <NoContentMessage text="There are no exhibits"/>: exhibits;
        }

        // render pge
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Exhibits</h2>
                {content}
            </div>
        );
    }
}

export default TranslateExhibitPage;