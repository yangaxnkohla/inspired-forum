import React from 'react';

import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
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

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date().toLocaleDateString();
        this.state = {
            user: null,
            error: null,
        };
    }

    componentDidMount() {
        try {
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

    render() {
        return (
            <header style={{ boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)" }}>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="navbar">
                    <Navbar.Brand href="/home" style={{ borderColor: "green" }}><img id="home-inspired-logo" width="100px" height="50px" className="img-responsive rounded" alt="inspired-forum" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ backgroundColor: "gray", color: "gray" }} />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/home" className="nav-link" style={{ color: "white" }}><i className="fa fa-home" style={{ color: "gold" }}></i> Home</Nav.Link>
                            <Nav.Link href="/feed" className="nav-link" style={{ color: "white" }}><i className="fa fa-th-list" style={{ color: "gold" }}></i> Feed</Nav.Link>
                            <Nav.Link href="/topics" className="nav-link" style={{ color: "white" }}><i className="fa fa-book" style={{ color: "gold" }}></i> Topics</Nav.Link>
                        </Nav>
                        <Form inline>
                            <FormControl id="search" type="text" placeholder="Search..." className="mr-sm-2" />
                        </Form>
                        <NavDropdown title={<div style={{ display: "inline-block", color: "white" }}><img src={user_img} style={{ width: "30px", height: "30px", borderRadius: "25px", border: "1px solid #000", margin: "5px" }} alt="User" /> {this.state.user}</div>} id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1"><i className="fa fa-user"></i> View Profile</NavDropdown.Item>
                            {/* <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.2"><i className="fa fa-edit"></i> Posts</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3"><i className="fa fa-comments"></i> Comments</NavDropdown.Item> */}
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={signout}><i className="fa fa-times-circle"></i> Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        );
    }
}

export default NavBar;