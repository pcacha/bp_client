import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import MyTranslationCard from "../components/MyTranslationCard";
import {Link} from "react-router-dom";

class TranslationSequencePage extends Component {

    state = {
        exhibitId: this.props.match.params.exhibitId,
        languageId: this.props.match.params.languageId,
        translations: [],
        pendingApiCall: false,
    }

    onRollback = (translationId, index) => {
        if(window.confirm("Do you really want to rollback to this translation?")) {
            let newTranslations = [...this.state.translations];
            newTranslations[index] = {...newTranslations[index], pendingApiCall: true}
            this.setState({translations: newTranslations});

            apiCalls.rollbackTranslation(translationId).then(response => {
                let newTranslations = [...this.state.translations];
                newTranslations[index] = {...newTranslations[index], pendingApiCall: false}
                newTranslations = newTranslations.slice(index);
                this.setState({translations: newTranslations});
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getMyTranslationSequence(this.state.exhibitId, this.state.languageId).then(response => {
            const translations = response.data;
            for(let t of translations) {
                t.pendingApiCall = false;
                t.onRollback = this.onRollback;
            }
            this.setState({translations, pendingApiCall: false});
        }).catch(error => {
            return handleError(error);
        });
    }

    render() {
        const translationsLength = this.state.translations.length;

        const translations = this.state.translations.map((t, index) =>
            <MyTranslationCard key={index} order={translationsLength - index} index={index} {...t} />
        );

        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = translationsLength === 0 ?
                <h4>There are no translations</h4>
                :
                <>
                    <Link exact to={"/institutions/" + this.state.translations[0].institutionId + "/translate/" + this.state.exhibitId + "/" + this.state.languageId}>
                        <button type="button" className="btn btn-info mb-4 btn-lg">
                            <i className="fa fa-globe" /> Create New Version
                        </button>
                    </Link>
                    {translations}
                </>
        }

        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Translation Sequence</h2>
                {content}
            </div>
        );
    }
}

export default TranslationSequencePage;