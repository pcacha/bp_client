import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import MyTranslationCard from "../components/MyTranslationCard";
import {Link} from "react-router-dom";
import NoContentMessage from "../components/NoContentMessage";

/**
 * page showing translations of one translation sequence
 */
class TranslationSequencePage extends Component {

    /**
     * current page state
     */
    state = {
        exhibitId: this.props.match.params.exhibitId,
        languageId: this.props.match.params.languageId,
        translations: [],
        pendingApiCall: false,
    }

    /**
     * called when user want to rollback to some point in translation sequence
     * @param translationId translation id
     * @param index index of translation
     */
    onRollback = (translationId, index) => {
        // ask before rollback
        if(window.confirm("Do you really want to rollback to this translation?")) {
            let newTranslations = [...this.state.translations];
            newTranslations[index] = {...newTranslations[index], pendingApiCall: true}
            this.setState({translations: newTranslations});

            // send request to rollback to server
            apiCalls.rollbackTranslation(translationId).then(response => {
                let newTranslations = [...this.state.translations];
                newTranslations[index] = {...newTranslations[index], pendingApiCall: false}
                newTranslations = newTranslations.slice(index);
                // update state with deleted translations
                this.setState({translations: newTranslations});
            }).catch(error => {
                // handle unauthenticated state
                return handleError(error);
            });
        }
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch translations of sequence from server
        apiCalls.getMyTranslationSequence(this.state.exhibitId, this.state.languageId).then(response => {
            const translations = response.data;
            for(let t of translations) {
                t.pendingApiCall = false;
                t.onRollback = this.onRollback;
            }
            // set fetched translations to state
            this.setState({translations, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        });
    }

    /**
     * renders transaltion sequence page
     * @returns {JSX.Element} page
     */
    render() {
        const translationsLength = this.state.translations.length;

        // map translations to translation cards
        const translations = this.state.translations.map((t, index) =>
            <MyTranslationCard key={index} order={translationsLength - index} index={index} {...t} />
        );

        // define content
        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = translationsLength === 0 ?
                <NoContentMessage text="There are no translations"/>
                :
                <>
                    <Link exact to={"/institutions/" + this.state.translations[0].institutionId + "/translate/" + this.state.exhibitId + "/" + this.state.languageId}>
                        <button type="button" className="btn btn-success mb-4 btn-lg">
                            <i className="fa fa-globe" /> Create New Version
                        </button>
                    </Link>
                    {translations}
                </>
        }

        // render page
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Translation Sequence</h2>
                {content}
            </div>
        );
    }
}

export default TranslationSequencePage;