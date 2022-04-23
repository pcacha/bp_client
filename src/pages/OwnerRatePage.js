import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import {INFO_LABELS_IMAGES_URL} from "../shared/sharedConstants";
import parse from "html-react-parser";
import OwnerRateTranslationCard from "../components/OwnerRateTranslationCard";
import DOMPurify from 'dompurify';
import NoContentMessage from "../components/NoContentMessage";

/**
 * page for institution owner to pick official translation and like translations
 */
class OwnerRatePage extends Component {

    /**
     * current page state
     */
    state = {
        exhibitId: this.props.match.params.exhibitId,
        languageId: this.props.match.params.languageId,
        exhibit: null,
        language: "",
        translations: [],
        pendingApiCall: true,
    }

    /**
     * called when component is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch translation from server
        apiCalls.getRateOverview(this.state.exhibitId, this.state.languageId).then(response => {
            let translations = response.data.translations;
            for(let t of translations) {
                t.pendingApiCallSetOfficial = false;
            }

            // update page state with fetched translations
            this.setState({exhibit: response.data.exhibit, language: response.data.language, translations, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        });
    }

    /**
     * called when user likes/unlikes translation
     * @param translationId translation id
     */
    onLikeChange = translationId => {
        let newTranslations = [];
        const {translations} = this.state;
        let newValue;
        // set new likes counts and if it is liked for translation that caused the call
        for(let t of translations) {
            if(t.translationId !== translationId) {
                newTranslations.push(t);
            }
            else {
                newValue = !t.liked;
                if(newValue) {
                    newTranslations.push({...t, liked: newValue, likesCount: t.likesCount + 1});
                }
                else {
                    newTranslations.push({...t, liked: newValue, likesCount: t.likesCount - 1});
                }
            }
        }
        // update likes state
        this.setState({translations: newTranslations});

        // sends request to like/unlike translation to the server
        apiCalls.setLike(translationId, {value: newValue}).catch(error => {
            // handles unauthorized state
            return handleError(error);
        });
    }

    /**
     * called when official translation is changed
     * @param translationId
     */
    onOfficialChange = translationId => {
        let newTranslations = [];
        const {translations} = this.state;
        let newValue;
        // update pending api call for translation that caused this
        for(let t of translations) {
            if(t.translationId !== translationId) {
                newTranslations.push(t);
            }
            else {
                newValue = !t.isOfficial;
                newTranslations.push({...t, pendingApiCallSetOfficial: true});
            }
        }
        this.setState({translations: newTranslations});

        // send new value of official translation to server
        apiCalls.setOfficial(translationId, {value: newValue}).then(response => {
            // update official translation view
            newTranslations = [];
            const {translations} = this.state;
            for(let t of translations) {
                if(t.translationId !== translationId) {
                    newTranslations.push({...t, isOfficial: false});
                }
                else {
                    newTranslations.push({...t, pendingApiCallSetOfficial: false, isOfficial: newValue});
                }
            }
            // set new state of official translation
            this.setState({translations: newTranslations});
        })
        .catch(error => {
            // handle unauthorized state
            return handleError(error);
        });
    }

    /**
     * renders owner rate and select official translation page
     * @returns {JSX.Element} page
     */
    render() {

        // map translations to rate translation cards
        const translations = this.state.translations.map(t =>
            <OwnerRateTranslationCard key={t.translationId} {...t} onLikeChange={this.onLikeChange} onOfficialChange={this.onOfficialChange}/>
        );

        let content = <Spinner/>;
        // if there is no pending api call print translations
        if (!this.state.pendingApiCall) {
            const {name, infoLabel, infoLabelText} = this.state.exhibit;

            content = (
                <div>
                    <h3>{name}</h3>
                    <div className="mb-4">
                        <span className="font-weight-bold">Selected language: </span>
                        {this.state.language}
                    </div>

                    <div className="text-center">
                        <img className="img-fluid mt-2" src={INFO_LABELS_IMAGES_URL + infoLabel} alt="information label" />
                    </div>

                    {
                        (infoLabelText !== "") &&
                        <div className="mt-4 bg-light border rounded p-2">
                            {parse(DOMPurify.sanitize(infoLabelText))}
                        </div>
                    }

                    {
                        translations.length === 0 ?
                            <NoContentMessage classes="mt-5" text="There are no translations"/>
                            :
                            <div className="mt-3">
                                <h3 className="my-5">Translations</h3>
                                {translations}
                            </div>
                    }
                </div>
            );
        }

        // render page
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Approve Translations</h2>
                {content}
            </div>
        );
    }
}

export default OwnerRatePage;