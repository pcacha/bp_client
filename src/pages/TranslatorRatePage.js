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
import Breadcrumbs from "../components/Breadcrumbs";
import BreadcrumbsLink from "../components/BreadcrumbsLink";
import PageInfo from "../components/PageInfo";
import ExhibitLanguageCard from "../components/ExhibitLanguageCard";

/**
 * page for translators to rate translations of pair exhibit-language
 */
class TranslatorRatePage extends Component {

    /**
     * current page state
     */
    state = {
        institutionId: this.props.match.params.institutionId,
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
                  <ExhibitLanguageCard exhibitName={name} languageName={this.state.language} />

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
                              <div className="text-center mt-5 mb-4 translations-heading py-3 px-5 d-flex flex-column-reverse justify-content-center border rounded">
                                  <h2>Translations</h2>
                              </div>
                              {translations}
                          </div>
                  }
              </div>
            );
        }

        // render page
        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <BreadcrumbsLink to="/institutions" name="Translate - Institutions"/>
                    <BreadcrumbsLink to={"/institutions/" + this.state.institutionId} name="Exhibits"/>
                    <li className="breadcrumb-item active">Rate Translations</li>
                </Breadcrumbs>

                <PageInfo name="Rate Translations">Here you can give likes to translations that you like best</PageInfo>
                {content}
            </PageContentContainer>
        );
    }
}

export default TranslatorRatePage;