import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import BuildingCard from "../components/BuildingCard";
import { Link } from "react-router-dom";
import NoContentMessage from "../components/NoContentMessage";

/**
 * page with all buildings of an institution that user is managing
 */
class BuildingsPage extends Component {

    /**
     * current page state
     */
    state = {
        buildings: [],
        pendingApiCall: false,
    }


    /**
     * Called when user wants to delete building
     * @param buildingId building id
     */
    onClickDelete = (buildingId) => {
        // ask before delete
        if(window.confirm("Do you really want to delete this building?")) {
            // update api call for given building
            let newBuildings = [];
            const {buildings} = this.state;
            for (let b of buildings) {
                if(b.buildingId === buildingId) {
                    // set api call to true for deleted building
                    newBuildings.push({...b, pendingApiCall: true});
                }
                else {
                    newBuildings.push({...b});
                }
            }
            this.setState({buildings: newBuildings});

            // send delete message to server
            apiCalls.deleteBuilding(buildingId).then(response => {
                newBuildings = [...this.state.buildings];
                newBuildings = newBuildings.filter(b => b.buildingId !== buildingId);

                // if delete was successful update state
                this.setState({buildings: newBuildings});
            }).catch(error => {
                // handle unauthorized error
                return handleError(error);
            });
        }
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch all institution buildings from server
        apiCalls.getBuildings().then(response => {
            const buildings = response.data;
            // set default properties for fetched buildings
            for(let b of buildings) {
                b.pendingApiCall = false;
            }
            this.setState({buildings, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized error
            return handleError(error);
        });
    }

    /**
     * Renders page with institution buildings
     * @returns {JSX.Element} page with institution buildings
     */
    render() {

        // maps buildings to building cards
        const buildings = this.state.buildings.map(b =>
            <BuildingCard key={b.buildingId} {...b} onClickDelete={this.onClickDelete}/>
        );

        // define page content
        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.buildings.length === 0 ? <NoContentMessage text="There are no buildings"/> : buildings;
        }

        // renders page
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Institution Buildings</h2>
                <Link exact to="/myInstitution/buildings/addBuilding">
                    <button type="button" className="btn btn-lg mt-3 btn-success mb-4">
                        <i className="fa fa-plus-circle" /> Add new building
                    </button>
                </Link>

                {content}
            </div>
        );
    }
}

export default BuildingsPage;