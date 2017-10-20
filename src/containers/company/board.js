import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';

import api from '../../../middleware/api';
import fetch from 'isomorphic-fetch';
import api from '../../middleware/api';
import NewCompanyModal from './New';
import SwitchCompany from './SwitchCompany';

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
    };
  }

  componentWillMount() {
    const userInfo = api.getLoginUser();

    if (userInfo.department < 0) {
      this.getCompanies();
    }
  }

  getCompanies() {
    fetch(api.company.list(), { mode: 'cors', credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        this.setState({ companies: data.res.list });
      });
  }

  render() {
    const userInfo = api.getLoginUser();
    const { companies } = this.state;

    if (userInfo.department > 0) {
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
