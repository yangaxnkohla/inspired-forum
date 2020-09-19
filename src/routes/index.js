import React from "react";
import { Route, Redirect, Switch, BrowserRouter as Router } from "react-router-dom";

//import Route from "./Route";
import '../../node_modules/font-awesome/css/font-awesome.css';

import Welcome from ".././components/Welcome/Welcome";
import Login from ".././components/Login/Login";
import Register from ".././components/Register/Register";
import Home from ".././components/Home/Home";
import Feed from ".././components/Feed/Feed";
import SearchResults from ".././components/SearchResults/SearchResults";
import Post from ".././components/Post/Post";
import Profile from ".././components/Profile/Profile";
import Topics from ".././components/Topics/Topics";

import { auth } from '../service/firebase';

class Routes extends React.Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true,
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    })
  }

  PrivateRoute({ component: Component, authenticated, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) => authenticated === true
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
      />
    )
  }
  
  PublicRoute({ component: Component, authenticated, ...rest }) {
    if(Component === {Register}){
      return (
        <Route path="/register" exact component={Register} />
      )
    }
    return (
      <Route
        {...rest}
        render={(props) => authenticated === false
          ? <Component {...props} />
          : <Redirect to='/home' />}
      />
    )
  }
  
  render() {
    return this.state.loading === true ? <h2>Loading<i className="fa fa-spinner fa-spin"></i></h2> : (
      <Router>
        <Switch>
          <Route path="/" exact component={Welcome} />
          <this.PublicRoute path="/login" authenticated={this.state.authenticated} component={Login} />
          <this.PublicRoute path="/register" authenticated={this.state.authenticated} component={Register} />
          <this.PrivateRoute path="/home" authenticated={this.state.authenticated} component={Home} />
          <this.PrivateRoute path="/feed" authenticated={this.state.authenticated} component={Feed} />
          <this.PrivateRoute path="/results" authenticated={this.state.authenticated} component={SearchResults} />
          <this.PrivateRoute path="/topics" authenticated={this.state.authenticated} component={Topics} />
          <this.PrivateRoute path="/post" authenticated={this.state.authenticated} component={Post} />
          <this.PrivateRoute path="/profile" authenticated={this.state.authenticated} component={Profile} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
