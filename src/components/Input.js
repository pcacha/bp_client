import React from "react";

/**
 * generic input used in forms
 * @param props props
 */
const Input = (props) => {
    let inputClassName = "form-control";

    if(props.type === "file") {
        inputClassName += " custom-file-input";
    }

    if(props.hasError !== undefined) {
        inputClassName += props.hasError ? " is-invalid" : " is-valid";
    }

    let renderedInput = (
        <input className={inputClassName} type={props.type || "text"} name={props.name}
               placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    );

    if(props.type === "file") {
        renderedInput = (
            <div className="custom-file">
                <input type="file" className={inputClassName} id="institutionImageFile" name={props.name} value={props.value} onChange={props.onChange}
                       accept= {props.onlyImage && ".jpg, .png, .jpeg"} />
                <label className="custom-file-label" htmlFor="institutionImageFile">{props.placeholder}</label>
            </div>
        );
    }
    else if (props.type === "textarea") {
        renderedInput = (
            <textarea className={inputClassName} name={props.name} placeholder={props.placeholder} value={props.value}
                      onChange={props.onChange} rows="3" />
        );
    }

    return (
        <>
            {
                props.label &&
                <label className="font-weight-bold">{props.label}</label>
            }

            {renderedInput}

            {
                props.hasError &&
                <div className="text-danger">
                    <small>{props.error}</small>
                </div>
            }
        </>
    );
}

export default Input;