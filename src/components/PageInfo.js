import React from 'react';

/**
 * Info banner for pages
 * @param props props
 */
function PageInfo(props) {
    return (
        <div className="d-flex justify-content-center mt-2 mb-4">
            <div className="text-center info-banner py-4 px-5 d-flex flex-column-reverse justify-content-center border rounded">
                <div className="">
                    <h2>{props.name}</h2>
                    <h5>{props.children}</h5>
                </div>
            </div>
        </div>
    );
}

export default PageInfo;