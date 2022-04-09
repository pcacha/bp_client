import React, {Component} from 'react';
import LocationPickerSelect from "./LocationPickerSelect";
import * as apiCalls from "../apiCalls/apiCalls";

/**
 * component allowing to pick building, room and show-case using select boxes
 */
class LocationPicker extends Component {

    /**
     * current state
     */
    state = {
        buildingId: this.props.buildingId ? this.props.buildingId : null,
        roomId: this.props.roomId ? this.props.roomId : null,
        showcaseId: this.props.showcaseId ? this.props.showcaseId : null,
    }

    /**
     * function for getting all rooms depending on building in state
     * @returns {Promise<AxiosResponse<*>>} promise
     */
    fetchRooms = () => {
        return apiCalls.getRooms(this.state.buildingId);
    }

    /**
     * function for getting all showcases depending on room in state
     * @returns {Promise<AxiosResponse<*>>} promise
     */
    fetchShowcases = () => {
        return apiCalls.getShowcases(this.state.roomId);
    }

    /**
     * Reacts on building change
     * @param newVal new building id
     */
    onBuildingChange = newVal => {
        if(newVal !== this.state.buildingId) {
            // update state with new val
            this.setState({buildingId: newVal, roomId: null, showcaseId: null});
            // update upper component
            this.props.update(newVal, null, null);
        }
    }

    /**
     * Reacts on room change
     * @param newVal new room id
     */
    onRoomChange = newVal => {
        if(newVal !== this.state.roomId) {
            // update state with new val
            this.setState({roomId: newVal, showcaseId: null});
            // update upper component
            this.props.update(this.state.buildingId, newVal, null);
        }
    }

    /**
     * Reacts on showcase change
     * @param newVal new showcase id
     */
    onShowcaseChange = newVal => {
        if(newVal !== this.state.roomId) {
            // update state with new val
            this.setState({showcaseId: newVal});
            // update upper component
            this.props.update(this.state.buildingId, this.state.roomId, newVal);
        }
    }

    /**
     * renders component to pick location
     * @returns {JSX.Element} component to pick location
     */
    render() {
        const {buildingId, roomId, showcaseId} = this.state;

        return (
            <>
                <LocationPickerSelect currValue={buildingId} label="Building" idName="buildingId" fetch={apiCalls.getBuildings} onChange={this.onBuildingChange} />
                {buildingId && <LocationPickerSelect key={buildingId} currValue={roomId} label="Room" idName="roomId" fetch={this.fetchRooms} onChange={this.onRoomChange} />}
                {roomId && <LocationPickerSelect key={roomId} currValue={showcaseId} label="Show-case" idName="showcaseId" fetch={this.fetchShowcases} onChange={this.onShowcaseChange} />}
            </>
        );
    }
}

export default LocationPicker;