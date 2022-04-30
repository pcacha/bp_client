import React from 'react';
import langIcon from "../assets/lang-icon.png";
import institutionIcon from "../assets/institution-icon.png";

function InfoPage(props) {
    return (
        <div className="bg-white">
            <div className="w-100 info-page-div">
                <div className="container h-100 d-flex align-items-bottom flex-column-reverse">
                    <h1 className="display-3 font-weight-bold text-white">How does it work?</h1>
                </div>
            </div>

            <div className="container py-4 mt-5">
                <div className="row">
                    <div className="col-12 col-md-6 d-flex justify-content-center">
                        <div className="d-flex flex-column-reverse justify-content-center">
                            <img alt="translate" src={langIcon} className="img-fluid info-icon"/>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 mt-5 mt-md-0 d-flex justify-content-center">
                        <div className="d-flex flex-column justify-content-center">
                            <div>
                                <p className="h3 mb-3">As a translator you can:</p>
                                <ul>
                                    <li>
                                        <p className="h5">
                                            After selecting a cultural institution, an exhibit and a language in the <span className="font-weight-bold">Translate</span> tab, you can translate the information label or give likes to the translations of other translators
                                        </p>
                                    </li>
                                    <li>
                                        <p className="h5">
                                            All your translations are being versioned, you can see all your translation sequences in the <span className="font-weight-bold">My Translations</span> tab
                                        </p>
                                    </li>
                                    <li>
                                        <p className="h5">
                                            After clicking on the detail of a translation sequence, you will see all the translations of the sequence and you can use the <span className="font-weight-bold">Rollback</span> button to return to a previous version
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 mb-5">
                    <div className="col-12 col-md-6 d-flex justify-content-center">
                        <div className="d-flex flex-column justify-content-center">
                            <div>
                                <p className="h3 mb-3">As an institution administrator you can:</p>
                                <ul>
                                    <li>
                                        <p className="h5">
                                            In the <span className="font-weight-bold">My Institution</span> tab, you can create your own cultural institution and become its administrator
                                        </p>
                                    </li>
                                    <li>
                                        <p className="h5">
                                            In the <span className="font-weight-bold">My Institution</span> tab, you can then click on <span className="font-weight-bold">Languages</span> and add the languages you want for your visitors and the translators will translate informational labels into them
                                        </p>
                                    </li>
                                    <li>
                                        <p className="h5">
                                            From the <span className="font-weight-bold">My Institution</span> tab, you can also add new exhibits and manage them
                                        </p>
                                    </li>
                                    <li>
                                        <p className="h5">
                                            In the <span className="font-weight-bold">Approve</span> tab you can select an exhibit and a language and then choose the best translation that is available. It will be then displayed to visitors in the mobile application.
                                        </p>
                                    </li>
                                    <li>
                                        <p className="h5">
                                            When you view all the exhibits of your cultural institution, you can download images with <span className="font-weight-bold">QR codes</span>, which you can then place in the exhibition. Visitors then scan them and see official translations
                                        </p>
                                    </li>
                                    <li>
                                        <p className="h5">
                                            From the <span className="font-weight-bold">My Institution</span> tab, you can also add buildings, rooms and show-cases of your institution after clicking <span className="font-weight-bold">Navigation</span> button. It will help visitors to orientate
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 mt-5 mt-md-0 d-flex justify-content-center">
                        <div className="d-flex flex-column-reverse justify-content-center">
                            <img alt="institution" src={institutionIcon} className="img-fluid info-icon"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoPage;