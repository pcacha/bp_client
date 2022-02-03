import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {EXHIBITS_IMAGES_URL, INFO_LABELS_IMAGES_URL} from "../shared/sharedConstants";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class UpdateExhibitPage extends Component {

    state = {
        exhibitId: 0,
        name: "",
        infoLabelText: "",
        building: "",
        room: "",
        showcase: "",
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

    componentDidMount() {
        this.setState({pendingApiCallGetInstitution: true})
        apiCalls.getExhibit(this.props.match.params.exhibitId).then(response => {
            this.setState({...response.data, pendingApiCallGetInstitution: false});
        }).catch(error => {
            return handleError(error);
        });
    }

    onImageSelect = (event, encoded, updated) => {
        const errors = {...this.state.errors};
        delete errors[encoded];
        this.setState({errors, [event.target.name]: event.target.value, [updated]: false});
        if (event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({[encoded]: reader.result});
        }
        reader.readAsDataURL(file);
    }

    clearImage = (encode, select) => {
        const errors = {...this.state.errors};
        delete errors[encode];
        this.setState({errors, [encode]: null, [select]: ""});
    }

    onClickImageUpdate = () => {
        this.setState({pendingApiCallUpdateImage: true});
        const img = { encodedImage: this.state.encodedImage }

        apiCalls.updateExhibitImage(this.state.exhibitId, img).then(response => {
            this.setState({pendingApiCallUpdateImage: false, image: response.data.message, imageUpdated: true}, () => {
                this.clearImage("encodedImage", "imageSelect");
            });
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
            this.handleApiError(apiError, "pendingApiCallUpdateImage");
        });
    }

    handleApiError = (apiError, apiCall) => {
        if (apiError.response.data && apiError.response.data.validationErrors) {
            let errors = {
                ...this.state.errors,
                ...apiError.response.data.validationErrors
            };
            this.setState({
                [apiCall]: false,
                errors
            });
        }
    }

    onClickInfoImageUpdate = () => {
        this.setState({pendingApiCallUpdateInfoLabel: true});
        const img = { encodedImage: this.state.encodedInfoLabel }

        apiCalls.updateExhibitInfoLabelImage(this.state.exhibitId, img).then(response => {
            this.setState({pendingApiCallUpdateInfoLabel: false, infoLabel: response.data.message, infoLabelUpdated: true}, () => {
                this.clearImage("encodedInfoLabel", "infoLabelSelect");
            });
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
            if (apiError.response.data && apiError.response.data.validationErrors) {
                let errors = {
                    ...this.state.errors,
                };
                errors.encodedInfoLabel = apiError.response.data.validationErrors.encodedImage;
                this.setState({pendingApiCallUpdateInfoLabel: false, errors});
            }
        });
    }

    onChange = (event) => {
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, [event.target.name]: event.target.value, exhibitUpdated: false});
    }

    onInfoLabelTextChange = (event, editor) => {
        const errors = {...this.state.errors};
        delete errors["infoLabelText"];
        this.setState({infoLabelText: editor.getData(), exhibitUpdated: false, errors});
    }

    onClickExhibitUpdate = () => {
        this.setState({pendingApiCallUpdateInstitution: true});
        const exhibit = {
            name: this.state.name,
            infoLabelText: this.state.infoLabelText,
            building: this.state.building,
            room: this.state.room,
            showcase: this.state.showcase,
        }

        apiCalls.updateExhibit(this.state.exhibitId, exhibit).then(response => {
            this.setState({exhibitUpdated: true, pendingApiCallUpdateInstitution: false});
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
            this.handleApiError(apiError, "pendingApiCallUpdateInstitution");
        });
    }

    render() {
        const {
            name,
            infoLabelText,
            building,
            room,
            showcase,
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
                                        <ButtonWithProgress onClick={this.onClickImageUpdate}
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
                            <CKEditor editor={ClassicEditor} data={infoLabelText} onChange={this.onInfoLabelTextChange}/>
                            {
                                errors.infoLabelText &&
                                <div className="text-danger">
                                    <small>{errors.infoLabelText}</small>
                                </div>
                            }
                        </div>
                        <div className="form-group">
                            <Input
                                label="Building"
                                placeholder="Enter building" name="building" value={building}
                                onChange={this.onChange}
                                hasError={errors.building && true}
                                error={errors.building}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                label="Room"
                                placeholder="Enter room" name="room" value={room}
                                onChange={this.onChange}
                                hasError={errors.room && true}
                                error={errors.room}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                label="Show-case"
                                placeholder="Enter show-case" name="showcase" value={showcase}
                                onChange={this.onChange}
                                hasError={errors.showcase && true}
                                error={errors.showcase}
                            />
                        </div>

                        <ButtonWithProgress  onClick={this.onClickExhibitUpdate}
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

        return (
            <div className="mx-auto mt-5 border rounded p-md-5 p-2 container gray-noise-background mb-3">
                <h2 className="mb-4 font-weight-bold">Exhibit</h2>
                {content}
            </div>
        );
    }
}

export default UpdateExhibitPage;