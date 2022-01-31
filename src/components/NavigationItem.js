import React from "react";
import {NavLink} from "react-router-dom";

const navigationItem = (props) => (
    <li className="nav-item">
        <NavLink exact activeClassName='active' className="nav-link" to={props.to}>
            {props.children}
        </NavLink>
    </li>
);

export default navigationItem;