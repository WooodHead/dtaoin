import React from 'react';
import { Row, Col } from 'antd';

import api from '../../middleware/api';

import BaseList from '../../components/base/BaseList';

import New from './New';
import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  }

  render() {
    return (
      <div>
        <Row className="head-action-bar">
          <Col span={24}>
            <div className="pull-right">
              <New onSuccess={this.handleSuccess}/>
            </div>
          </Col>
        </Row>

        <Table
          source={api.company.list(this.state.page)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
