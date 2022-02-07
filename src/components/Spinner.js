import React from 'react';

/**
 * spinner used for showing loading
 */
const Spinner = () => {
    return (
        <div className="d-flex">
            <div className="spinner-border text-black-50 m-auto">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;