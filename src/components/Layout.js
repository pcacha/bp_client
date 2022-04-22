import React from "react";
import Navigation from "./Navigation"
import Footer from "./Footer"

/**
 * web layout
 * @param props props
 */
const layout = (props) => (
    <>
        <div className="minimal-content-height">
            <Navigation />
            <section>
                {props.children}
            </section>
        </div>
        <Footer />
    </>
);

export default layout;