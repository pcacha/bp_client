import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Input from "../components/Input";
import PageContentContainer from "../components/PageContentContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import BreadcrumbsLink from "../components/BreadcrumbsLink";
import PageInfo from "../components/PageInfo";

/**
 * page for creating new buildings
 */
class AddBuildingPage extends Component {

    /**
     * current page state
     */
    state = {
        name: "",
        description: "",
        pendingApiCall: false,
        errors: {},
    }

    /**
     * called when new building is submitted
     */
    onBuildingCreate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCall: true});

        // get description
        let buildingDescription = this.state.description;
        if(buildingDescription === "") {
            buildingDescription = null;
        }

        // send building to server
        apiCalls.saveBuilding({name: this.state.name, description: buildingDescription}).then(response => {
            this.setState({pendingApiCall: false}, () => this.props.history.push("/myInstitution/buildings"));
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
     * render add building page
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
                <Breadcrumbs>
                    <BreadcrumbsLink to="/myInstitution" name="My Institution"/>
                    <BreadcrumbsLink to="/myInstitution/buildings" name="Buildings"/>
                    <li className="breadcrumb-item active">New Building</li>
                </Breadcrumbs>

                <PageInfo name="New Building">Add a new building belonging to your institution</PageInfo>

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

                    <ButtonWithProgress  onClick={(e) => this.onBuildingCreate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCall || name === ""}
                                         pendingApiCall={pendingApiCall}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Create building
                    </ButtonWithProgress>
                </form>
            </PageContentContainer>
        );
    }
}

export default AddBuildingPage;