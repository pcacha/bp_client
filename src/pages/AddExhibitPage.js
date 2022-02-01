import React, {Component} from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";

class AddExhibitPage extends Component {

    initState = {
        name: "",
        infoLabelText: "",
        building: "",
        room: "",
        showcase: "",
        encodedImage: null,
        imageSelect: "",
        encodedInfoLabel: null,
        infoLabelSelect: "",
        pendingApiCall: false,
        created: false,
        errors: {},
    }

    state = this.initState;

    onChange = (event) => {
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        this.setState({errors, [event.target.name]: event.target.value, created: false});
    }

    onImageSelect = (event) => {
        const errors = {...this.state.errors};
        const name = event.target.name;

        if(name === "imageSelect") {
            delete errors["encodedImage"];
        }
        else {
            delete errors["encodedInfoLabel"];
        }

        this.setState({errors, [name]: event.target.value, created: false});
        if (event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            if(name === "imageSelect") {
                this.setState({encodedImage: reader.result});
            }
            else {
                this.setState({encodedInfoLabel: reader.result});
            }
        }
        reader.readAsDataURL(file);
    }

    clearImage = (name) => {
        const errors = {...this.state.errors};
        if(name === "imageSelect") {
            delete errors["encodedImage"];
            this.setState({errors, encodedImage: null, imageSelect: "",});
        }
        else {
            delete errors["encodedInfoLabel"];
            this.setState({errors, encodedInfoLabel: null, infoLabelSelect: "",});
        }
    }
    onInfoLabelTextChange = (event, editor) => {
        const errors = {...this.state.errors};
        delete errors["infoLabelText"];
        this.setState({infoLabelText: editor.getData(), created: false, errors});
    }

    onClickCreate = () => {
        this.setState({pendingApiCall: true});
        const exhibit = {
            name: this.state.name,
            infoLabelText: this.state.infoLabelText,
            building: this.state.building,
            room: this.state.room,
            showcase: this.state.showcase,
            encodedImage: this.state.encodedImage,
            encodedInfoLabel: this.state.encodedInfoLabel,
        }

        apiCalls.addExhibit(exhibit).then(response => {
            this.setState({...this.initState}, () => this.setState({created: true}));
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
        const {
            name,
            infoLabelText,
            building,
            room,
            showcase,
            encodedImage,
            imageSelect,
            encodedInfoLabel,
            infoLabelSelect,
            pendingApiCall,
            created,
            errors,
        } = this.state;

        let disabledSubmit = false;
        if (name === "" || encodedInfoLabel === null) {
            disabledSubmit = true;
        }

        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <form>
                    <h4 className="mb-4 font-weight-bold">Create new exhibit</h4>

                    {
                        created &&
                        <div className="alert alert-success" role="alert">
                            Exhibit has been created
                        </div>
                    }

                    <div className="form-group">
                        <Input type="file"
                               onlyImage
                               value={imageSelect}
                               name="imageSelect"
                               label="Exhibit image"
                               placeholder="Select exhibit image"
                               onChange={this.onImageSelect}
                               hasError={errors.encodedImage && true}
                               error={errors.encodedImage}
                        />

                        {
                            encodedImage &&
                            <div>
                                <img className="img-fluid sizedImg img-thumbnail mt-2" src={encodedImage} alt="upload" />
                                <br />
                                <button className="btn btn-danger btn-lg mt-2" onClick={() => this.clearImage("imageSelect")}>Clear</button>
                            </div>
                        }
                    </div>
                    <div className="form-group">
                        <Input type="file"
                               onlyImage
                               value={infoLabelSelect}
                               name="infoLabelSelect"
                               label="Information label"
                               placeholder="Select information label"
                               onChange={this.onImageSelect}
                               hasError={errors.encodedInfoLabel && true}
                               error={errors.encodedInfoLabel}
                        />

                        {
                            encodedInfoLabel &&
                            <div>
                                <img className="img-fluid mt-2" src={encodedInfoLabel} alt="upload" />
                                <br />
                                <button className="btn btn-danger btn-lg mt-2" onClick={() => this.clearImage("infoLabelSelect")}>Clear</button>
                            </div>
                        }
                    </div>
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

                    <ButtonWithProgress  onClick={this.onClickCreate}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCall || disabledSubmit}
                                         pendingApiCall={pendingApiCall}
                                         text="Add exhibit" />
                </form>
            </div>
        );
    }
}

export default AddExhibitPage;