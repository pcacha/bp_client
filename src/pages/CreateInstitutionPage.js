import React, {Component} from 'react';
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";

class CreateInstitutionPage extends Component {

    state = {
        name: "",
        address: "",
        latitudeString: "",
        longitudeString: "",
        encodedImage: null,
        imageSelect: "",
        pendingApiCall: false,
        errors: {},
    }

    onChange = (event) => {
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, [event.target.name]: event.target.value});
    }

    onImageSelect = (event) => {
        this.setState({[event.target.name]: event.target.value});
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

    onClickCreate = () => {
        this.setState({pendingApiCall: true});
        const institution = {
            name: this.state.name,
            address: this.state.address,
            latitudeString: this.state.latitudeString,
            longitudeString: this.state.longitudeString,
            encodedImage: this.state.encodedImage,
        }

        apiCalls.saveMyInstitution(institution).then(response => {
            this.setState({pendingApiCall: false}, () => {
                this.props.redirect("/");
            });
        }).catch(error => {
            return handleError(error);
        }).catch(apiError => {
            let errors = {...this.state.errors};
            if (apiError.response.data && apiError.response.data.validationErrors) {
                errors = {...apiError.response.data.validationErrors}
            }
            this.setState({pendingApiCall: false, errors});
        });
    }

    render() {
        let disabledSubmit = false;
        if (this.state.name === "" || this.state.address === "" || this.state.latitudeString === "" || this.state.longitudeString === "") {
            disabledSubmit = true;
        }

        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2">
                <form>
                    <h4 className="mb-4 font-weight-bold">Create your institution</h4>

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
                                <button className="btn btn-danger btn-lg mt-2" onClick={this.clearImage}>Clear</button>
                            </div>
                        }
                    </div>
                    <div className="form-group">
                        <Input
                            label="Name"
                            placeholder="Enter name" name="name" value={this.state.name}
                            onChange={this.onChange}
                            hasError={this.state.errors.name && true}
                            error={this.state.errors.name}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Address"
                            placeholder="Enter address" name="address" value={this.state.address}
                            onChange={this.onChange}
                            hasError={this.state.errors.address && true}
                            error={this.state.errors.address}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Latitude"
                            placeholder="Enter latitude" name="latitudeString" value={this.state.latitudeString}
                            onChange={this.onChange}
                            hasError={this.state.errors.latitudeString && true}
                            error={this.state.errors.latitudeString}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="Longitude"
                            placeholder="Enter longitude" name="longitudeString" value={this.state.longitudeString}
                            onChange={this.onChange}
                            hasError={this.state.errors.longitudeString && true}
                            error={this.state.errors.longitudeString}
                        />
                    </div>

                    <ButtonWithProgress  onClick={this.onClickCreate}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={this.state.pendingApiCall || disabledSubmit}
                                         pendingApiCall={this.state.pendingApiCall}
                                         text="Create institution" />
                </form>
            </div>
        );
    }
}

export default CreateInstitutionPage;