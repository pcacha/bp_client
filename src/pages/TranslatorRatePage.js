import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import {INFO_LABELS_IMAGES_URL} from "../shared/sharedConstants";
import parse from "html-react-parser";
import TranslatorRateTranslationCard from "../components/TranslatorRateTranslationCard";
import DOMPurify from 'dompurify';
import NoContentMessage from "../components/NoContentMessage";
import PageContentContainer from "../components/PageContentContainer";

/**
 * page for translators to rate translations of pair exhibit-language
 */
class TranslatorRatePage extends Component {

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
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch translations from server
        apiCalls.getRateOverview(this.state.exhibitId, this.state.languageId).then(response => {
            this.setState({exhibit: response.data.exhibit, language: response.data.language, translations: response.data.translations, pendingApiCall: false});
        }).catch(error => {
            // handle unauthenticated state
            return handleError(error);
        });
    }

    /**
     * called when suer likes/unlikes translation
     * @param translationId translation id
     */
    onLikeChange = translationId => {
        let newTranslations = [];
        const {translations} = this.state;
        let newValue;
        for(let t of translations) {
            if(t.translationId !== translationId) {
                newTranslations.push(t);
            }
            else {
                // set new like value
                newValue = !t.liked;
                if(newValue) {
                    // if value is true increase count likes
                    newTranslations.push({...t, liked: newValue, likesCount: t.likesCount + 1})
                }
                else {
                    // if value is negative decrease count likes
                    newTranslations.push({...t, liked: newValue, likesCount: t.likesCount - 1})
                }
            }
        }
        this.setState({translations: newTranslations});

        // send request to set like/unlike to server
        apiCalls.setLike(translationId, {value: newValue}).catch(error => {
            // handle unauthorized state
            return handleError(error);
        });
    }

    /**
     * renders page for translators to rate translations of pair exhibit-language
     * @returns {JSX.Element} page
     */
    render() {

        // map translations to translation rate cards
        const translations = this.state.translations.map(t =>
            <TranslatorRateTranslationCard key={t.translationId} {...t} onLikeChange={this.onLikeChange}/>
        );

        // define content
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
            <PageContentContainer>
                <h2 className="mb-5 font-weight-bold">Rate Translations</h2>
                {content}
            </PageContentContainer>
        );
    }
}

export default TranslatorRatePage;