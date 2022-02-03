import React from 'react';
import parse from "html-react-parser";
import ButtonWithProgress from "./ButtonWithProgress";

const OwnerRateTranslationCard = (props) => {
    let cardStyle = "card mb-4"
    if(props.isOfficial) {
        cardStyle += " bg-warning";
    }

    let likeBtnClass = "btn btn-primary";
    if(!props.liked) {
        likeBtnClass = "btn btn-secondary";
    }

    let officialBtnClass = "btn btn-success w-100 mt-3";
    if(!props.isOfficial) {
        officialBtnClass = "btn btn-secondary w-100 mt-3";
    }

    return (
        <div className={cardStyle}>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-2">
                        <h5>
                            {props.authorUsername}
                        </h5>
                        <p>{props.createdAt}</p>
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

                            <button onClick={() => props.onLikeChange(props.translationId)} type="button" className={likeBtnClass}>
                                {
                                    props.liked ?
                                        <i className="fa fa-thumbs-up" />
                                        :
                                        <i className="fa fa-thumbs-o-up" />
                                }
                            </button>
                        </div>

                        <ButtonWithProgress  onClick={() => props.onOfficialChange(props.translationId)}
                                             className={officialBtnClass}
                                             disabled={props.pendingApiCallSetOfficial}
                                             pendingApiCall={props.pendingApiCallSetOfficial}
                                             hasChildren>
                            {
                                props.isOfficial ?
                                    <div><i className="fa fa-star" /> Official </div>
                                    :
                                    <div><i className="fa fa-star-o" /> Official </div>
                            }
                        </ButtonWithProgress>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerRateTranslationCard;