import React from "react";

/**
 * card with web info showed on home page
 * @param props props
 */
const themesCard = (props) => (
    <div className="col mt-2 d-flex justify-content-center">
        <div className="my-card border rounded">
            <h3>{props.title}</h3>
            <p className="font-weight-bold">{props.info}</p>
        </div>
    </div>
);

export default themesCard;