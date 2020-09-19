import React from 'react';

import './Welcome.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from 'react-router-dom';

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleChange(event) {
        this.setState({
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="Welcome">
                <div className="card">
                    <img id="inspired-logo" className="card-img-top" alt="inspired-forum" />
                    <div>
                        <Link to="/login" className="btn btn-primary btn-block">Login</Link>
                        <Link to="/register" className="btn btn-secondary btn-block">Register</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Welcome;
