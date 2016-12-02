import React, {Component} from "react";
import LoginForm from "../components/forms/LoginForm";

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    if (USER_SESSION) USER_SESSION = JSON.parse(USER_SESSION);
    const uid = USER_SESSION.uid;
    if (!!uid) {
      location.hash = ''
    }
  }

  render() {
    return (
      <div>
        <div className="form-container">
          <div className="card-box center-box">
            <h3 className="card-title">登录</h3>
            <LoginForm/>
          </div>
        </div>
      </div>
    )
  }
}

