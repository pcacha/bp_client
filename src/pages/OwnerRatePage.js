import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import {INFO_LABELS_IMAGES_URL} from "../shared/sharedConstants";
import parse from "html-react-parser";
import OwnerRateTranslationCard from "../components/OwnerRateTranslationCard";

class OwnerRatePage extends Component {

    state = {
        exhibitId: this.props.match.params.exhibitId,
        languageId: this.props.match.params.languageId,
        exhibit: null,
        language: "",
        translations: [],
        pendingApiCall: true,
    }

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getRateOverview(this.state.exhibitId, this.state.languageId).then(response => {
            let translations = response.data.translations;
            for(let t of translations) {
                t.pendingApiCallSetOfficial = false;
            }

            this.setState({exhibit: response.data.exhibit, language: response.data.language, translations, pendingApiCall: false});
        }).catch(error => {
            return handleError(error);
        });
    }

    onLikeChange = translationId => {
        let newTranslations = [];
        const {translations} = this.state;
        let newValue;
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
        this.setState({translations: newTranslations});

        apiCalls.setLike(translationId, {value: newValue}).catch(error => {
            return handleError(error);
        });
    }

    onOfficialChange = translationId => {
        let newTranslations = [];
        const {translations} = this.state;
        let newValue;
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

        apiCalls.setOfficial(translationId, {value: newValue}).then(response => {
            newTranslations = [];
            const {translations} = this.state;
            for(let t of translations) {
                if(t.translationId !== translationId) {
                    newTranslations.push({...t, isOfficial: false});
                }
                else {
                    newTranslations.push({...t, pendingApiCallSetOfficial: false, isOfficial: true});
                }
            }
            this.setState({translations: newTranslations});
        })
        .catch(error => {
            return handleError(error);
        });
    }

    render() {

        const translations = this.state.translations.map(t =>
            <OwnerRateTranslationCard key={t.translationId} {...t} onLikeChange={this.onLikeChange} onOfficialChange={this.onOfficialChange}/>
        );

        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            const {name, infoLabel, infoLabelText} = this.state.exhibit;

            content = (
                <div>
                    <h3>{name}</h3>
                    <div className="mb-4">
                        <span className="font-weight-bold">Selected language: </span>
                        {this.state.language}
                    </div>

                    <div>
                        <img className="img-fluid mt-2" src={INFO_LABELS_IMAGES_URL + infoLabel} alt="information label image" />
                    </div>

                    {
                        (infoLabelText !== "") &&
                        <div className="mt-4 bg-light border rounded p-2">
                            {parse(infoLabelText)}
                        </div>
                    }

                    {
                        translations.length === 0 ?
                            <h4 className="mt-5">There are no translations</h4>
                            :
                            <div className="mt-3">
                                <h3 className="my-5">Translations</h3>
                                {translations}
                            </div>
                    }
                </div>
            );
        }

        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Approve Translations</h2>
                {content}
            </div>
        );
    }
}

export default OwnerRatePage;