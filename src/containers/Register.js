import React, {Component} from "react";
import RegisterForm from "../components/forms/RegisterForm";

export default class Register extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let logoImage = App.session.brand_logo ? require('../images/'+App.session.brand_logo) : '';

    return (
      <div>
        <header class="clearfix">
          <a href="#" className="logo">
            <img src={logoImage} alt={App.session.brand_name}/>
          </a>
          <em className="bar"></em>
          <a href="#" className="store">{App.session.company_name}</a>

          <nav className="nav">
            <ul>
              <li><a href="#/login">登录</a></li>
            </ul>
          </nav>
        </header>

        <div className="card-box center-box">
          <h3 className="card-title">注册</h3>
          <RegisterForm/>
        </div>
      </div>
    )
  }
}

