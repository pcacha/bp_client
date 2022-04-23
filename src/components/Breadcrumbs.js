import React from 'react';
import {Link} from "react-router-dom";

/**
 * component for creating breadcrumbs navigation
 * @param props props
 */
function Breadcrumbs(props) {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link exact to="/">
                        <a><span className="fa fa-home"/></a>
                    </Link>
                </li>
                {props.children}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;