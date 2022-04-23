import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Input from "../components/Input";
import PageContentContainer from "../components/PageContentContainer";

/**
 * page for creating new rooms
 */
class AddRoomPage extends Component {

    /**
     * current page state
     */
    state = {
        buildingId: this.props.match.params.buildingId,
        name: "",
        description: "",
        pendingApiCall: false,
        errors: {},
    }

    /**
     * called when new room is submitted
     */
    onRoomCreate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCall: true});

        // get description
        let roomDescription = this.state.description;
        if(roomDescription === "") {
            roomDescription = null;
        }

        // send room to server
        apiCalls.saveRoom({name: this.state.name, description: roomDescription}, this.state.buildingId).then(response => {
            this.setState({pendingApiCall: false}, () => this.props.history.push("/myInstitution/rooms/" + this.state.buildingId));
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle errors in user input
            let errors = {...this.state.errors};
            if (apiError.response.data && apiError.response.data.validationErrors) {
                errors = {...apiError.response.data.validationErrors}
            }
            this.setState({pendingApiCall: false, errors});
        });
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
     * render add room page
     * @returns {JSX.Element} page
     */
    render() {
        const {
            name,
            description,
            pendingApiCall,
            errors,
        } = this.state;

        // render page
        return (
            <PageContentContainer>
                <h2 className="mb-5 font-weight-bold">New Room</h2>

                <form className="mt-4">
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
                        <Input
                            label="Description" type="textarea"
                            placeholder="Enter description" name="description" value={description}
                            onChange={this.onChange}
                            hasError={errors.description && true}
                            error={errors.description}
                        />
                    </div>

                    <ButtonWithProgress  onClick={(e) => this.onRoomCreate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCall || name === ""}
                                         pendingApiCall={pendingApiCall}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Create room
                    </ButtonWithProgress>
                </form>
            </PageContentContainer>
        );
    }
}

export default AddRoomPage;