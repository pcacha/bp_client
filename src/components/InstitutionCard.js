import React from 'react';
import {Link} from "react-router-dom";
import {INSTITUTIONS_IMAGES_URL} from "../shared/sharedConstants";

/**
 * card for listing institutions
 * @param props props
 */
const InstitutinCard = (props) => (
    <div className="card mb-4">
        <div className="card-body">
            <div className="row">
                <div className="col-md-3">
                    <img className="img-fluid sizedImg img-thumbnail" src={INSTITUTIONS_IMAGES_URL + props.image} alt="image" />
                </div>

                <div className="col-md-6">
                    <h3 className="card-title mt-3 mt-md-0">
                        {props.name}
                    </h3>

                    <div>
                        <span className="font-weight-bold">Address: </span>
                        {props.address}
                    </div>

                    <div className="mt-2">
                        {props.description}
                    </div>
                </div>

                <div className="col-md-3">
                    <Link exact to={"/institutions/" + props.institutionId}>
                        <button type="button" className="btn btn-info btn-lg w-100 mt-3 mt-md-0">
                            <i className="fa fa-bars" /> Exhibits
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
)

export default InstitutinCard;