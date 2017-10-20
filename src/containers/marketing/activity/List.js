import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';

import api from '../../../middleware/api';
import BaseList from '../../../components/base/BaseList';

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
              <Link to={{ pathname: '/marketing/activity/new' }}><Button type="primary">创建活动</Button></Link>
            </div>
          </Col>
        </Row>

        <Table
          source={api.coupon.getCouponActivityList(this.state)}
          page={this.state.page}
          reload={this.state.reload}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
