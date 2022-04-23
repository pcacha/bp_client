import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import RoomCard from "../components/RoomCard";
import { Link } from "react-router-dom";
import NoContentMessage from "../components/NoContentMessage";
import PageContentContainer from "../components/PageContentContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import BreadcrumbsLink from "../components/BreadcrumbsLink";

/**
 * page with all rooms of a building defined in url
 */
class RoomsPage extends Component {

    /**
     * current page state
     */
    state = {
        buildingId: this.props.match.params.buildingId,
        rooms: [],
        pendingApiCall: false,
    }


    /**
     * Called when user wants to delete room
     * @param roomId room id
     */
    onClickDelete = (roomId) => {
        // ask before delete
        if(window.confirm("Do you really want to delete this room?")) {
            // update api call for given room
            let newRooms = [];
            const {rooms} = this.state;
            for (let r of rooms) {
                if(r.roomId === roomId) {
                    // set api call to true for deleted room
                    newRooms.push({...r, pendingApiCall: true});
                }
                else {
                    newRooms.push({...r});
                }
            }
            this.setState({rooms: newRooms});

            // send delete message to server
            apiCalls.deleteRoom(roomId).then(response => {
                newRooms = [...this.state.rooms];
                newRooms = newRooms.filter(r => r.roomId !== roomId);

                // if delete was successful update state
                this.setState({rooms: newRooms});
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
        this.setState({pendingApiCall: true});
        // fetch all rooms from server
        apiCalls.getRooms(this.state.buildingId).then(response => {
            const rooms = response.data;
            // set default properties for fetched rooms
            for(let r of rooms) {
                r.pendingApiCall = false;
            }
            this.setState({rooms, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized error
            return handleError(error);
        });
    }

    /**
     * Renders page with rooms
     * @returns {JSX.Element} page with rooms
     */
    render() {

        // maps rooms to room cards
        const rooms = this.state.rooms.map(r =>
            <RoomCard key={r.roomId} {...r} onClickDelete={this.onClickDelete}/>
        );

        // define page content
        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.rooms.length === 0 ? <NoContentMessage text="There are no rooms"/> : rooms;
        }

        // renders page
        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <BreadcrumbsLink to="/myInstitution" name="My Institution"/>
                    <BreadcrumbsLink to="/myInstitution/buildings/" name="Buildings"/>
                    <li className="breadcrumb-item active">Rooms</li>
                </Breadcrumbs>

                <h2 className="mb-5 font-weight-bold">Rooms</h2>
                <Link exact to={"/myInstitution/rooms/" + this.state.buildingId + "/addRoom"} >
                    <button type="button" className="btn btn-lg mt-3 btn-success mb-4">
                        <i className="fa fa-plus-circle" /> Add new room
                    </button>
                </Link>

                {content}
            </PageContentContainer>
        );
    }
}

export default RoomsPage;