import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {INFO_LABELS_IMAGES_URL} from "../shared/sharedConstants";
import parse from 'html-react-parser';
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DOMPurify from 'dompurify';

/**
 * page for creating new translations
 */
class NewTranslationPage extends Component {

    /**
     * current page state
     */
    state = {
        institutionId: this.props.match.params.institutionId,
        exhibitId: this.props.match.params.exhibitId,
        languageId: this.props.match.params.languageId,
        exhibitName: "",
        languageName: "",
        infoLabelText: "",
        infoLabel: null,
        text: "",
        pendingApiCallGetNewTranslation: false,
        pendingApiCallCreateTranslation: false,
        errors: {},
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCallGetNewTranslation: true})
        // fetch translation details from the server
        apiCalls.getNewTranslation(this.state.exhibitId, this.state.languageId).then(response => {
            // set fetched details to page state
            const {exhibitName, infoLabelText, infoLabel, text, languageName} = response.data;
            this.setState({exhibitName, infoLabelText, infoLabel, text, languageName, pendingApiCallGetNewTranslation: false});
        }).catch(error => {
            // handles unauthorized state
            return handleError(error);
        });
    }

    /**
     * called when translation is submitted
     */
    onTranslationCreate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallCreateTranslation: true});

        // send translation to server
        apiCalls.saveNewTranslation(this.state.exhibitId, this.state.languageId, {text: this.state.text}).then(response => {
            this.setState({pendingApiCallCreateTranslation: false}, () => this.props.history.push("/institutions/" + this.state.institutionId));
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle errors in user input
            let errors = {...this.state.errors};
            if (apiError.response.data && apiError.response.data.validationErrors) {
                errors = {...apiError.response.data.validationErrors}
            }
            this.setState({pendingApiCallCreateTranslation: false, errors});
        });
    }

    /**
     * called on value change in text editor
     * @param event event
     * @param editor ck editor
     */
    onTextChange = (event, editor) => {
        // set value from editor to state
        const errors = {...this.state.errors};
        delete errors["text"];
        this.setState({text: editor.getData(), errors});
    }

    /**
     * render new translation page
     * @returns {JSX.Element} page
     */
    render() {
        const {
            exhibitName,
            languageName,
            infoLabelText,
            infoLabel,
            text,
            pendingApiCallGetNewTranslation,
            pendingApiCallCreateTranslation,
            errors,
        } = this.state;

        // return spinner if api call is processing
        if (pendingApiCallGetNewTranslation) {
            return (
                <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                    <Spinner />
                </div>
            );
        }

        // render page
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">New Translation</h2>

                <h3>{exhibitName}</h3>
                <div className="mb-4">
                    <span className="font-weight-bold">Selected language: </span>
                    {languageName}
                </div>

                <div>
                    <img className="img-fluid mt-2" src={INFO_LABELS_IMAGES_URL + infoLabel} alt="information label image" />
                </div>

                {
                    (infoLabelText !== "") &&
                    <div className="mt-4 bg-light border rounded p-2">
                        {parse(DOMPurify.sanitize(infoLabelText))}
                    </div>
                }

                <form className="mt-4">
                    <div className="form-group">
                        <label>Translated text</label>
                        <CKEditor editor={ClassicEditor}
                                  config={{removePlugins: ['Table', 'CKFinder', 'Link', 'TableToolbar', 'EasyImage', 'MediaEmbed', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload']}}
                                  data={text} onChange={this.onTextChange}/>
                        {
                            errors.text &&
                            <div className="text-danger">
                                <small>{errors.text}</small>
                            </div>
                        }
                    </div>

                    <ButtonWithProgress  onClick={(e) => this.onTranslationCreate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCallCreateTranslation || text === ""}
                                         pendingApiCall={pendingApiCallCreateTranslation}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Create translation
                    </ButtonWithProgress>
                </form>
            </div>
        );
    }
}

export default NewTranslationPage;