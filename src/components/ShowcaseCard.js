import React from 'react';
import {Link} from "react-router-dom";
import ButtonWithProgress from "./ButtonWithProgress";

/**
 * card for listing showcases
 * @param props props
 */
const ShowcaseCard = (props) => (
    <div className="card mb-4">
        <div className="card-body">
            <div className="row">
                <div className="col-md-9">
                    <h3 className="card-title">
                        {props.name}
                    </h3>

                    <div>
                        <span className="font-weight-bold">Registration date: </span>
                        {new Date(props.createdAt).toLocaleDateString("en-US")}
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
                    <Link exact to={"/myInstitution/showcases/" + props.roomId + "/" + props.showcaseId}>
                        <button type="button" className="btn btn-info w-100">
                            <i className="fa fa-pencil" /> Detail
                        </button>
                    </Link>
                    <br />

                    <ButtonWithProgress  onClick={() => props.onClickDelete(props.showcaseId)}
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

export default ShowcaseCard;