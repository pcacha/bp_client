import React from 'react';
import parse from "html-react-parser";
import ButtonWithProgress from "./ButtonWithProgress";

const MyTranslationCard = (props) => {
    let cardStyle = "card mb-4"
    if(props.isOfficial) {
        cardStyle += " bg-warning";
    }

    return (
        <div className={cardStyle}>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-2">
                        <h4>
                            {props.order + "."}
                        </h4>
                        <p>{new Date(props.createdAt).toLocaleDateString("en-US")}</p>
                        {
                            props.isOfficial &&
                            <span className="font-weight-bold">official</span>
                        }
                    </div>

                    <div className="col-md-8">
                        <div className="bg-light border rounded p-2">
                            {parse(props.translatedText)}
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="d-flex justify-content-between">
                            <div className="text-info mt-1">
                                <i className="fa fa-thumbs-up" /> {props.likesCount + "x"}
                            </div>
                        </div>
                        {
                            props.index !== 0 &&
                            <ButtonWithProgress  onClick={() => props.onRollback(props.translationId, props.index)}
                                                 className="btn btn-danger w-100 mt-3 mb-2"
                                                 disabled={props.pendingApiCall}
                                                 pendingApiCall={props.pendingApiCall}
                                                 hasChildren>
                                <i className="fa fa-times" /> Rollback
                            </ButtonWithProgress>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyTranslationCard;