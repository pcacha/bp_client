import React from "react";

/**
 * homepage jumbotron
 * @param props props
 */
const jumbotron = (props) => (
    <div className="intro">
        <div className="jumbotron jumbotron-fluid bg-transparent">
            <div className="container">
                <div className="blurred-black p-3 rounded-lg">
                    <h1 className="display-4 font-weight-bold">The System for Community Translation of Information Texts</h1>
                    <p className="lead font-weight-bold">The place where you can show your skill while helping cultural institutions to grow</p>
                </div>
            </div>
        </div>
    </div>
);

export default jumbotron;