import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../middleware/api';

export default class SwitchCompany extends Component {
  constructor(props) {
    super(props);
    this.switchCompany = this.switchCompany.bind(this);
  }

  switchCompany() {
    api.ajax({
      url: api.company.switch(),
      type: 'POST',
      data: { company_id: this.props.company._id },
    }, () => {
      let USER_SESSION = localStorage.getItem('USER_SESSION')
        ? window.decodeURIComponent(window.atob(localStorage.getItem('USER_SESSION')))
        : '';
      USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
      USER_SESSION = {
        brand_name: USER_SESSION.brand_name,
        brand_logo: USER_SESSION.brand_logo,
        uid: USER_SESSION.uid,
        name: USER_SESSION.name,
        company_id: this.props.company._id,
        company_name: this.props.company.name,
        company_num: this.props.company.company_num,
        has_purchase: 0,
        department: 0,
        department_name: '',
        role: 0,
      };

      this.updateUserPrivileges();
      localStorage.setItem('USER_SESSION', window.btoa(window.encodeURIComponent(JSON.stringify(USER_SESSION))));
    });
  }

  updateUserPrivileges() {
    api.ajax({
      url: api.user.info(),
    }, data => {
      const user = data.res.user;

      let USER_SESSION = localStorage.getItem('USER_SESSION')
        ? window.decodeURIComponent(window.atob(localStorage.getItem('USER_SESSION')))
        : '';
      USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
      USER_SESSION = {
        brand_name: USER_SESSION.brand_name,
        brand_logo: USER_SESSION.brand_logo,
        uid: user._id,
        name: user.name,
        company_id: user.company_id,
        company_name: user.company_name,
        company_num: user.company_num,
        has_purchase: user.has_purchase,
        department: user.department,
        department_name: user.department_name,
        role: user.role,
        user_type: user.user_type,
        is_pos_device: user.is_pos_device,
        cooperation_type_name: user.cooperation_type_name.full_name,
        cooperation_type_short: user.cooperation_type_name.short,
        operation_name: user.operation_name,
        operation_phone: user.operation_phone,
      };

      localStorage.setItem('USER_SESSION', window.btoa(window.encodeURIComponent(JSON.stringify(USER_SESSION))));
      sessionStorage.setItem('menu', '/home');
      /* this.props.type == 'help'
        ? sessionStorage.setItem('menu', '/home')
        : sessionStorage.setItem('menu', '/home');*/
      location.href = '/';
    }, () => {
      location.href = '/';
    });
  }

  render() {
    const { type, returnVisible } = this.props;
    return (
      <span>
        {
          type == 'help' ? !!returnVisible ?
            <div className="returnWord" onClick={this.switchCompany}>
              <p>返回</p>
              <p>后台</p>
            </div> : <div onClick={this.switchCompany} className="return"></div> :
            <a href="javascript:" onClick={this.switchCompany}>进入门店</a>
        }
      </span>
    );
  }
}

SwitchCompany.propTypes = {
  company: PropTypes.object.isRequired,
};
