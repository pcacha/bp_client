import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import PageContentContainer from "../components/PageContentContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import BreadcrumbsLink from "../components/BreadcrumbsLink";
import PageInfo from "../components/PageInfo";

/**
 * page for updating buildings
 */
class UpdateBuildingPage extends Component {

    /**
     * current page state
     */
    state = {
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
        // fetch building details from the server
        apiCalls.getBuilding(this.state.buildingId).then(response => {
            // set fetched details to page state
            const {name, description} = response.data;
            this.setState({name, description, pendingApiCallGet: false});
        }).catch(error => {
            // handles unauthorized state
            return handleError(error);
        });
    }

    /**
     * called when updated building is submitted
     */
    onBuildingUpdate = (e) => {
        e.preventDefault();

        this.setState({pendingApiCallUpdate: true});

        // get description
        let buildingDescription = this.state.description;
        if(buildingDescription === "") {
            buildingDescription = null;
        }

        // send updated building to server
        apiCalls.updateBuilding({name: this.state.name, description: buildingDescription}, this.state.buildingId).then(response => {
            this.setState({pendingApiCallUpdate: false}, () => this.props.history.push("/myInstitution/buildings"));
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
     * render update building page
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
                <PageContentContainer>
                    <Spinner />
                </PageContentContainer>
            );
        }

        // render page
        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <BreadcrumbsLink to="/myInstitution" name="My Institution"/>
                    <BreadcrumbsLink to="/myInstitution/buildings" name="Buildings"/>
                    <li className="breadcrumb-item active">Update Building</li>
                </Breadcrumbs>

                <PageInfo name="Update Building">Update information of selected building</PageInfo>

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

                    <ButtonWithProgress  onClick={(e) => this.onBuildingUpdate(e)}
                                         className="btn btn-primary w-100 my-2"
                                         disabled={pendingApiCallUpdate || name === ""}
                                         pendingApiCall={pendingApiCallUpdate}
                                         hasChildren>
                        <i className="fa fa-paper-plane" /> Update building
                    </ButtonWithProgress>
                </form>
            </PageContentContainer>
        );
    }
}

export default UpdateBuildingPage;