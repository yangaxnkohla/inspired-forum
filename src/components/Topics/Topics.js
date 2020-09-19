import React from 'react';

import './Topics.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.css';
import Button from 'react-bootstrap/Button';
import NavBar from '../Navbar/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Link } from 'react-router-dom';

import user_img from '../../images/spongebob.png';

import { signout } from '../../helpers/auth';
import { currentuser } from '../../helpers/auth';
import { addPost } from '../../helpers/db';
import { getPosts } from '../../helpers/db';
import { auto_grow } from '../../helpers/util';

import { db } from '../../service/firebase';


class Topics extends React.Component {
  constructor(props) {
    super(props);
    let date = new Date().toLocaleDateString();
    this.state = {
      user: null,
      error: null,
      email: "",
      password: "",
      post: "",
      posts: [],
      date: date
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.getThemPosts = this.getThemPosts.bind(this);
    this.getDateTime = this.getDateTime.bind(this);
  }

  componentDidMount() {
    try {
      this.getThemPosts();
      this.setState({ user: currentuser().displayName });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      return async () => {
        this.setState({ error: "" });
        try {
          await signout();
        } catch (error) {
          this.setState({ error: error.message });
        }
      };
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handlePost(event) {
    event.preventDefault();
    this.setState({ error: "" });
    try {
      this.setState({ posts: [] });
      await addPost(this.state.user, this.state.post, new Date().toLocaleDateString());
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  getThemPosts() {
    let posts = [];
    db.ref('posts/').on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        Object.assign(childData, { id: childKey });
        console.log(childData);
        posts.push(childData);
      });
      posts.reverse();
      this.setState({ posts: posts });
    });
  }

  getDateTime() {
    this.setState({ date: new Date().toLocaleDateString() });
  }

  render() {
    let posts = this.state.posts;
    console.log(posts);
    console.log("Date: " + this.state.date);

    return (
      <div className="Home">
        <NavBar />

        <main>
          <div className="Home-content bg-gray">
            <div className="row">
              <div className="col-1-3 topics">
                <div className="card shadow-sm p-3 mb-2 bg-dark topic-section">
                  <h3 style={{ color: "#fff" }}>
                    Topics
                  </h3>
                  <a href="#" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    #Selenium
                  </a>
                  <a href="#" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    #Appium
                  </a>
                  <a href="#" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    #Ranorex
                  </a>
                  <a href="#" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    #UFT
                  </a>
                  <a href="#" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    #RobotFramework
                  </a>
                  <a href="#" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    #Cypress
                  </a>
                  <a href="#" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    More...
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* <footer><p>Copyright © 2020 Inspired Testing (Pty) Ltd. All rights reserved.</p></footer> */}
      </div>
    );
  }
}

export default Topics;
