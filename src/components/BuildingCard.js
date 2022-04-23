import React from 'react';
import {Link} from "react-router-dom";
import ButtonWithProgress from "./ButtonWithProgress";

/**
 * card for listing buildings of user's institution
 * @param props props
 */
const BuildingCard = (props) => (
    <div className="card mb-4">
        <div className="card-body">
            <div className="row">
                <div className="col-md-9">
                    <h3 className="card-title">
                        {props.name}
                    </h3>

                    <div>
                        <span className="font-weight-bold">Creation date: </span>
                        {props.createdAt}
                    </div>

                    {
                        (props.description !== null && props.description !== "") &&
                        <div>
                            <span className="font-weight-bold">Description: </span>
                            {props.description}
                        </div>
                    }
                </div>

                <div className="col-md-3 mt-md-0 mt-3">
                    <Link exact to={"/myInstitution/rooms/" + props.buildingId}>
                        <button type="button" className="btn btn-primary w-100">
                            <i className="fa fa-bars" /> Rooms
                        </button>
                    </Link>
                    <br />

                    <Link exact to={"/myInstitution/buildings/" + props.buildingId}>
                        <button type="button" className="btn btn-info w-100 mt-2">
                            <i className="fa fa-pencil" /> Detail
                        </button>
                    </Link>
                    <br />

                    <ButtonWithProgress  onClick={() => props.onClickDelete(props.buildingId)}
                                         className="btn btn-danger w-100 mt-2"
                                         disabled={props.pendingApiCall}
                                         pendingApiCall={props.pendingApiCall}
                                         hasChildren>
                        <i className="fa fa-times" /> Delete
                    </ButtonWithProgress>
                </div>
            </div>
        </div>
    </div>
)

export default BuildingCard;