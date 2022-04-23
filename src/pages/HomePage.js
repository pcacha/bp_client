import React from "react";
import Jumbotron from "../components/Jumbotron";
import ThemesCard from "../components/ThemesCard";
import {Link} from "react-router-dom";

/**
 * home page definition
 * @param props page props
 * @returns {JSX.Element} home page
 */
const home = (props) => (
    <div className="bg-white">
        <Jumbotron/>

        <div className="container mt-5 pb-5">
            <div className="row">
                <div className="col d-flex justify-content-center align-items-center flex-column">
                    <h3>Our goals</h3>
                    <p>The site is intended for anyone who wants to participate in community translation of information texts of cultural institutions</p>
                </div>
            </div>
            <div className="row mt-3 pb-5">
                <ThemesCard title="Become a Translator" info="Join the community of translators and start translating today!"/>

                <ThemesCard title="Register Your Institution"
                            info="Register your institution and let the community translate your chosen information texts!"/>

                <ThemesCard title="Mobile Application"
                            info="Visitors to your cultural institution will be able to find the translated texts in our mobile application!"/>
            </div>
            <div className="row d-flex justify-content-center align-items-center flex-column">
                <div className="p-4">
                    <Link exact to="/info" >
                        <button type="button" className="btn btn-lg btn-success">
                            <i className="fa fa-flag-checkered" /> GET STARTED!
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default home;