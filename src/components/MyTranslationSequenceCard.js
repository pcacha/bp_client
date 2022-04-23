import React from 'react';
import {Link} from "react-router-dom";
import {EXHIBITS_IMAGES_URL} from "../shared/sharedConstants";
import ButtonWithProgress from "./ButtonWithProgress";

/**
 * card for listing user's translation sequences
 * @param props props
 */
const MyTranslationSequenceCard = (props) => (
    <div className="card mb-4">
        <div className="card-body">
            <div className="row">
                <div className="col-md-3">
                    <img className="img-fluid sizedImg img-thumbnail" src={EXHIBITS_IMAGES_URL + props.exhibitImage} alt="exhibit" />
                </div>

                <div className="col-md-6">
                    <h3 className="card-title">
                        {props.institutionName}
                    </h3>

                    <h5>
                        Exhibit: {props.exhibitName}
                    </h5>

                    <div>
                        <span className="font-weight-bold">Language: </span>
                        {props.language}
                    </div>

                    <div>
                        <span className="font-weight-bold">Latest activity: </span>
                        {new Date(props.latestTranslationCreatedAt).toLocaleDateString("en-US")}
                    </div>
                </div>

                <div className="col-md-3 mt-3 mt-md-0">
                    <Link exact to={"/myTranslations/" + props.exhibitId + "/" + props.languageId} >
                        <button type="button" className="btn btn-info w-100">
                            <i className="fa fa-bars" /> Open
                        </button>
                    </Link>
                    <br />

                    <ButtonWithProgress  onClick={() => props.onClickDelete(props.exhibitId, props.languageId)}
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

export default MyTranslationSequenceCard;