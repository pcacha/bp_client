import React from "react";
import Navigation from "./Navigation"
import Footer from "./Footer"

/**
 * web layout
 * @param props props
 */
const layout = (props) => (
    <>
        <Navigation />
        {props.children}
        <Footer />
    </>
);

export default layout;