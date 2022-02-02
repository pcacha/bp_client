import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import MyExhibitCard from "../components/MyExhibitCard";

class MyInstitutionExhibitsPage extends Component {

    state = {
        exhibits: [],
        pendingApiCall: false,
    }

    onClickDelete = (exhibitId) => {
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
            newExhibits = [...exhibits];
            newExhibits = newExhibits.filter(ex => ex.exhibitId !== exhibitId);

            this.setState({exhibits: newExhibits});
        }).catch(error => {
            return handleError(error);
        });
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

    render() {

        const exhibits = this.state.exhibits.map(ex =>
            <MyExhibitCard key={ex.exhibitId} {...ex} />
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