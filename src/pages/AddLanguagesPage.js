import React, {Component} from 'react';
import Spinner from "../components/Spinner";
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {Link} from "react-router-dom";

/**
 * Page for adding languages to institution
 */
class AddLanguagesPage extends Component {

    /**
     * current page state
     */
    state = {
        pendingApiCallDownloadLanguages: false,
        possible: [],
        chosen: [],
        filtered: [],
        search: "",
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCallDownloadLanguages: true})
        // load languages
        apiCalls.getMyInstitutionLanguages().then(response => {
            let possible = response.data.possibleLanguages;
            for (let possibleLan of possible) {
                possibleLan.pendingApiCall = false;
            }

            // set fetched languages to state
            const chosen = response.data.chosenLanguages;
            this.setState({possible, chosen, pendingApiCallDownloadLanguages: false});
        }).catch(error => {
            // react on unauthorized state
            return handleError(error);
        });
    }

    /**
     * Called when search box value is changed
     * @param event input event
     */
    onSearchChange = (event) => {
        const value = event.target.value;
        if(value === "") {
            // no languages visible if box is empty
            this.setState({[event.target.name]: value, filtered: []});
        }
        else {
            // filter languages by value in box
            const filtered = this.state.possible.filter(lan => lan.name.toLowerCase().includes(value.toLowerCase()));
            this.setState({[event.target.name]: value, filtered});
        }
    }

    /**
     * Called when new language should be added
     * @param lan added language
     */
    onLanguageAddClick = (lan) => {
        // set pending api call for added language
        let newFiltered = [];
        const {filtered} = this.state;
        for (let fil of filtered) {
            if(fil === lan) {
                newFiltered.push({...fil, pendingApiCall: true,});
            }
            else {
                newFiltered.push({...fil});
            }
        }
        this.setState({filtered: newFiltered});

        // send added language to server
        apiCalls.addInstitutionLanguage(lan.languageId).then(response => {
            // remove language from possible and put it in chosen
            newFiltered = [...filtered];
            newFiltered = newFiltered.filter(fil => lan !== fil);
            let newPossible = [...this.state.possible];
            newPossible = newPossible.filter(pos => lan !== pos);
            let newChosen = [...this.state.chosen];
            newChosen.push({...lan});

            // update state
            this.setState({filtered: newFiltered, possible: newPossible, chosen: newChosen});
        }).catch(error => {
            // handle authentication error
            return handleError(error);
        });
    }

    /**
     * renders add language page
     * @returns {JSX.Element} page
     */
    render() {
        const {
            pendingApiCallDownloadLanguages,
            chosen,
            filtered,
            search,
        } = this.state;

        // if languages are loading show spinner
        if (pendingApiCallDownloadLanguages) {
            return (
                <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                    <Spinner />
                </div>
            );
        }

        // render page
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Add Languages</h2>

                <Link exact to="/myInstitution" >
                    <button type="button" className="btn btn-lg mt-3 btn-info mb-4">
                        <i className="fa fa-search" /> Institution overview
                    </button>
                </Link>


                <div className="row">
                    <div className="col-md-6 ">
                        <div className="input-group mb-4">
                            <input type="text" className="form-control" placeholder="Search language" name="search" value={search} onChange={this.onSearchChange} />
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <i className="fa fa-search" />
                                </span>
                            </div>
                        </div>
                        <div>
                            {
                                filtered.map(lan =>
                                    <ButtonWithProgress  key={lan.languageId}
                                                         onClick={() => this.onLanguageAddClick(lan)}
                                                         className="btn btn-success w-100 my-1"
                                                         disabled={lan.pendingApiCall}
                                                         pendingApiCall={lan.pendingApiCall}
                                                         hasChildren >
                                        <i className="fa fa-plus-circle" /> {lan.name}
                                    </ButtonWithProgress>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-6 px-md-5">
                        {
                            chosen.length === 0 ?
                                <h4>No selected languages</h4>
                                :
                                <div className="card mt-md-0 mt-2">
                                    <ul className="list-group list-group-flush">
                                        { chosen.map(lan =>
                                            <li key={lan.languageId} className="list-group-item">{lan.name}</li>
                                        )}
                                    </ul>
                                </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default AddLanguagesPage;