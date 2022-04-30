import React from 'react';
import {Link} from "react-router-dom";
import {EXHIBITS_IMAGES_URL} from "../shared/sharedConstants";
import Select from "react-select";

/**
 * card for listing exhibits to approve
 * @param props props
 */
const ApproveExhibitCard = (props) => (
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

                    <div className="mb-3 mt-4">
                        <Select options={props.languages.map(lan => {return {value: lan.languageId, label: lan.name};})}
                                onChange={(event) => props.selectLang(props.exhibitId, event.value)} />
                    </div>
                </div>

                <div className="col-12 col-md-4 col-xl-3 mt-3 mt-xl-0">
                    <Link exact to={"/approve/" + props.exhibitId + "/" + props.lang} className={props.buttonDisabled && "disabled-link"}>
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