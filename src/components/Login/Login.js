import React from 'react';
import { Link } from 'react-router-dom';

import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.css';

import { signin } from '../../helpers/auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
      // [event.target.getAttribute('name')]:event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });
    try {
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <div className="Login">
        <div className="card">
          <img id="inspired-logo" className="card-img-top" alt="inspired-forum" />
          <form onSubmit={this.handleSubmit} autoComplete="off">
            <div className="email">
              <input id="email" name="email" placeholder="Email" type="email" className="form-control" value={this.state.email} onChange={this.handleChange} required autoFocus />
              <i className="fa fa-envelope"></i>
            </div>
            <div className="password">
              <input id="password" name="password" placeholder="Password" type="password" className="form-control" value={this.state.password} onChange={this.handleChange} required />
              <i className="fa fa-key"></i>
            </div>
            {this.state.error ? (<p>{this.state.error}</p>) : null}
            <button id="submit" type="submit" className="btn btn-primary btn-block">Login</button>
          </form>
        </div>
        <hr></hr>
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    );
  }
}

export default Login;
