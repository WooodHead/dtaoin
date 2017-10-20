import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      selectedItem: '',
      page: 1,
      type: 2,
      status: 0,
    };

    [].map(method => this[method] = this[method].bind(this));
  }

  render() {
    const { page, selectedItem } = this.state;
    return (
      <div>
        <Row className="mb20">
          <Col span={24}>
            <div className="pull-right">
              <Link to="/marketing/bargain/new"><Button type="primary">创建活动</Button></Link>
            </div>
          </Col>
        </Row>

        <span className="marketing-bargain">
          <Table
            page={page}
            source={api.coupon.bargainActivityList(this.state)}
            updateState={this.updateState}
            selectedItem={selectedItem}
          />
        </span>
      </div>
    );
  }
}
