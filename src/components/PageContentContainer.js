import React from 'react';

/**
 * Container for main page content
 * @param props props
 */
function PageContentContainer(props) {
    // for authorization pages
    if(props.isAuth) {
        return (
            <div className="container mx-auto my-5 px-3 py-3 px-md-5 py-md-5 border rounded gray-noise-background auth-div">
                {props.children}
            </div>
        );
    }

    return (
        <div className="container mx-auto my-5 px-3 pb-3 pt-3 px-md-5 pb-md-5 pt-md-4 border rounded gray-noise-background">
            {props.children}
        </div>
    );
}

export default PageContentContainer;