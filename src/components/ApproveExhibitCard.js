import React from 'react';
import {Link} from "react-router-dom";
import {EXHIBITS_IMAGES_URL} from "../shared/sharedConstants";

/**
 * card for listing exhibits to approve
 * @param props props
 */
const ApproveExhibitCard = (props) => (
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
                        <select className="custom-select custom-select-lg mb-3 mt-2" onChange={(event) => props.selectLang(props.exhibitId, event.target.value)}>
                            {props.languages.map(lan => <option key={lan.languageId} value={lan.languageId}>{lan.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="col-md-3">
                    <Link exact to={"/approve/" + props.exhibitId + "/" + props.lang}>
                        <button type="button" disabled={props.buttonDisabled} className="btn btn-primary btn-lg w-100">
                            <i className="fa fa-star"/> Approve
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
)

export default ApproveExhibitCard;