import React, {Component} from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import LocationPicker from "../components/LocationPicker";
import PageContentContainer from "../components/PageContentContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import BreadcrumbsLink from "../components/BreadcrumbsLink";
import PageInfo from "../components/PageInfo";

/**
 * Page where institution manager can add new exhibits
 */
class AddExhibitPage extends Component {

    /**
     * initial state of page
     */
    initState = {
        name: "",
        infoLabelText: "",
        buildingId: null,
        roomId: null,
        showcaseId: null,
        encodedImage: null,
        imageSelect: "",
        encodedInfoLabel: null,
        infoLabelSelect: "",
        pendingApiCall: false,
        created: false,
        errors: {},
    }

    /**
     * page state
     */
    state = this.initState;

    /**
     * Called on text input values change
     * @param event input event
     */
    onChange = (event) => {
        // delete error to given field
        const errors = {...this.state.errors};
        delete errors[event.target.name];
        // update state
        this.setState({errors, [event.target.name]: event.target.value, created: false});
    }

    /**
     * Called when new image is selected
     * @param event input event
     */
    onImageSelect = (event) => {
        const errors = {...this.state.errors};
        const name = event.target.name;

        // delete input error message
        if(name === "imageSelect") {
            delete errors["encodedImage"];
        }
        else {
            delete errors["encodedInfoLabel"];
        }

        // update state with new errors and close alert that new exhibit was created
        this.setState({errors, [name]: event.target.value, created: false});
        if (event.target.files.length === 0) {
            return;
        }

        // if user chose file
        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            // update state with new base64 encoded selected image
            if(name === "imageSelect") {
                this.setState({encodedImage: reader.result});
            }
            else {
                this.setState({encodedInfoLabel: reader.result});
            }
        }
        // read image
        reader.readAsDataURL(file);
    }

    /**
     * Clears image from state
     * @param name img name
     */
    clearImage = (name) => {
        const errors = {...this.state.errors};
        if(name === "imageSelect") {
            // delete errors of image input and its fields in state
            delete errors["encodedImage"];
            this.setState({errors, encodedImage: null, imageSelect: "",});
        }
        else {
            // delete errors of image input and its fields in state
            delete errors["encodedInfoLabel"];
            this.setState({errors, encodedInfoLabel: null, infoLabelSelect: "",});
        }
    }

    /**
     * Called when info label text is chagned
     * @param event input event
     * @param editor input editor
     */
    onInfoLabelTextChange = (event, editor) => {
        const errors = {...this.state.errors};
        delete errors["infoLabelText"];
        // update state with new value, no errors and closed alert of created exhibit
        this.setState({infoLabelText: editor.getData(), created: false, errors});
    }

    /**
     * Called when new exhibit is created
     */
    onClickCreate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCall: true});
        // extract exhibit from state
        const exhibit = {
            name: this.state.name,
            infoLabelText: this.state.infoLabelText,
            buildingId: this.state.buildingId,
            roomId: this.state.roomId,
            showcaseId: this.state.showcaseId,
            encodedImage: this.state.encodedImage,
            encodedInfoLabel: this.state.encodedInfoLabel,
        }

        // send new exhibit to server
        apiCalls.addExhibit(exhibit).then(response => {
            let currBuildingId = this.state.buildingId;
            let currRoomId = this.state.roomId;
            let currShowcaseId = this.state.showcaseId;
            this.setState({...this.initState}, () => this.setState({created: true, buildingId: currBuildingId, roomId: currRoomId, showcaseId: currShowcaseId}));
        }).catch(error => {
            // react on unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // react on errors in user input
            let errors = {...this.state.errors};
            if (apiError.response.data && apiError.response.data.validationErrors) {
                errors = {...apiError.response.data.validationErrors}
            }
            this.setState({pendingApiCall: false, errors});
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
     * renders page
     * @returns {JSX.Element} page
     */
    render() {
        const {
            name,
            infoLabelText,
            encodedImage,
            imageSelect,
            encodedInfoLabel,
            infoLabelSelect,
            pendingApiCall,
            created,
            errors,
        } = this.state;

        // define disable submit value
        let disabledSubmit = false;
        if (name === "" || encodedInfoLabel === null) {
            disabledSubmit = true;
        }

        // return page
        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <BreadcrumbsLink to="/myInstitution" name="My Institution"/>
                    <li className="breadcrumb-item active">New Exhibit</li>
                </Breadcrumbs>

                <PageInfo name="New Exhibit">Add a new exhibit with an information label for translation</PageInfo>

                <form>

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
                                <button className="btn btn-danger btn-lg mt-2" onClick={() => this.clearImage("imageSelect")}>
                                    <i className="fa fa-times" /> Clear
                                </button>
                            </div>
                        }
                    </div>
                    <div className="form-group">
                        <Input type="file"
                               onlyImage
                               value={infoLabelSelect}
                               name="infoLabelSelect"
                               label="Information label*"
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
                                <button className="btn btn-danger btn-lg mt-2" onClick={() => this.clearImage("infoLabelSelect")}>
                                    <i className="fa fa-times" /> Clear
                                </button>
                            </div>
                        }
                    </div>
                    <div className="form-group">
                        <Input
                            label="Name*"
                            placeholder="Enter name" name="name" value={name}
                            onChange={this.onChange}
                            hasError={errors.name && true}
                            error={errors.name}
                        />
                    </div>
                    <div className="form-group">
                        <label className="font-weight-bold">Information label text</label>
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
                        <LocationPicker update={this.updateLocation} />
                    </div>

                    <ButtonWithProgress  onClick={(e) => this.onClickCreate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCall || disabledSubmit}
                                         pendingApiCall={pendingApiCall}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> New exhibit
                    </ButtonWithProgress>

                </form>
            </PageContentContainer>
        );
    }
}

export default AddExhibitPage;