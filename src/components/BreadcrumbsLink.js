import React from 'react';
import {Link} from "react-router-dom";

/**
 * Link used in breadcrumbs
 * @param props props
 */
function BreadcrumbsLink(props) {
    return (
        <li className="breadcrumb-item">
            <Link exact to={props.to}>
                <button className="button-link">{props.name}</button>
            </Link>
        </li>
    );
}

export default BreadcrumbsLink;