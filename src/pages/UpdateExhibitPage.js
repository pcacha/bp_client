import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {EXHIBITS_IMAGES_URL, INFO_LABELS_IMAGES_URL} from "../shared/sharedConstants";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import LocationPicker from "../components/LocationPicker";

/**
 * page for updating exhibit
 */
class UpdateExhibitPage extends Component {

    /**
     * current page state
     */
    state = {
        exhibitId: 0,
        name: "",
        infoLabelText: "",
        buildingId: null,
        roomId: null,
        showcaseId: null,
        createdAt: "",
        image: "",
        encodedImage: null,
        imageSelect: "",
        infoLabel: null,
        encodedInfoLabel: null,
        infoLabelSelect: "",
        pendingApiCallGetInstitution: false,
        pendingApiCallUpdateInstitution: false,
        pendingApiCallUpdateImage: false,
        pendingApiCallUpdateInfoLabel: false,
        exhibitUpdated: false,
        imageUpdated: false,
        infoLabelUpdated: false,
        errors: {},
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCallGetInstitution: true})
        // get exhibit info from server
        apiCalls.getExhibit(this.props.match.params.exhibitId).then(response => {
            const buildingId = response.data.building ? response.data.building.buildingId : null;
            const roomId = response.data.room ? response.data.room.roomId : null;
            const showcaseId = response.data.showcase ? response.data.showcase.showcaseId : null;
            this.setState({...response.data, pendingApiCallGetInstitution: false, buildingId, roomId, showcaseId});
        }).catch(error => {
            // handle unauthenticated state
            return handleError(error);
        });
    }

    /**
     * called when image is selected
     * @param event input event
     * @param encoded encoded image prop name
     * @param updated updated prop name
     */
    onImageSelect = (event, encoded, updated) => {
        const errors = {...this.state.errors};
        delete errors[encoded];
        // update value in state and remove errors
        this.setState({errors, [event.target.name]: event.target.value, [updated]: false});
        if (event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            // set base64 encoded image to state
            this.setState({[encoded]: reader.result});
        }
        // read image
        reader.readAsDataURL(file);
    }

    /**
     * clears image from state
     * @param encode encoded image prop name
     * @param select select image prop name
     */
    clearImage = (encode, select) => {
        const errors = {...this.state.errors};
        delete errors[encode];
        // clear image fields and delete errors
        this.setState({errors, [encode]: null, [select]: ""});
    }

    /**
     * called when user submit exhibit image to be updated
     */
    onClickImageUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUpdateImage: true});
        const img = { encodedImage: this.state.encodedImage }

        // send request to server to update exhibit image
        apiCalls.updateExhibitImage(this.state.exhibitId, img).then(response => {
            this.setState({pendingApiCallUpdateImage: false, image: response.data.message, imageUpdated: true}, () => {
                this.clearImage("encodedImage", "imageSelect");
            });
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle user input errors
            this.handleApiError(apiError, "pendingApiCallUpdateImage");
        });
    }

    /**
     * handles error from http requests
     * @param apiError error from request
     * @param apiCall name of api call
     */
    handleApiError = (apiError, apiCall) => {
        if (apiError.response.data && apiError.response.data.validationErrors) {
            // define new page errors
            let errors = {
                ...this.state.errors,
                ...apiError.response.data.validationErrors
            };
            // set errors in state
            this.setState({
                [apiCall]: false,
                errors
            });
        }
    }

    /**
     * called when user submits new exhibit info label image
     */
    onClickInfoImageUpdate = () => {
        this.setState({pendingApiCallUpdateInfoLabel: true});
        const img = { encodedImage: this.state.encodedInfoLabel }

        // send updated info label to server
        apiCalls.updateExhibitInfoLabelImage(this.state.exhibitId, img).then(response => {
            this.setState({pendingApiCallUpdateInfoLabel: false, infoLabel: response.data.message, infoLabelUpdated: true}, () => {
                this.clearImage("encodedInfoLabel", "infoLabelSelect");
            });
        }).catch(error => {
            // handles unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle error from user input
            if (apiError.response.data && apiError.response.data.validationErrors) {
                let errors = {
                    ...this.state.errors,
                };
                errors.encodedInfoLabel = apiError.response.data.validationErrors.encodedImage;
                this.setState({pendingApiCallUpdateInfoLabel: false, errors});
            }
        });
    }

    /**
     * called when text input is changed
     * @param event input event
     */
    onChange = (event) => {
        // set deleted errors and set value
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, [event.target.name]: event.target.value, exhibitUpdated: false});
    }

    /**
     * called when value in info text editor is changed
     * @param event input event
     * @param editor ck editor
     */
    onInfoLabelTextChange = (event, editor) => {
        // change value and delete errors
        const errors = {...this.state.errors};
        delete errors["infoLabelText"];
        this.setState({infoLabelText: editor.getData(), exhibitUpdated: false, errors});
    }

    /**
     * called when user wants to update info abou exhibit
     */
    onClickExhibitUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUpdateInstitution: true});
        // extract exhibit from state
        const exhibit = {
            name: this.state.name,
            infoLabelText: this.state.infoLabelText,
            buildingId: this.state.buildingId,
            roomId: this.state.roomId,
            showcaseId: this.state.showcaseId,
        }

        // send update exhibit request to server
        apiCalls.updateExhibit(this.state.exhibitId, exhibit).then(response => {
            this.setState({exhibitUpdated: true, pendingApiCallUpdateInstitution: false});
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle error in user input
            this.handleApiError(apiError, "pendingApiCallUpdateInstitution");
        });
    }

    /**
     * updates new info about selected building, room and showcase
     * @param buildingId building id
     * @param roomId room id
     * @param showcaseId showcase id
     */
    updateLocation = (buildingId, roomId, showcaseId) => {
        this.setState({buildingId, roomId, showcaseId});
    }

    /**
     * renders exhibit update page
     * @returns {JSX.Element} page
     */
    render() {
        const {
            name,
            infoLabelText,
            buildingId,
            roomId,
            showcaseId,
            image,
            encodedImage,
            imageSelect,
            infoLabel,
            encodedInfoLabel,
            infoLabelSelect,
            pendingApiCallGetInstitution,
            pendingApiCallUpdateInstitution,
            pendingApiCallUpdateImage,
            pendingApiCallUpdateInfoLabel,
            exhibitUpdated,
            imageUpdated,
            infoLabelUpdated,
            errors,
        } = this.state;

        // define content
        let content = <Spinner />;
        if(!pendingApiCallGetInstitution) {
            content = (
                <div>
                    <form className="mb-4">
                        {
                            imageUpdated &&
                            <div className="alert alert-success" role="alert">
                                Exhibit image updated
                            </div>
                        }

                        <div className="form-group">
                            <Input type="file"
                                   onlyImage
                                   value={imageSelect}
                                   name="imageSelect"
                                   label="Exhibit image"
                                   placeholder="Select exhibit image"
                                   onChange={(event) => this.onImageSelect(event, "encodedImage", "imageUpdated")}
                                   hasError={errors.encodedImage && true}
                                   error={errors.encodedImage}
                            />

                            {
                                encodedImage ?
                                    <div>
                                        <img className="img-fluid sizedImg img-thumbnail mt-2" src={encodedImage} alt="upload" />
                                        <br />
                                        <button className="btn btn-danger btn-lg mt-2" disabled={pendingApiCallUpdateImage} onClick={() => this.clearImage("encodedImage", "imageSelect")}>
                                            <i className="fa fa-times" /> Clear
                                        </button>
                                        <ButtonWithProgress onClick={(e) => this.onClickImageUpdate(e)}
                                                            className="btn btn-success btn-lg ml-2 mt-2"
                                                            disabled={pendingApiCallUpdateImage}
                                                            pendingApiCall={pendingApiCallUpdateImage}
                                                            hasChildren>
                                            <i className="fa fa-paper-plane" /> Update image
                                        </ButtonWithProgress>
                                    </div>
                                    :
                                    <div>
                                        <img className="img-fluid sizedImg img-thumbnail mt-2" src={EXHIBITS_IMAGES_URL + image} alt="upload" />
                                    </div>
                            }
                        </div>
                    </form>

                    <form className="mb-4">
                        {
                            infoLabelUpdated &&
                            <div className="alert alert-success" role="alert">
                                Information label image updated
                            </div>
                        }

                        <div className="form-group">
                            <Input type="file"
                                   onlyImage
                                   value={infoLabelSelect}
                                   name="infoLabelSelect"
                                   label="Information label image"
                                   placeholder="Select information label image"
                                   onChange={(event) => this.onImageSelect(event, "encodedInfoLabel", "infoLabelUpdated")}
                                   hasError={errors.encodedInfoLabel && true}
                                   error={errors.encodedInfoLabel}
                            />

                            {
                                encodedInfoLabel ?
                                    <div>
                                        <img className="img-fluid mt-2" src={encodedInfoLabel} alt="upload" />
                                        <br />
                                        <button className="btn btn-danger btn-lg mt-2" disabled={pendingApiCallUpdateInfoLabel} onClick={() => this.clearImage("encodedInfoLabel", "infoLabelSelect")}>
                                            <i className="fa fa-times" /> Clear
                                        </button>
                                        <ButtonWithProgress onClick={(event) => {event.preventDefault(); this.onClickInfoImageUpdate();}}
                                                            className="btn btn-success btn-lg ml-2 mt-2"
                                                            disabled={pendingApiCallUpdateImage}
                                                            pendingApiCall={pendingApiCallUpdateImage}
                                                            hasChildren>
                                            <i className="fa fa-paper-plane" /> Update information label image
                                        </ButtonWithProgress>
                                    </div>
                                    :
                                    <div>
                                        <img className="img-fluid mt-2" src={INFO_LABELS_IMAGES_URL + infoLabel} alt="upload" />
                                    </div>
                            }
                        </div>
                    </form>

                    <form className="mb-4">
                        {
                            exhibitUpdated &&
                            <div className="alert alert-success" role="alert">
                                Exhibit information updated
                            </div>
                        }

                        <div className="form-group">
                            <Input
                                label="Name"
                                placeholder="Enter name" name="name" value={name}
                                onChange={this.onChange}
                                hasError={errors.name && true}
                                error={errors.name}
                            />
                        </div>
                        <div className="form-group">
                            <label>Information label text</label>
                            <CKEditor editor={ClassicEditor}
                                      config={{removePlugins: ['Table', 'CKFinder', 'Link', 'TableToolbar', 'EasyImage', 'MediaEmbed', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload']}}
                                      data={infoLabelText} onChange={this.onInfoLabelTextChange}/>
                            {
                                errors.infoLabelText &&
                                <div className="text-danger">
                                    <small>{errors.infoLabelText}</small>
                                </div>
                            }
                        </div>
                        <div className="form-group">
                            <LocationPicker update={this.updateLocation} buildingId={buildingId} roomId={roomId} showcaseId={showcaseId} />
                        </div>

                        <ButtonWithProgress  onClick={(e) => this.onClickExhibitUpdate(e)}
                                             className="btn btn-primary w-100 my-2"
                                             disabled={pendingApiCallUpdateInstitution || name === ""}
                                             pendingApiCall={pendingApiCallUpdateInstitution}
                                             hasChildren>
                            <i className="fa fa-paper-plane" /> Update exhibit
                        </ButtonWithProgress>
                    </form>
                </div>
            )
        }

        // render page
        return (
            <div className="mx-auto mt-5 border rounded p-md-5 p-2 container gray-noise-background mb-3">
                <h2 className="mb-4 font-weight-bold">Exhibit</h2>
                {content}
            </div>
        );
    }
}

export default UpdateExhibitPage;