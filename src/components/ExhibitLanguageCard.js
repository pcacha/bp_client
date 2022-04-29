import React from 'react';

/**
 * Card for showing selected exhibit and language
 * @param props props
 */
function ExhibitLanguageCard(props) {
    return (
        <div className="alert alert-info text-center mb-3">
            <h4 className="alert-heading">{props.exhibitName}</h4>
            <hr />
            <p className="mb-0">
                <span className="font-weight-bold">Language: </span>
                {props.languageName}
            </p>
        </div>
    );
}

export default ExhibitLanguageCard;