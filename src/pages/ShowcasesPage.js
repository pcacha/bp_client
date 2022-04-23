import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import ShowcaseCard from "../components/ShowcaseCard";
import { Link } from "react-router-dom";
import NoContentMessage from "../components/NoContentMessage";
import PageContentContainer from "../components/PageContentContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import BreadcrumbsLink from "../components/BreadcrumbsLink";
import PageInfo from "../components/PageInfo";

/**
 * page with all showcases of a room defined in url
 */
class ShowcasePage extends Component {

    /**
     * current page state
     */
    state = {
        buildingId: this.props.match.params.buildingId,
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
            <ShowcaseCard key={s.showcaseId} {...s} buildingId={this.state.buildingId} onClickDelete={this.onClickDelete}/>
        );

        // define page content
        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.showcases.length === 0 ? <NoContentMessage text="There are no show-cases"/> : showcases;
        }

        // renders page
        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <BreadcrumbsLink to="/myInstitution" name="My Institution"/>
                    <BreadcrumbsLink to="/myInstitution/buildings/" name="Buildings"/>
                    <BreadcrumbsLink to={"/myInstitution/rooms/" + this.state.buildingId} name="Rooms"/>
                    <li className="breadcrumb-item active">Show-cases</li>
                </Breadcrumbs>

                <PageInfo name="Show-cases">Here you can manage the institution's show-cases to help visitors navigate</PageInfo>
                <Link exact to={"/myInstitution/showcases/" + this.state.buildingId + "/" + this.state.roomId + "/addShowcase"} >
                    <button type="button" className="btn btn-lg mt-3 btn-success mb-4">
                        <i className="fa fa-plus-circle" /> Add new show-case
                    </button>
                </Link>

                {content}
            </PageContentContainer>
        );
    }
}

export default ShowcasePage;