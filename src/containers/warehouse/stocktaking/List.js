import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

import DateFormatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';

import BaseList from '../../../components/base/BaseList';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      startDate: DateFormatter.day(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endDate: DateFormatter.day(),
      endOpen: false,
    };

    [
      'handleDateChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  render() {
    const { startDate, endDate } = this.state;

    return (
      <div>
        <Row className="head-action-bar-line mb10">
          <Col span={12}>
            <laber>选择时间：</laber>
            <DateRangeSelector
              onDateChange={this.handleDateChange}
              startTime={startDate}
              endTime={endDate}
            />
          </Col>

          <Col span={12}>
            <span className="pull-right">
              <Link to={{ pathname: '/warehouse/stocktaking/new' }}>
                <Button type={'primary'}>盘点开单</Button>
              </Link>
            </span>
          </Col>
        </Row>

        <span className="stocktaking-index">
          <Table
            source={api.warehouse.stocktaking.list(this.state)}
            page={this.state.page}
            reload={this.state.reload}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
