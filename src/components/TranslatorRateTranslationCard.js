import React from 'react';
import parse from "html-react-parser";

const TranslatorRateTranslationCard = (props) => {
    let cardStyle = "card mb-4"
    if(props.isOfficial) {
        cardStyle += " bg-warning";
    }

    let btnClass = "mt-3 btn btn-primary";
    if(!props.liked) {
        btnClass = "mt-3 btn btn-secondary";
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
                        <p className="text-muted">
                            <i className="fa fa-thumbs-up" /> {props.likesCount + "x"}
                        </p>


                        <button onClick={() => props.onLikeChange(props.translationId)} type="button" className={btnClass}>
                            {
                                props.liked ?
                                    <i className="fa fa-thumbs-up" />
                                    :
                                    <i className="fa fa-thumbs-o-up" />
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TranslatorRateTranslationCard;