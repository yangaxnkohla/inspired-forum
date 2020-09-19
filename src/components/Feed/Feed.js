import React from 'react';

import './Feed.css';
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
import history from '../../service/history';

class Feed extends React.Component {
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

  handleParams(path, query, value) {
    history.push({
      pathname: '/' + path,
      search: '?' + query + '=' + value
    });
    history.go(0);
  }

  render() {
    let posts = this.state.posts;
    console.log(posts);
    console.log("Date: " + this.state.date);

    return (
      <div className="Feed">
        <NavBar />

        <main>
          <div className="Feed-content bg-gray">
            <div className="row">
              <div className="col-1-3 welcome">
                <div className="card shadow-sm p-3 mb-2 bg-dark welcome-section">
                  <h3 style={{ color: "#fff" }}>
                    Updates
                  </h3>
                  <a href="https://www.linkedin.com/company/inspired-testing/" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    <b><i className="fa fa-linkedin-square" aria-hidden="true"></i> LinkedIn</b>
                  </a>
                  <a href="https://www.youtube.com/channel/UCkdRNS1Cf-IXe4NPqGXNqyg" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    <b><i className="fa fa-youtube-square" aria-hidden="true"></i> YouTube</b>
                  </a>
                  <a href="https://www.facebook.com/InspiredTesting" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    <b><i className="fa fa-facebook-square" aria-hidden="true"></i> Facebook</b>
                  </a>
                  <a href="https://twitter.com/Inspired_Test" className="card rounded" style={{ height: "50px", margin: "5px", backgroundColor: "rgb(32,32,32)" }}>
                    <b><i className="fa fa-twitter-square" aria-hidden="true"></i> Twitter</b>
                  </a>
                </div>
              </div>
              <div id="myModal" className="col-1-3">
                <div className="card shadow-sm p-3 mb-2 bg-dark post-section" style={{ display: "flex", flexDirection: "row", boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)" }}>
                  <h3 style={{ color: "#fff" }}>
                    Feed
                  </h3>
                </div>
                <div>
                  {posts.map((post) =>
                    <div key={post.id}>
                      <div className="card shadow-sm p-3 mb-2 bg-dark feed-section" > {/* style={{ marginLeft: "10px", marginRight: "10px" }} */}
                        {/* <a style={{ textDecoration: "none" }}> */}
                        <div style={{ display: "flex" }}>
                          <a href="#">
                            <img src={user_img} style={{ width: "50px", height: "50px", borderRadius: "25px", border: "2px solid #000", margin: "5px" }} alt="User" />
                          </a>
                          <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "5px" }}>
                            <a href="#" style={{ color: "#fff" }}>
                              <div style={{ fontSize: "16px", color: "#fff", margin: "0", textAlign: "left" }}>
                                {post.username}
                              </div>
                              <div style={{ fontSize: "12px", color: "#fff", margin: "0", textAlign: "left", marginBottom: "10px" }}>
                                {post.date}
                              </div>
                            </a>
                            <a href="#" style={{ color: "#fff" }} onClick={() => this.handleParams('post', 'id', post.id)}>
                              <div style={{ display: "flex", textAlign: "left" }}>
                                <p style={{ fontSize: "24px", color: "#fff" }}><b>{post.body}</b></p>
                              </div>
                            </a>
                            {/* <div className="btn-group inline">
                              <Button variant="light" type="button" className="inline card rounded bg-light" style={{ marginRight: "5px", height: "40px", width: "100px", color: "#000", alignItems: "center" }}><b><i className="fa fa-thumbs-up inline" style={{ color: "gold" }}></i> Likes <span className="badge badge-warning">404</span></b></Button>
                              <Button variant="light" type="button" className="inline card rounded bg-light" style={{ marginLeft: "5px", height: "40px", width: "100px", color: "#000", alignItems: "center" }}><b><i className="fa fa-comments" style={{ color: "gold" }}></i> Comments <span className="badge badge-warning">404</span></b></Button>
                            </div> */}
                          </div>
                        </div>
                        {/* </a> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-1-3 topics">
                <div className="card shadow-sm p-3 mb-2 bg-dark topic-section" >
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

export default Feed;
