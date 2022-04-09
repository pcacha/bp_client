import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import ShowcaseCard from "../components/ShowcaseCard";
import { Link } from "react-router-dom";

/**
 * page with all showcases of a room defined in url
 */
class ShowcasePage extends Component {

    /**
     * current page state
     */
    state = {
        roomId: this.props.match.params.roomId,
        showcases: [],
        pendingApiCall: false,
    }

    /**
     * Called when user wants to delete showcase
     * @param showcaseId showcase id
     */
    onClickDelete = (showcaseId) => {
        // ask before delete
        if(window.confirm("Do you really want to delete this show-case?")) {
            // update api call for given showcase
            let newShowcases = [];
            const {showcases} = this.state;
            for (let s of showcases) {
                if(s.showcaseId === showcaseId) {
                    // set api call to true for deleted showcase
                    newShowcases.push({...s, pendingApiCall: true});
                }
                else {
                    newShowcases.push({...s});
                }
            }
            this.setState({showcases: newShowcases});

            // send delete message to server
            apiCalls.deleteShowcase(showcaseId).then(response => {
                newShowcases = [...this.state.showcases];
                newShowcases = newShowcases.filter(s => s.showcaseId !== showcaseId);

                // if delete was successful update state
                this.setState({showcases: newShowcases});
            }).catch(error => {
                // handle unauthorized error
                return handleError(error);
            });
        }
    }

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true});
        // fetch all showcases from server
        apiCalls.getShowcases(this.state.roomId).then(response => {
            const showcases = response.data;
            // set default properties for fetched showcases
            for(let s of showcases) {
                s.pendingApiCall = false;
            }
            this.setState({showcases, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized error
            return handleError(error);
        });
    }

    /**
     * Renders page with showcases
     * @returns {JSX.Element} page with showcases
     */
    render() {

        // maps showcases to showcase cards
        const showcases = this.state.showcases.map(s =>
            <ShowcaseCard key={s.showcaseId} {...s} onClickDelete={this.onClickDelete}/>
        );

        // define page content
        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.showcases.length === 0 ? <h4>There are no show-cases</h4> : showcases;
        }

        // renders page
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Show-cases</h2>
                <Link exact to={"/myInstitution/showcases/" + this.state.roomId + "/addShowcase"} >
                    <button type="button" className="btn btn-lg mt-3 btn-success mb-4">
                        <i className="fa fa-plus-circle" /> Add new show-case
                    </button>
                </Link>

                {content}
            </div>
        );
    }
}

export default ShowcasePage;