import React, {Component} from 'react';
import * as authActions from "../store/authActions";
import {connect} from "react-redux";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {INSTITUTIONS_IMAGES_URL} from "../shared/sharedConstants";
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import { Link } from "react-router-dom";

/**
 * page for updating institution
 */
class UpdateInstitutionPage extends Component {

    /**
     * current page state
     */
    state = {
        name: this.props.institution.name,
        address: this.props.institution.address,
        description: this.props.institution.description,
        latitudeString: this.props.institution.latitude,
        longitudeString: this.props.institution.longitude,
        image: this.props.institution.image,
        encodedImage: null,
        imageSelect: "",
        createdAt: this.props.institution.createdAt,
        email: "",
        pendingApiCallUpdateInstitution: false,
        pendingApiCallUpdateImage: false,
        pendingApiCallDeleteInstitution: false,
        pendingApiCallAddManager: false,
        institutionUpdated: false,
        imageUpdated: false,
        managerAdded: false,
        errors: {},
    }

    /**
     * called when new institution image is selected
     * @param event input event
     */
    onImageSelect = (event) => {
        // delete errors and update value in state
        const errors = {...this.state.errors};
        delete errors["encodedImage"];
        this.setState({errors, [event.target.name]: event.target.value, imageUpdated: false});
        if (event.target.files.length === 0) {
            return;
        }

        // read selected image if exists
        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            // set base64 encoded image to tate
            this.setState({encodedImage: reader.result});
        }
        reader.readAsDataURL(file);
    }

    /**
     * clear image from state
     */
    clearImage = () => {
        // delete errors and clear image fields from state
        const errors = {...this.state.errors};
        delete errors["encodedImage"];
        this.setState({errors, encodedImage: null, imageSelect: "",});
    }

    /**
     * handles error from http request
     * @param apiError error
     * @param apiCall api call name
     */
    handleApiError = (apiError, apiCall) => {
        if (apiError.response.data && apiError.response.data.validationErrors) {
            let errors = {
                ...this.state.errors,
                ...apiError.response.data.validationErrors
            };
            // update input errors and api call state
            this.setState({
                [apiCall]: false,
                errors
            });
        }
    }

    /**
     * called when user submit institution image update
     */
    onClickImageUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUpdateImage: true});
        const img = { encodedImage: this.state.encodedImage }

        // send request to update image to server
        apiCalls.updateInstitutionImage(img).then(response => {
            this.setState({pendingApiCallUpdateImage: false, image: response.data.message, imageUpdated: true}, () => {
                this.clearImage();
            });
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle errors in input
            this.handleApiError(apiError, "pendingApiCallUpdateImage");
        });
    }

    /**
     * called when value in text inputs is changed
     * @param event input event
     */
    onChange = event => {
        // delete errors and update value in state
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, institutionUpdated: false, [event.target.name]: event.target.value});
    }

    /**
     * called when value of email text box is changed
     * @param event input event
     */
    onEmailChange = event => {
        // delete errors and set value to state
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, managerAdded: false, [event.target.name]: event.target.value});
    }

    /**
     * called when institution manager wants to update info about institution
     */
    onClickInstitutionUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUpdateInstitution: true});
        // extract institution from state
        const institution = {
            name: this.state.name,
            address: this.state.address,
            description: this.state.description,
            latitudeString: this.state.latitudeString,
            longitudeString: this.state.longitudeString,
        }

        // sends request to server to update institution information
        apiCalls.updateInstitution(institution).then(response => {
            this.setState({pendingApiCallUpdateInstitution: false, institutionUpdated: true});
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle input error
            this.handleApiError(apiError, "pendingApiCallUpdateInstitution");
        });
    }

    /**
     * called when manager of institution wants to delete it
     */
    onClickInstitutionDelete = () => {
        // ask before institution delete
        if (window.confirm("Do you really want to delete your institution?")) {
            this.setState({pendingApiCallDeleteInstitution: true});

            // send request to institution delete to server
            apiCalls.deleteInstitution().then(response => {
                this.setState({pendingApiCallDeleteInstitution: false}, () => {
                    this.props.setIsInstitutionOwner(false);
                    this.props.redirect("/");
                });
            }).catch(error => {
                // handle unauthorized state
                return handleError(error);
            });
        }
    }

    /**
     * called when institution manager wants to add new manager
     */
    onClickManagerAdd = (e) => {
        e.preventDefault();

        // ask before adding manager
        if (window.confirm("Do you really want to add a new manager to your institution?")) {
            this.setState({pendingApiCallAddManager: true});

            // send request to server to add new manager to institution
            apiCalls.addInstitutionManager({email: this.state.email}).then(response => {
                this.setState({pendingApiCallAddManager: false, email: ""}, () => this.setState({managerAdded: true}));
            }).catch(error => {
                // handle unauthorized state
                return handleError(error);
            }).catch(apiError => {
                // handle input errors
                this.handleApiError(apiError, "pendingApiCallAddManager");
            });
        }
    }

    /**
     * renders institution update page
     * @returns {JSX.Element} page
     */
    render() {
        const {
            name,
            address,
            description,
            latitudeString,
            longitudeString,
            image,
            encodedImage,
            imageSelect,
            createdAt,
            email,
            pendingApiCallUpdateInstitution,
            pendingApiCallUpdateImage,
            pendingApiCallDeleteInstitution,
            pendingApiCallAddManager,
            institutionUpdated,
            imageUpdated,
            managerAdded,
            errors,
        } = this.state;

        // render page
        return (
            <div className="mx-auto mt-5 border rounded p-md-5 p-2 container gray-noise-background mb-3">
                <h2 className="mb-4 font-weight-bold">My Institution</h2>

                <div className="mb-4">
                    <span className="font-weight-bold">Registration date: </span>
                    {new Date(createdAt).toLocaleDateString("en-US")}
                </div>

                <Link exact to="/myInstitution/addLanguages" >
                    <button type="button" className="btn btn-lg btn-success">
                        <i className="fa fa-plus-circle" /> Add languages
                    </button>
                </Link>

                <br />
                <Link exact to="/myInstitution/addExhibit" >
                    <button type="button" className="btn btn-lg mt-3 btn-success">
                        <i className="fa fa-plus-circle" /> Add exhibit
                    </button>
                </Link>

                <br />
                <Link exact to="/myInstitution/exhibits" >
                    <button type="button" className="btn btn-lg mt-3 btn-info">
                        <i className="fa fa-bars" /> View exhibits
                    </button>
                </Link>

                <br />
                <Link exact to="/myInstitution/buildings" >
                    <button type="button" className="btn btn-lg mt-3 btn-secondary">
                        <i className="fa fa-map-marker" /> Buildings, rooms, show-cases
                    </button>
                </Link>

                <form className="mb-4 mt-4">
                    {
                        imageUpdated &&
                        <div className="alert alert-success" role="alert">
                            Institution image updated
                        </div>
                    }

                    <div className="form-group">
                        <Input type="file"
                               onlyImage
                               value={imageSelect}
                               name="imageSelect"
                               label="Institution image"
                               placeholder="Select institution image"
                               onChange={this.onImageSelect}
                               hasError={errors.encodedImage && true}
                               error={errors.encodedImage}
                        />

                        {
                            encodedImage ?
                                <div>
                                    <img className="img-fluid sizedImg img-thumbnail mt-2" src={encodedImage} alt="upload" />
                                    <br />
                                    <button className="btn btn-danger btn-lg mt-2" disabled={pendingApiCallUpdateImage} onClick={this.clearImage}>
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
                                    <img className="img-fluid sizedImg img-thumbnail mt-2" src={INSTITUTIONS_IMAGES_URL + image} alt="upload" />
                                </div>
                        }
                    </div>
                </form>

                <form>
                    {
                        institutionUpdated &&
                        <div className="alert alert-success" role="alert">
                            Institution information updated
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
                        <Input
                            label="Address"
                            placeholder="Enter address" name="address" value={address}
                            onChange={this.onChange}
                            hasError={errors.address && true}
                            error={errors.address}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Description" type="textarea"
                            placeholder="Enter description" name="description" value={description}
                            onChange={this.onChange}
                            hasError={errors.description && true}
                            error={errors.description}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Latitude"
                            placeholder="Enter latitude" name="latitudeString" value={latitudeString}
                            onChange={this.onChange}
                            hasError={errors.latitudeString && true}
                            error={errors.latitudeString}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Longitude"
                            placeholder="Enter longitude" name="longitudeString" value={longitudeString}
                            onChange={this.onChange}
                            hasError={errors.longitudeString && true}
                            error={errors.longitudeString}
                        />
                    </div>

                    <ButtonWithProgress  onClick={(e) => this.onClickInstitutionUpdate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCallUpdateInstitution || name === "" || address === "" || description === "" ||
                                             latitudeString === "" || longitudeString === ""}
                                         pendingApiCall={pendingApiCallUpdateInstitution}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Update institution information
                    </ButtonWithProgress>

                </form>

                <form className="mt-4">
                    {
                        managerAdded &&
                        <div className="alert alert-success" role="alert">
                            New manager added
                        </div>
                    }

                    <Input
                        label="Add new institution manager"
                        placeholder="Enter new manager's email" name="email" value={email}
                        onChange={this.onEmailChange}
                        hasError={errors.email && true}
                        error={errors.email}
                    />

                    <ButtonWithProgress  onClick={(e) => this.onClickManagerAdd(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCallAddManager || email === ""}
                                         pendingApiCall={pendingApiCallAddManager}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Add new institution manager
                    </ButtonWithProgress>
                </form>

                <br />
                <ButtonWithProgress  onClick={this.onClickInstitutionDelete}
                                     className="btn btn-lg mt-3 btn-danger"
                                     disabled={pendingApiCallDeleteInstitution}
                                     pendingApiCall={pendingApiCallDeleteInstitution}
                                     hasChildren>
                    <i className="fa fa-times" /> Delete institution
                </ButtonWithProgress>
            </div>
        );
    }
}

/**
 * maps redux dispatch to state props
 * @param dispatch redux dispatch
 */
const mapDispatchToProps = (dispatch) => {
    return {
        setIsInstitutionOwner: (value) => dispatch(authActions.setIsInstitutionOwner(value)),
    }
}

export default connect(null, mapDispatchToProps)(UpdateInstitutionPage);