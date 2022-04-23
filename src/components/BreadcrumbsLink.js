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
                <a>{props.name}</a>
            </Link>
        </li>
    );
}

export default BreadcrumbsLink;