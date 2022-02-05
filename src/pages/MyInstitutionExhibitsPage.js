import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import MyExhibitCard from "../components/MyExhibitCard";
import {getQRCode} from "../apiCalls/apiCalls";

class MyInstitutionExhibitsPage extends Component {

    state = {
        exhibits: [],
        pendingApiCall: false,
    }

    onClickDelete = (exhibitId) => {
        if(window.confirm("Do you really want to delete this exhibit?")) {
            let newExhibits = [];
            const {exhibits} = this.state;
            for (let ex of exhibits) {
                if(ex.exhibitId === exhibitId) {
                    newExhibits.push({...ex, pendingApiCall: true});
                }
                else {
                    newExhibits.push({...ex});
                }
            }
            this.setState({exhibits: newExhibits});

            apiCalls.deleteExhibit(exhibitId).then(response => {
                newExhibits = [...this.state.exhibits];
                newExhibits = newExhibits.filter(ex => ex.exhibitId !== exhibitId);

                this.setState({exhibits: newExhibits});
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getAllExhibitsOfMyInstitution().then(response => {
            const exhibits = response.data;
            for(let ex of exhibits) {
                ex.pendingApiCall = false;
                ex.onClickDelete = this.onClickDelete;
            }
            this.setState({exhibits, pendingApiCall: false});
        }).catch(error => {
            return handleError(error);
        });
    }

    onClickDownloadQRCode = exhibitId => {
        apiCalls.getQRCode(exhibitId).then(response => {
            let encodedImage = response.data;
            let a = document.createElement("a"); //Create <a>
            a.href = "data:image/png;base64," + encodedImage; //Image Base64 Goes here
            a.download = exhibitId + ".png"; //File name Here
            a.click(); //Downloaded file
        }).catch(error => {
            return handleError(error);
        });
    }

    render() {

        const exhibits = this.state.exhibits.map(ex =>
            <MyExhibitCard key={ex.exhibitId} {...ex} onClickDownloadQRCode={this.onClickDownloadQRCode} />
        );

        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.exhibits.length === 0 ? <h4>There are no exhibits</h4> : exhibits;
        }

        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Institution Exhibits</h2>
                {content}
            </div>
        );
    }
}

export default MyInstitutionExhibitsPage;