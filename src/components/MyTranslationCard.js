import React from 'react';
import parse from "html-react-parser";
import ButtonWithProgress from "./ButtonWithProgress";
import DOMPurify from 'dompurify';

/**
 * card for listing sequence translations
 * @param props props
 */
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
                        <p>{props.createdAt}</p>
                        {
                            props.isOfficial &&
                            <span className="font-weight-bold">official</span>
                        }
                    </div>

                    <div className="col-md-8">
                        <div className="bg-light border rounded p-2">
                            {parse(DOMPurify.sanitize(props.translatedText))}
                        </div>
                    </div>

                    <div className="col-md-2 mt-md-0 mt-2">
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