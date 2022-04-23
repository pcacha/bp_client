import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import MyExhibitCard from "../components/MyExhibitCard";
import NoContentMessage from "../components/NoContentMessage";
import PageContentContainer from "../components/PageContentContainer";
import BreadcrumbsLink from "../components/BreadcrumbsLink";
import Breadcrumbs from "../components/Breadcrumbs";
import PageInfo from "../components/PageInfo";

/**
 * page with all exhibits of an institution that user is managing
 */
class MyInstitutionExhibitsPage extends Component {

    /**
     * current page state
     */
    state = {
        exhibits: [],
        pendingApiCall: false,
    }

    /**
     * Called when user wants to delete exhibit
     * @param exhibitId exhibit id
     */
    onClickDelete = (exhibitId) => {
        // ask before delete
        if(window.confirm("Do you really want to delete this exhibit?")) {
            // update api call for given exhibit
            let newExhibits = [];
            const {exhibits} = this.state;
            for (let ex of exhibits) {
                if(ex.exhibitId === exhibitId) {
                    // set api call to true for deleted exhibit
                    newExhibits.push({...ex, pendingApiCall: true});
                }
                else {
                    newExhibits.push({...ex});
                }
            }
            this.setState({exhibits: newExhibits});

            // send delete message to server
            apiCalls.deleteExhibit(exhibitId).then(response => {
                newExhibits = [...this.state.exhibits];
                newExhibits = newExhibits.filter(ex => ex.exhibitId !== exhibitId);

                // if delete was successful update state
                this.setState({exhibits: newExhibits});
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
        this.setState({pendingApiCall: true})
        // fetch all institution exhibits from server
        apiCalls.getAllExhibitsOfMyInstitution().then(response => {
            const exhibits = response.data;
            // set default properties for fetched exhibits
            for(let ex of exhibits) {
                ex.pendingApiCall = false;
                ex.onClickDelete = this.onClickDelete;
            }
            this.setState({exhibits, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized error
            return handleError(error);
        });
    }

    /**
     * Called when user wants to download QR code for exhibit
     * @param exhibitId
     */
    onClickDownloadQRCode = exhibitId => {
        // download QR code from server
        apiCalls.getQRCode(exhibitId).then(response => {
            // create anchor with given image to start downloading
            let encodedImage = response.data;
            let a = document.createElement("a");
            a.href = "data:image/png;base64," + encodedImage;
            a.download = exhibitId + ".png";
            a.click();
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        });
    }

    /**
     * Renders page with institution exhibits
     * @returns {JSX.Element} page with institution exhibits
     */
    render() {

        // maps exhibits to exhibit cards
        const exhibits = this.state.exhibits.map(ex =>
            <MyExhibitCard key={ex.exhibitId} {...ex} onClickDownloadQRCode={this.onClickDownloadQRCode} />
        );

        // define page content
        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.exhibits.length === 0 ? <NoContentMessage text="There are no exhibits"/> : exhibits;
        }

        // renders page
        return (
            <PageContentContainer>
                <Breadcrumbs>
                    <BreadcrumbsLink to="/myInstitution" name="My Institution"/>
                    <li className="breadcrumb-item active">Exhibits</li>
                </Breadcrumbs>

                <PageInfo name="Exhibits">Here you can manage exhibits and obtain their QR codes, which you can place in the exhibition</PageInfo>
                {content}
            </PageContentContainer>
        );
    }
}

export default MyInstitutionExhibitsPage;