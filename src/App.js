import React, {Component} from 'react';
import Layout from "./components/Layout"
import {Route, Switch, Redirect} from "react-router-dom";
import HomePage from "./pages/HomePage";
import {connect} from "react-redux";


class App extends Component {

  render() {
    const {user} = this.props;

    let routes = (
        <Switch>
          <Route exact path="/" component={HomePage}/>
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
