import React, {Component} from 'react';
import Layout from "./components/Layout"
import {Route, Switch, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import MyInstitutionPage from "./pages/MyInstitutionPage";
import AddLanguagesPage from "./pages/AddLanguagesPage";
import AddExhibitPage from "./pages/AddExhibitPage";
import MyInstitutionExhibitsPage from "./pages/MyInstitutionExhibitsPage";
import UpdateExhibitPage from "./pages/UpdateExhibitPage";
import TranslateInstitutionsPage from "./pages/TranslateInstitutionsPage";
import TranslateExhibitPage from "./pages/TranslateExhibitPage";
import NewTranslationPage from "./pages/NewTranslationPage";
import TranslatorRatePage from "./pages/TranslatorRatePage";
import ApproveExhibitPage from "./pages/ApproveExhibitPage";
import OwnerRatePage from "./pages/OwnerRatePage";


class App extends Component {

  render() {
    const {user} = this.props;

    let routes = (
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Route exact path="/signup" component={SignupPage}/>
          {user.isLoggedIn && <Route exact path="/profile" component={ProfilePage} />}
          {user.isLoggedIn && <Route exact path="/myInstitution" component={MyInstitutionPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/addLanguages" component={AddLanguagesPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/addExhibit" component={AddExhibitPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/exhibits" component={MyInstitutionExhibitsPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/exhibits/:exhibitId" component={UpdateExhibitPage} />}
          {user.isInstitutionOwner && <Route exact path="/approve" component={ApproveExhibitPage} />}
          {user.isInstitutionOwner && <Route exact path="/approve/:exhibitId/:languageId" component={OwnerRatePage} />}
          {user.isTranslator && <Route exact path="/institutions" component={TranslateInstitutionsPage} />}
          {user.isTranslator && <Route exact path="/institutions/:institutionId" component={TranslateExhibitPage} />}
          {user.isTranslator && <Route exact path="/institutions/:institutionId/translate/:exhibitId/:languageId" component={NewTranslationPage} />}
          {user.isTranslator && <Route exact path="/institutions/:institutionId/rate/:exhibitId/:languageId" component={TranslatorRatePage} />}
          <Redirect to="/"/>
        </Switch>
    );

    return (
        <Layout>
          {routes}
        </Layout>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state,
  };
}

export default connect(mapStateToProps)(App);
