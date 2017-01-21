import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
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
      data: {company_id: this.props.company._id},
    }, () => {
      let USER_SESSION = sessionStorage.getItem('USER_SESSION');
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
      sessionStorage.setItem('USER_SESSION', JSON.stringify(USER_SESSION));
    });
  }

  updateUserPrivileges() {
    api.ajax({
      url: api.user.info(),
    }, (data) => {
      const user = data.res.user;

      let USER_SESSION = sessionStorage.getItem('USER_SESSION');
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
        department: Number(user.department),
        department_name: user.department_name,
        role: Number(user.role),
      };

      sessionStorage.setItem('USER_SESSION', JSON.stringify(USER_SESSION));
      sessionStorage.setItem('menu', 'home');
      location.href = '/';
    }, () => {
      location.href = '/';
    });
  }

  render() {
    return (
      <Button
        className="mr15"
        size="small"
        onClick={this.switchCompany}>
        {/*{this.props.company.name || '选择'}*/}
        选择门店
      </Button>
    );
  }
}

SwitchCompany.propTypes = {
  company: PropTypes.object.isRequired,
};
