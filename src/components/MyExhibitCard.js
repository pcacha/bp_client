import React from 'react';
import {Link} from "react-router-dom";
import {EXHIBITS_IMAGES_URL} from "../shared/sharedConstants";
import ButtonWithProgress from "./ButtonWithProgress";

const MyExhibitCard = (props) => (
    <div className="card mb-4">
        <div className="card-body">
            <div className="row">
                <div className="col-md-3">
                    <img className="img-fluid sizedImg img-thumbnail" src={EXHIBITS_IMAGES_URL + props.image} alt="image" />
                </div>

                <div className="col-md-6">
                    <h3 className="card-title">
                        {props.name}
                    </h3>

                    <div>
                        <span className="font-weight-bold">Registration date: </span>
                        {new Date(props.createdAt).toLocaleDateString("en-US")}
                    </div>

                    {
                        props.building &&
                        <div>
                            <span className="font-weight-bold">Building: </span>
                            {props.building}
                        </div>
                    }

                    {
                        props.room &&
                        <div>
                            <span className="font-weight-bold">Room: </span>
                            {props.room}
                        </div>
                    }

                    {
                        props.showcase &&
                        <div>
                            <span className="font-weight-bold">Show-case: </span>
                            {props.showcase}
                        </div>
                    }
                </div>

                <div className="col-md-3">
                    <Link exact to={"/myInstitution/exhibits/" + props.exhibitId} >
                        <button type="button" className="btn btn-info w-100">
                            <i className="fa fa-pencil" /> {" Detail"}
                        </button>
                    </Link>
                    <br />

                    <ButtonWithProgress  onClick={() => props.onClickDelete(props.exhibitId)}
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

export default MyExhibitCard;