import React from "react";

/**
 * button with progress spinner
 * @param props props
 */
const ButtonWithProgress = (props) => {
    return (
        <button disabled={props.disabled}
                className={props.className || "btn btn-primary"} onClick={props.onClick}>

            {
                props.pendingApiCall &&
                <div className="spinner-border
                text-light spinner-border-sm mr-1">
                    <span className="sr-only">Loading...</span>
                </div>
            }

            {
                props.hasChildren ?
                    props.children
                    :
                    props.text
            }

        </button>
    )
}

export default ButtonWithProgress;