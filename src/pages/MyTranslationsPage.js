import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import MyTranslationSequenceCard from "../components/MyTranslationSequenceCard";

class MyTranslationsPage extends Component {

    state = {
        sequences: [],
        pendingApiCall: false,
    }

    onClickDelete = (exhibitId, languageId) => {
        if(window.confirm("Do you really want to delete this translation sequence?")) {
            let newSequences = [];
            const {sequences} = this.state;
            for (let s of sequences) {
                if(s.exhibitId === exhibitId && s.languageId === languageId) {
                    newSequences.push({...s, pendingApiCall: true});
                }
                else {
                    newSequences.push(s);
                }
            }
            this.setState({sequences: newSequences});

            apiCalls.deleteSequence(exhibitId, languageId).then(response => {
                newSequences = [...this.state.sequences];
                newSequences = newSequences.filter(s => s.exhibitId !== exhibitId || s.languageId !== languageId);

                this.setState({sequences: newSequences});
            }).catch(error => {
                return handleError(error);
            });
        }
    }

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getMyTranslationSequences().then(response => {
            const sequences = response.data;
            for(let s of sequences) {
                s.pendingApiCall = false;
                s.onClickDelete = this.onClickDelete;
            }
            this.setState({sequences, pendingApiCall: false});
        }).catch(error => {
            return handleError(error);
        });
    }

    render() {

        const sequences = this.state.sequences.map((s, index) =>
            <MyTranslationSequenceCard key={index} {...s} />
        );

        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.sequences.length === 0 ? <h4>There are no translation sequences</h4> : sequences;
        }

        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Translation Sequences</h2>
                {content}
            </div>
        );
    }
}

export default MyTranslationsPage;