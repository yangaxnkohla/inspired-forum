import React, { useState } from 'react';

import './Post.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.css';
import Button from 'react-bootstrap/Button';
import NavBar from '../Navbar/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';

import { Link } from 'react-router-dom';

import user_img from '../../images/spongebob.png';

import { signout } from '../../helpers/auth';
import { currentuser } from '../../helpers/auth';
import { addComment } from '../../helpers/db';
import { getComments } from '../../helpers/db';
import { auto_grow } from '../../helpers/util';

import { db } from '../../service/firebase';
import history from '../../service/history';

class Post extends React.Component {
  constructor(props) {
    super(props);
    let date = new Date().toLocaleDateString();
    this.state = {
      user: null,
      error: null,
      post: {},
      posts: [],
      comment: "",
      comments: [],
      date: date,
      modalShow: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.getComments = this.getComments.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  componentDidMount() {
    try {
      this.getPost();
      this.getComments();
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
      let id = (new URLSearchParams(window.location.search)).get("id");
      await addComment(this.state.user, this.state.comment, new Date().toLocaleDateString(), id);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  getComments() {
    let comments = [];
    let id = (new URLSearchParams(window.location.search)).get("id");
    db.ref('comments/').on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        Object.assign(childData, { id: childKey });
        if (id === childData.postId) {
          console.log(childData);
          comments.push(childData);
        }
      });
      comments.reverse();
      this.setState({ comments: comments });
    });
  }

