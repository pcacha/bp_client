import React, {Component} from 'react';
import handleError from "../shared/failureHandler";
import Spinner from "./Spinner";
import Select from 'react-select';
import {NOTHING_SELECTED_LABEL} from "../shared/sharedConstants";

/**
 * component containing select of location (building/room/showcase)
 */
class LocationPickerSelect extends Component {

    /**
     * current page state
     */
    state = {
        fetchedObjects: [],
        pendingApiCall: false,
        selectedId: this.props.currValue ? this.props.currValue : null,
        selectedLabel: NOTHING_SELECTED_LABEL,
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true});
        // fetch all needed objects from server
        this.props.fetch().then(response => {
            const objects = response.data;
            // add objects to select options
            const fetchedObjects = [];
            let newSelectedLabel = NOTHING_SELECTED_LABEL;
            for(let o of objects) {
                fetchedObjects.push({value: o[this.props.idName], label: o.name});
                // if id match, set selected label
                if(o[this.props.idName] === this.state.selectedId) {
                    newSelectedLabel = o.name;
                }
            }
            // update state
            this.setState({fetchedObjects, pendingApiCall: false, selectedLabel: newSelectedLabel});
        }).catch(error => {
            // handle unauthorized error
            return handleError(error);
        });
    }

    /**
     * called when select value is changed
     * @param e params
     */
    onChange = e => {
        if(e === null) {
            // pass to upper component when nothing is selected
            this.props.onChange(null);
            this.setState({selectedId: null, selectedLabel: NOTHING_SELECTED_LABEL});
        }
        else {
            // pass to upper component when option is selected
            this.props.onChange(e.value);
            this.setState({selectedId: e.value, selectedLabel: e.label});
        }
    }

    /**
     * renders select
     * @returns {JSX.Element} component with select
     */
    render() {
        const {fetchedObjects, pendingApiCall, selectedId, selectedLabel} = this.state;

        // return spinner if api call is processing
        if(pendingApiCall) {
            return <Spinner />;
        }

        return (
            <div className="mt-2">
                <label className="font-weight-bold">{this.props.label}</label>
                <Select options={fetchedObjects} onChange={this.onChange} isClearable value={{value: selectedId, label: selectedLabel}} />
            </div>
        );
    }
}

export default LocationPickerSelect;