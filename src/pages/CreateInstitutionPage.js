import React, {Component} from 'react';
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import * as authActions from "../store/authActions";
import {connect} from "react-redux";
import PageContentContainer from "../components/PageContentContainer";
import Breadcrumbs from "../components/Breadcrumbs";

/**
 * page for creating new institution
 */
class CreateInstitutionPage extends Component {

    /**
     * current page state
     */
    state = {
        name: "",
        address: "",
        description: "",
        latitudeString: "",
        longitudeString: "",
        encodedImage: null,
        imageSelect: "",
        pendingApiCall: false,
        errors: {},
    }

    /**
     * called when text input is changed
     * @param event input event
     */
    onChange = (event) => {
        // delete errors for given input
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        // update state
        this.setState({errors, [event.target.name]: event.target.value});
    }

    /**
     * called when new image is selected
     * @param event input event
     */
    onImageSelect = (event) => {
        // update state with no errors and new value
        const errors = {...this.state.errors};
        delete errors["encodedImage"];
        this.setState({errors, [event.target.name]: event.target.value});
        if (event.target.files.length === 0) {
            return;
        }

        // if file is picked load it
        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            // set base64 encoded image to state
            this.setState({encodedImage: reader.result});
        }
        reader.readAsDataURL(file);
    }

    /**
     * clears image
     */
    clearImage = () => {
        const errors = {...this.state.errors};
        delete errors["encodedImage"];
        // set state with no errors for img input and reset image properties
        this.setState({errors, encodedImage: null, imageSelect: "",});
    }

    /**
     * called when user click on create institution button
     */
    onClickCreate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCall: true});
        // extract institution from state
        const institution = {
            name: this.state.name,
            address: this.state.address,
            description: this.state.description,
            latitudeString: this.state.latitudeString,
            longitudeString: this.state.longitudeString,
            encodedImage: this.state.encodedImage,
        }

        // send new institution to server
        apiCalls.saveMyInstitution(institution).then(response => {
            this.setState({pendingApiCall: false}, () => {
                // set that logged in user is isntituiton owner and redirect
                this.props.setIsInstitutionOwner(true);
                this.props.redirect("/myInstitution/addLanguages");
            });
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle state when user input contains errors
            let errors = {...this.state.errors};
            if (apiError.response.data && apiError.response.data.validationErrors) {
                errors = {...apiError.response.data.validationErrors}
            }
            // set new state with fetched errors
            this.setState({pendingApiCall: false, errors});
        });
    }

    /**
     * renders create institution page
     * @returns {JSX.Element} page
     */
    render() {
        // determines if submit button is enabled
        let disabledSubmit = false;
        if (this.state.name === "" || this.state.address === "" || this.state.description === "" || this.state.latitudeString === "" || this.state.longitudeString === "") {
            disabledSubmit = true;
        }

        // renders page
        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <li className="breadcrumb-item active">Create Institution</li>
                </Breadcrumbs>

                <form>
                    <h2 className="mb-4 font-weight-bold">Create Institution</h2>

                    <div className="form-group">
                        <Input type="file"
                               onlyImage
                               value={this.state.imageSelect}
                               name="imageSelect"
                               label="Institution image"
                               placeholder="Select institution image"
                               onChange={this.onImageSelect}
                               hasError={this.state.errors.encodedImage && true}
                               error={this.state.errors.encodedImage}
                        />

                        {
                            this.state.encodedImage &&
                            <div>
                                <img className="img-fluid sizedImg img-thumbnail mt-2" src={this.state.encodedImage} alt="upload" />
                                <br />
                                <button className="btn btn-danger btn-lg mt-2" onClick={this.clearImage}>
                                    <i className="fa fa-times" /> Clear
                                </button>
                            </div>
                        }
                    </div>
                    <div className="form-group">
                        <Input
                            label="Name*"
                            placeholder="Enter name" name="name" value={this.state.name}
                            onChange={this.onChange}
                            hasError={this.state.errors.name && true}
                            error={this.state.errors.name}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Address*"
                            placeholder="Enter address" name="address" value={this.state.address}
                            onChange={this.onChange}
                            hasError={this.state.errors.address && true}
                            error={this.state.errors.address}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Description*" type="textarea"
                            placeholder="Enter description" name="description" value={this.state.description}
                            onChange={this.onChange}
                            hasError={this.state.errors.description && true}
                            error={this.state.errors.description}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Latitude*"
                            placeholder="Enter latitude" name="latitudeString" value={this.state.latitudeString}
                            onChange={this.onChange}
                            hasError={this.state.errors.latitudeString && true}
                            error={this.state.errors.latitudeString}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Longitude*"
                            placeholder="Enter longitude" name="longitudeString" value={this.state.longitudeString}
                            onChange={this.onChange}
                            hasError={this.state.errors.longitudeString && true}
                            error={this.state.errors.longitudeString}
                        />
                    </div>

                    <ButtonWithProgress  onClick={(e) => this.onClickCreate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={this.state.pendingApiCall || disabledSubmit}
                                         pendingApiCall={this.state.pendingApiCall}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Create institution
                    </ButtonWithProgress>
                </form>
            </PageContentContainer>
        );
    }
}

/**
 * maps redux state to page properties
 * @param dispatch redux dispatch
 */
const mapDispatchToProps = (dispatch) => {
    return {
        setIsInstitutionOwner: value => dispatch(authActions.setIsInstitutionOwner(value)),
    }
}

export default connect(null, mapDispatchToProps)(CreateInstitutionPage);