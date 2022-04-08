import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Input from "../components/Input";

/**
 * page for creating new showcases
 */
class AddShowcasePage extends Component {

    /**
     * current page state
     */
    state = {
        roomId: this.props.match.params.roomId,
        name: "",
        description: "",
        pendingApiCall: false,
        errors: {},
    }

    /**
     * called when new showcase is submitted
     */
    onShowcaseCreate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCall: true});

        // get description
        let showcaseDescription = this.state.description;
        if(showcaseDescription === "") {
            showcaseDescription = null;
        }

        // send showcase to server
        apiCalls.saveShowcase({name: this.state.name, description: showcaseDescription}, this.state.roomId).then(response => {
            this.setState({pendingApiCall: false}, () => this.props.history.push("/myInstitution/showcases/" + this.state.roomId));
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
     * render add showcase page
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
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">New Show-case</h2>

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

                    <ButtonWithProgress  onClick={(e) => this.onShowcaseCreate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCall || name === ""}
                                         pendingApiCall={pendingApiCall}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Create show-case
                    </ButtonWithProgress>
                </form>
            </div>
        );
    }
}

export default AddShowcasePage;