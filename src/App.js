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
import MyTranslationsPage from "./pages/MyTranslationsPage";
import TranslationSequencePage from "./pages/TranslationSequencePage";
import UserManagerPage from "./pages/UserManagerPage";
import UserDetailPage from "./pages/UserDetailPage";
import BuildingsPage from "./pages/BuildingsPage";
import AddBuildingPage from "./pages/AddBuildingPage";
import UpdateBuildingPage from "./pages/UpdateBuildingPage";
import RoomsPage from "./pages/RoomsPage";
import AddRoomPage from "./pages/AddRoomPage";
import UpdateRoomPage from "./pages/UpdateRoomPage";
import ShowcasesPage from "./pages/ShowcasesPage";
import AddShowcasePage from "./pages/AddShowcasePage";
import UpdateShowcasePage from "./pages/UpdateShowcasePage";
import InfoPage from "./pages/InfoPage";


/**
 * high level component representing whole app
 */
class App extends Component {

  render() {
    const {user} = this.props;

    // all routes available in app with its authorization
    let routes = (
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/info" component={InfoPage}/>
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
          {user.isInstitutionOwner && <Route exact path="/myInstitution/buildings" component={BuildingsPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/buildings/addBuilding" component={AddBuildingPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/buildings/:buildingId" component={UpdateBuildingPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/rooms/:buildingId" component={RoomsPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/rooms/:buildingId/addRoom" component={AddRoomPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/rooms/:buildingId/:roomId" component={UpdateRoomPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/showcases/:buildingId/:roomId" component={ShowcasesPage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/showcases/:buildingId/:roomId/addShowcase" component={AddShowcasePage} />}
          {user.isInstitutionOwner && <Route exact path="/myInstitution/showcases/:buildingId/:roomId/:showcaseId" component={UpdateShowcasePage} />}
          {user.isTranslator && <Route exact path="/institutions" component={TranslateInstitutionsPage} />}
          {user.isTranslator && <Route exact path="/institutions/:institutionId" component={TranslateExhibitPage} />}
          {user.isTranslator && <Route exact path="/institutions/:institutionId/translate/:exhibitId/:languageId" component={NewTranslationPage} />}
          {user.isTranslator && <Route exact path="/institutions/:institutionId/rate/:exhibitId/:languageId" component={TranslatorRatePage} />}
          {user.isTranslator && <Route exact path="/myTranslations" component={MyTranslationsPage} />}
          {user.isTranslator && <Route exact path="/myTranslations/:exhibitId/:languageId" component={TranslationSequencePage} />}
          {user.isAdmin && <Route exact path="/users" component={UserManagerPage} />}
          {user.isAdmin && <Route exact path="/users/:userId" component={UserDetailPage} />}
          <Redirect to="/"/>
        </Switch>
    );

    // renders app
    return (
        <Layout>
          {routes}
        </Layout>
    );
  }
}


/**
 * maps redux state to props
 * @param state redux state
 */
const mapStateToProps = (state) => {
  return {
    user: state,
  };
}

export default connect(mapStateToProps)(App);
