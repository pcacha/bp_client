import React from 'react';

/**
 * card for listing exhibits to approve
 * @param props props
 */
const NoContentMessage = (props) => (
    <div className={"alert alert-warning " + props.classes} role="alert">
        <i className="fa fa-exclamation-circle" /> {props.text}
    </div>
)

export default NoContentMessage;