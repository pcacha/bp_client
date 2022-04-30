import React from 'react';
import {Link} from "react-router-dom";
import {EXHIBITS_IMAGES_URL} from "../shared/sharedConstants";
import ButtonWithProgress from "./ButtonWithProgress";

/**
 * card for listing exhibit of user's institution
 * @param props props
 */
const MyExhibitCard = (props) => (
    <div className="card mb-4">
        <div className="card-body">
            <div className="row">
                <div className="col-12 col-xl-3">
                    <img className="img-fluid sizedImg img-thumbnail" src={EXHIBITS_IMAGES_URL + props.image} alt="exhibit" />
                </div>

                <div className="col-12 col-md-8 col-xl-6 mt-3 mt-xl-0">
                    <h3 className="card-title">
                        {props.name}
                    </h3>

                    <div>
                        <span className="font-weight-bold">Creation date: </span>
                        {props.createdAt}
                    </div>

                    {
                        props.building &&
                        <div>
                            <span className="font-weight-bold">Building: </span>
                            {props.building.name}
                        </div>
                    }

                    {
                        props.room &&
                        <div>
                            <span className="font-weight-bold">Room: </span>
                            {props.room.name}
                        </div>
                    }

                    {
                        props.showcase &&
                        <div>
                            <span className="font-weight-bold">Show-case: </span>
                            {props.showcase.name}
                        </div>
                    }
                </div>

                <div className="col-12 col-md-4 col-xl-3 mt-3 mt-xl-0">
                    <Link exact to={"/myInstitution/exhibits/" + props.exhibitId} >
                        <button type="button" className="btn btn-info w-100">
                            <i className="fa fa-pencil" /> Detail
                        </button>
                    </Link>
                    <br />

                    <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => props.onClickDownloadQRCode(props.exhibitId)}>
                        <i className="fa fa-qrcode" /> QR Code
                    </button>
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