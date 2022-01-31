import React from "react";

const Input = (props) => {
    let inputClassName = "form-control";

    if(props.type === "file") {
        inputClassName += " custom-file-input";
    }

    if(props.hasError !== undefined) {
        inputClassName += props.hasError ? " is-invalid" : " is-valid";
    }

    return (
        <>
            {
                props.label &&
                <label className={props.boldLabel && "font-weight-bold"}>{props.label}</label>
            }

            {
                props.type === "file" ?
                    <div className="custom-file">
                        <input type="file" className={inputClassName} id="institutionImageFile" name={props.name} value={props.value} onChange={props.onChange}
                            accept= {props.onlyImage && ".jpg, .png, .jpeg"} />
                        <label className="custom-file-label" htmlFor="institutionImageFile">{props.placeholder}</label>
                    </div>
                    :
                    <input className={inputClassName} type={props.type || "text"} name={props.name}
                           placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
            }

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