  getPost() {
    let post = {};
    let id = (new URLSearchParams(window.location.search)).get("id");
    db.ref('posts/').on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        Object.assign(childData, { id: childKey });
        if (childKey === id) {
          post = Object.assign(childData, { id: childKey });
        }
      });
      this.setState({ post: post });
      this.handleHide();
    });
  }

  handleShow() {
    this.setState({ modalShow: true });
  }

  handleHide() {
    this.setState({ modalShow: false });
  }

  render() {
    let post = this.state.post;
    let comments = this.state.comments;
    console.log("===> Date: " + this.state.date);
    console.log("===> Post: " + post);
    console.log("===> Username: " + post.username);
    console.log("===> Comments: " + comments);

    return (
      <div className="Post">
        <NavBar />

        <main>
          <div className="Post-content bg-gray">
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
              <div id="myModal" className="col-1-3" style={{ height: "100%" }}>
                <div>
                  <div>
                    <div className="card shadow-sm p-3 mb-2 bg-dark reply-section"> {/* style={{ marginLeft: "10px", marginRight: "10px" }} */}
                      <div style={{ display: "flex" }}>
                        <a href="#">
                          <img src={user_img} style={{ width: "50px", height: "50px", borderRadius: "25px", border: "2px solid #000", margin: "5px" }} alt="User" />
                        </a>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "5px" }}>
                          <a href="#" style={{ color: "#000" }}>
                            <div style={{ fontSize: "16px", color: "#fff", margin: "0", textAlign: "left" }}>
                              {post.username}
                            </div>
                            <div style={{ fontSize: "12px", color: "#fff", margin: "0", textAlign: "left", marginBottom: "10px" }}>
                              {post.date}
                            </div>
                          </a>
                          <a style={{ color: "#fff" }}>
                            <div style={{ display: "flex", textAlign: "left" }}>
                              <p style={{ fontSize: "24px", color: "#fff" }}><b>{post.body}</b></p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "600px", marginLeft: "20px", marginRight: "20px", backgroundColor: "#fff" }}>
                      <hr />
                    </div>
                    {comments.map((comment) =>
                      <div key={comment.id}>
                        <div className="card shadow-sm p-3 mb-2 bg-dark feed-section"> {/* style={{ marginLeft: "10px", marginRight: "10px" }} */}

                          <div style={{ display: "flex" }}>
                            <a href="#">
                              <img src={user_img} style={{ width: "50px", height: "50px", borderRadius: "25px", border: "2px solid #000", margin: "5px" }} alt="User" />
                            </a>
                            <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "5px" }}>
                              <a href="#" style={{ color: "#000" }}>
                                <div style={{ fontSize: "16px", color: "#fff", margin: "0", textAlign: "left" }}>
                                  {comment.username}
                                </div>
                                <div style={{ fontSize: "12px", color: "#fff", margin: "0", textAlign: "left", marginBottom: "10px" }}>
                                  {comment.date}
                                </div>
                              </a>
                              <a style={{ color: "#000" }}>
                                <div style={{ display: "flex", textAlign: "left" }}>
                                  <p style={{ fontSize: "16x", color: "#fff" }}>{comment.body}</p>
                                </div>
                              </a>
                              {/* <div className="btn-group inline">
                              <Button variant="light" type="button" className="inline card rounded bg-light" style={{ marginRight: "5px", height: "40px", width: "100px", color: "#000", alignItems: "center" }} onClick={()=>this.handleParams('post','id',post.id)}><b><i className="fa fa-thumbs-up inline" style={{ color: "gold" }}></i> Likes <span className="badge badge-warning">404</span></b></Button>
                              <Button variant="light" type="button" className="inline card rounded bg-light" style={{ marginLeft: "5px", height: "40px", width: "100px", color: "#000", alignItems: "center" }} onClick={()=>this.handleParams('post','id',post.id)}><b><i className="fa fa-comments" style={{ color: "gold" }}></i> Comments <span className="badge badge-warning">404</span></b></Button>
                            </div> */}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    <Modal show={this.state.modalShow} onHide={this.handleHide} aria-labelledby="contained-modal-title-vcenter" centered>
                      <Modal.Header className="bg-dark" style={{ color: "#fff" }} closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                          Comment
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="bg-dark">
                        {/* <div className="card shadow-sm p-3 mb-2 bg-white modal-comment-section" style={{ display: "flex", flexDirection: "row", boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)" }}>
                          <a href="#">
                            <img src={user_img} style={{ width: "50px", height: "50px", borderRadius: "25px", border: "1px solid #ddd", margin: "5px" }} alt="User" />
                          </a> */}
                        <Form onSubmit={this.handlePost} action="post" method="POST" className="form-inline" style={{ width: "100%" }}>
                          <FormControl as="textarea" rows="4" type="text" maxLength="250" id="comment" name="comment" placeholder="Write a comment..." className="mr-sm-2" onChange={this.handleChange} style={{ resize: "none", borderRadius: "5px", width: "100%" }} onClick={this.handleShow} required autoFocus />
                          <Button id="commentBtn" variant="primary" type="submit" className="card rounded" style={{ height: "40px", backgroundColor: "rgb(32,32,32)" }}><b><i className="fa fa-paper-plane" style={{ color: "gold" }}></i> Post</b></Button>
                        </Form>
                        {/* </div> */}
                      </Modal.Body>
                      {/* <Modal.Footer>
                        <Button onClick={this.handleHide}>Close</Button>
                      </Modal.Footer> */}
                    </Modal>

                  </div>
                </div>
              </div>

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

              <div className="card shadow-sm p-3 mb-2 bg-dark comment-section" style={{ display: "flex", flexDirection: "row", boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)" }}>
                {/* <a href="#">
                        <img src={user_img} style={{ width: "50px", height: "50px", borderRadius: "25px", border: "1px solid #ddd", margin: "5px" }} alt="User" />
                      </a>
                      <Form onSubmit={this.handlePost} action="post" method="POST" className="form-inline" style={{ width: "100%" }}>
                        <FormControl as="textarea" rows="1" type="text" maxLength="250" id="comment" name="comment" placeholder="Write a comment..." className="mr-sm-2" onChange={this.handleChange} style={{ resize: "none", borderRadius: "25px", width: "440px" }} onClick={this.handleShow} required autoFocus />
                        <Button id="commentBtn" variant="light" type="submit" className="card rounded bg-light" style={{ height: "40px", color: "#000" }}><b><i className="fa fa-paper-plane" style={{ color: "gold" }}></i> Post</b></Button>
                      </Form> */}
                <Button variant="primary" onClick={this.handleShow} style={{ width: "100%", backgroundColor: "rgb(32,32,32)" }}>
                  <b><i className="fa fa-comments" style={{ color: "gold" }}></i> Comment</b>
                </Button>
              </div>

            </div>
          </div>
        </main>
        {/* <footer><p>Copyright © 2020 Inspired Testing (Pty) Ltd. All rights reserved.</p></footer> */}
      </div>
    );
  }
}

export default Post;
