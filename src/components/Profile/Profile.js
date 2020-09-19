import React from 'react';

import history from '../../service/history';

import './Profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Profile">
          <h1>Hello World</h1>
      </div>
    );
  }
}

export default Profile;