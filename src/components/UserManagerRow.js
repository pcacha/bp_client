import React from 'react';
import Link from "react-router-dom/es/Link";

/**
 * one row in table representing system user
 * @param props props
 */
function UserManagerRow(props) {
    return (
        <tr>
            <td>{props.username}</td>
            <td>{new Date(props.createdAt).toLocaleDateString("en-US")}</td>
            <td>{props.email}</td>
            <td>
                <Link exact to={"/users/" + props.userId}>
                    <button type="button" className="btn btn-info w-100">
                        <i className="fa fa-search" /> Detail
                    </button>
                </Link>
            </td>
        </tr>
    );
}

export default UserManagerRow;