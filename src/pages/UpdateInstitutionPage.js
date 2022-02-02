import React, {Component} from 'react';
import * as authActions from "../store/authActions";
import {connect} from "react-redux";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {INSTITUTIONS_IMAGES_URL} from "../shared/sharedConstants";
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Link from "react-router-dom/es/Link";

class UpdateInstitutionPage extends Component {

    state = {
        name: this.props.institution.name,
        address: this.props.institution.address,
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

    onImageSelect = (event) => {
        const errors = {...this.state.errors};
        delete errors["encodedImage"];
        this.setState({errors, [event.target.name]: event.target.value, imageUpdated: false});
        if (event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({encodedImage: reader.result});
        }
        reader.readAsDataURL(file);
    }

    clearImage = () => {
        const errors = {...this.state.errors};
        delete errors["encodedImage"];
        this.setState({errors, encodedImage: null, imageSelect: "",});
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

    onClickImageUpdate = () => {
        this.setState({pendingApiCallUpdateImage: true});
        const img = { encodedImage: this.state.encodedImage }

        apiCalls.updateInstitutionImage(img).then(response => {
            this.setState({pendingApiCallUpdateImage: false, image: response.data.message, imageUpdated: true}, () => {
                this.clearImage();
            });
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
            this.handleApiError(apiError, "pendingApiCallUpdateImage");
        });
    }

    onChange = event => {
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, institutionUpdated: false, [event.target.name]: event.target.value});
    }

    onEmailChange = event => {
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, managerAdded: false, [event.target.name]: event.target.value});
    }

    onClickInstitutionUpdate = () => {
        this.setState({pendingApiCallUpdateInstitution: true});
        const institution = {
            name: this.state.name,
            address: this.state.address,
            latitudeString: this.state.latitudeString,
            longitudeString: this.state.longitudeString,
        }

        apiCalls.updateInstitution(institution).then(response => {
            this.setState({pendingApiCallUpdateInstitution: false, institutionUpdated: true});
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
            this.handleApiError(apiError, "pendingApiCallUpdateInstitution");
        });
    }

    onClickInstitutionDelete = () => {
        if (window.confirm("Do you really want to delete your institution?")) {
            this.setState({pendingApiCallDeleteInstitution: true});

            apiCalls.deleteInstitution().then(response => {
                this.setState({pendingApiCallDeleteInstitution: false}, () => {
                    this.props.setIsInstitutionOwner(false);
                    this.props.redirect("/");
                });
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    onClickManagerAdd = () => {
        if (window.confirm("Do you really want to add a new manager to your institution?")) {
            this.setState({pendingApiCallAddManager: true});

            apiCalls.addInstitutionManager({email: this.state.email}).then(response => {
                this.setState({pendingApiCallAddManager: false, email: ""}, () => this.setState({managerAdded: true}));
            }).catch(error => {
                return handleError(error);
            }).catch(apiError => {
                this.handleApiError(apiError, "pendingApiCallAddManager");
            });
        }
    }

    render() {
        const {
            name,
            address,
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

        return (
            <div className="mx-auto mt-5 border rounded p-md-5 p-2 container gray-noise-background mb-3">
                <h2 className="mb-4 font-weight-bold">My Institution</h2>

                <div className="mb-4">
                    <span className="font-weight-bold">Registration date: </span>
                    {new Date(createdAt).toLocaleDateString("en-US")}
                </div>

                <form className="mb-4">
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

                    <ButtonWithProgress  onClick={this.onClickInstitutionUpdate}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCallUpdateInstitution || name === "" || address === "" || latitudeString === "" || longitudeString === ""}
                                         pendingApiCall={pendingApiCallUpdateInstitution}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Update institution information
                    </ButtonWithProgress>

                </form>


                <Link exact to="/myInstitution/addLanguages" >
                    <button type="button" className="btn btn-lg mt-3 btn-success">
                        <i className="fa fa-plus-circle" /> {" Add languages"}
                    </button>
                </Link>

                <br />
                <Link exact to="/myInstitution/addExhibit" >
                    <button type="button" className="btn btn-lg mt-3 btn-success">
                        <i className="fa fa-plus-circle" /> {" Add exhibit"}
                    </button>
                </Link>

                <br />
                <Link exact to="/myInstitution/exhibits" >
                    <button type="button" className="btn btn-lg mt-3 btn-info">
                        <i className="fa fa-bars" /> {" View exhibits"}
                    </button>
                </Link>

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

                    <ButtonWithProgress  onClick={this.onClickManagerAdd}
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

const mapDispatchToProps = (dispatch) => {
    return {
        setIsInstitutionOwner: (value) => dispatch(authActions.setIsInstitutionOwner(value)),
    }
}

export default connect(null, mapDispatchToProps)(UpdateInstitutionPage);