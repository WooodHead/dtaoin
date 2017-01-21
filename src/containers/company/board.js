import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';
import fetch from 'isomorphic-fetch';
import api from '../../middleware/api';
import NewCompanyModal from './New';
import SwitchCompany from '../../components/popover/SwitchCompany';

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
    };
  }

  componentWillMount() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
    const department = USER_SESSION ? USER_SESSION.department : undefined;

    if (department < 0) {
      this.getCompanies();
    }
  }

  getCompanies() {
    fetch(api.company.list(), {mode: 'cors', credentials: 'include'})
      .then(response => response.json())
      .then(data => {
        this.setState({companies: data.res.company_list});
      });
  }

  render() {
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};
    const department = USER_SESSION ? USER_SESSION.department : undefined;
    const {companies} = this.state;

    if (department > 0) {
      return '';
    }

    return (
      <div>
        <Row className="mb10">
          <Col span={24}>
            <NewCompanyModal />
          </Col>
        </Row>

        <Card title="店面预览">
          <ul>
            {
              companies && companies.map(company =>
                <li className="list-line" key={company._id}>
                  <SwitchCompany company={company}/>
                </li>
              )
            }
          </ul>
        </Card>
      </div>
    );
  }
}
