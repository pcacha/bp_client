import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import MyTranslationSequenceCard from "../components/MyTranslationSequenceCard";

/**
 * page with translator sequences of translation
 */
class MyTranslationsPage extends Component {

    /**
     * current page state
     */
    state = {
        sequences: [],
        pendingApiCall: false,
    }

    /**
     * Called when user wants to delete whole sequence
     * @param exhibitId exhibit id
     * @param languageId language id
     */
    onClickDelete = (exhibitId, languageId) => {
        // ask before deleting sequence
        if(window.confirm("Do you really want to delete this translation sequence?")) {
            // start api call for given deleted sequence
            let newSequences = [];
            const {sequences} = this.state;
            for (let s of sequences) {
                if(s.exhibitId === exhibitId && s.languageId === languageId) {
                    // set pending api call to true for sequence that is deleted
                    newSequences.push({...s, pendingApiCall: true});
                }
                else {
                    newSequences.push(s);
                }
            }
            this.setState({sequences: newSequences});

            // request to server to delete sequence
            apiCalls.deleteSequence(exhibitId, languageId).then(response => {
                newSequences = [...this.state.sequences];
                newSequences = newSequences.filter(s => s.exhibitId !== exhibitId || s.languageId !== languageId);

                // update state without sequence
                this.setState({sequences: newSequences});
            }).catch(error => {
                // handles unauthorized state
                return handleError(error);
            });
        }
    }

    /**
     * Called when pge is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch sequences from server
        apiCalls.getMyTranslationSequences().then(response => {
            const sequences = response.data;
            for(let s of sequences) {
                s.pendingApiCall = false;
                s.onClickDelete = this.onClickDelete;
            }
            // update state with fetched sequences
            this.setState({sequences, pendingApiCall: false});
        }).catch(error => {
            // handle unauthorized state
            return handleError(error);
        });
    }

    /**
     * renders page with translation sequences
     * @returns {JSX.Element} page
     */
    render() {

        // map sequences to sequence cards
        const sequences = this.state.sequences.map((s, index) =>
            <MyTranslationSequenceCard key={index} {...s} />
        );

        // define content
        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.sequences.length === 0 ? <h4>There are no translation sequences</h4> : sequences;
        }

        // render page
        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Translation Sequences</h2>
                {content}
            </div>
        );
    }
}

export default MyTranslationsPage;