import React from 'react';

/**
 * Container for main page content
 * @param props props
 */
function PageContentContainer(props) {
    return (
        <div className={"container mx-auto my-5 p-3 p-md-5 border rounded gray-noise-background " + (props.isAuth && "auth-div")}>
            {props.children}
        </div>
    );
}

export default PageContentContainer;