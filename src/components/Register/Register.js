import React from 'react';
import { Link } from 'react-router-dom';

import './Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.css';

import { signup } from '../../helpers/auth';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      username: '',
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signup(this.state.username, this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <div className="Register">
        <div className="card">
          <img id="inspired-logo" className="card-img-top" alt="inspired-forum" />
          <form onSubmit={this.handleSubmit} autoComplete="off">
            <div className="username">
              <input id="username" name="username" placeholder="Username" type="name" className="form-control" value={this.state.username} onChange={this.handleChange} required autoFocus />
              <i className="fa fa-user"></i>
            </div>
            <div className="email">
              <input id="email" name="email" placeholder="Email" type="email" className="form-control" value={this.state.email} onChange={this.handleChange} required />
              <i className="fa fa-envelope"></i>
            </div>
            <div className="password">
              <input id="password" name="password" placeholder="Password" type="password" className="form-control" value={this.state.password} onChange={this.handleChange} required />
              <i className="fa fa-key"></i>
            </div>
            {this.state.error ? <p>{this.state.error}</p> : null}
            <button id="submit" type="submit" className="btn btn-primary btn-block">Register</button>
          </form>
        </div>
        <hr></hr>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    );
  }
}

export default Register;