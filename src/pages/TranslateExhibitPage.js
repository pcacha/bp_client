import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import handleError from "../shared/failureHandler";
import Spinner from "../components/Spinner";
import TranslateExhibitCard from "../components/TranslateExhibitCard";

class TranslateExhibitPage extends Component {

    state = {
        languages: [],
        exhibits: [],
        pendingApiCall: false,
    }

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getExhibitsTranslate(this.props.match.params.institutionId).then(response => {
            let languages = response.data.languages;
            languages.unshift({languageId: -1, name: "Select language"});

            let exhibits = response.data.exhibits;
            for(let ex of exhibits) {
                ex.buttonsDisabled = true;
                ex.lang = -1;
                ex.selectLang = this.selectLang;
            }

            this.setState({languages, exhibits, pendingApiCall: false});
        }).catch(error => {
            return handleError(error);
        });
    }

    selectLang = (exhibitId, languageId) => {
        let exhibits = [];
        for(let ex of this.state.exhibits) {
            if(ex.exhibitId !== exhibitId) {
                exhibits.push(ex);
            }
            else {
                const buttonsDisabled = languageId === "-1";
                exhibits.push({...ex, lang: languageId, buttonsDisabled});
            }
        }
        this.setState({exhibits});
    }

    render() {

        const exhibits = this.state.exhibits.map(ex =>
            <TranslateExhibitCard key={ex.exhibitId} {...ex} languages={this.state.languages} institutionId={this.props.match.params.institutionId} />
        );

        let content = <Spinner/>;
        if (!this.state.pendingApiCall) {
            content = this.state.exhibits.length === 0 ? <h4>There are no exhibits</h4> : exhibits;
        }

        return (
            <div className="mx-auto mt-5 border rounded gray-noise-background container p-md-5 p-2 mb-3">
                <h2 className="mb-5 font-weight-bold">Exhibits</h2>
                {content}
            </div>
        );
    }
}

export default TranslateExhibitPage;