import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Input from "../components/Input";
import Spinner from "../components/Spinner";

/**
 * page for updating rooms
 */
class UpdateRoomPage extends Component {

    /**
     * current page state
     */
    state = {
        roomId: this.props.match.params.roomId,
        buildingId: this.props.match.params.buildingId,
        name: "",
        description: "",
        pendingApiCallGet: false,
        pendingApiCallUpdate: false,
        errors: {},
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCallGet: true})
        // fetch room details from the server
        apiCalls.getRoom(this.state.roomId).then(response => {
            // set fetched details to page state
            const {name, description} = response.data;
            this.setState({name, description, pendingApiCallGet: false});
        }).catch(error => {
            // handles unauthorized state
            return handleError(error);
        });
    }

    /**
     * called when updated room is submitted
     */
    onRoomUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUpdate: true});

        // get description
        let roomDescription = this.state.description;
        if(roomDescription === "") {
            roomDescription = null;
        }

        // send updated room to server
        apiCalls.updateRoom({name: this.state.name, description: roomDescription}, this.state.roomId).then(response => {
            this.setState({pendingApiCallUpdate: false}, () => this.props.history.push("/myInstitution/rooms/" + this.state.buildingId));
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        }).catch(apiError => {
            // handle errors in user input
            let errors = {...this.state.errors};
            if (apiError.response.data && apiError.response.data.validationErrors) {
                errors = {...apiError.response.data.validationErrors}
            }
            this.setState({pendingApiCallUpdate: false, errors});
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
     * render update room page
     * @returns {JSX.Element} page
     */
    render() {
        const {
            name,
            description,
            pendingApiCallGet,
            pendingApiCallUpdate,
            errors,
        } = this.state;

        // return spinner if api call is processing
        if (pendingApiCallGet) {
            return (
                <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                    <Spinner />
                </div>
            );
        }

        // render page
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Update Room</h2>

                <form className="mt-4">
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
                            label="Description" type="textarea"
                            placeholder="Enter description" name="description" value={description}
                            onChange={this.onChange}
                            hasError={errors.description && true}
                            error={errors.description}
                        />
                    </div>

                    <ButtonWithProgress  onClick={(e) => this.onRoomUpdate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCallUpdate || name === ""}
                                         pendingApiCall={pendingApiCallUpdate}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Update room
                    </ButtonWithProgress>
                </form>
            </div>
        );
    }
}

export default UpdateRoomPage;