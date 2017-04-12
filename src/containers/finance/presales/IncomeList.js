import React from 'react';
import {Row, Col, DatePicker} from 'antd';

import BaseList from '../../../components/base/BaseList';
import SearchBox from '../../../components/search/SearchBox';
import IncomeTable from './IncomeTable';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class PresalesIncomeList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      start_date: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      end_date: formatter.date(new Date()),
      start_time: formatter.date(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      end_time: formatter.date(new Date()),
      pay_type: '',
      plate_num: '',
      from_type: '0',
      status: '0',
      endOpen: false,
    };
    [
      'handleSearchChange',
      'onChangeTime',
      'handleStartTimeChange',
      'handleStartOpenChange',
      'handleEndTimeChange',
      'handleEndOpenChange',
      'disabledEndDate',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleSearchChange(key) {
    if (key) {
      this.setState({plate_num: key});
    }
  }

  handleStartTimeChange(value) {
    this.setState({start_date: formatter.day(value)});
  }

  handleEndTimeChange(value) {
    this.setState({end_date: formatter.day(value)});
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange(open) {
    this.setState({endOpen: open});
  }

  onChangeTime(value, dateString) {
    this.setState({
      start_time: dateString[0],
      end_time: dateString[1],
    });
  }

  disabledStartDate(current) {
    return current && current.valueOf() >= lastDate;
  }

  disabledEndDate(current) {
    let {start_date} = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(start_date));
  }

  render() {
    let {
      start_date,
      end_date,
      endOpen,
    } = this.state;

    return (
      <div>
        <Row className="mb10">
          <Col span={5}>
            <SearchBox
              change={this.handleSearchChange}
              style={{width: 220}}
            />
          </Col>
          <Col span={18}>
            <label className="mr5">交易时间:</label>
            <DatePicker
              disabledDate={this.disabledStartDate}
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate(start_date)}
              onChange={this.handleStartTimeChange}
              onOpenChange={this.handleStartOpenChange}
              allowClear={false}
            />
            -
            <DatePicker
              disabledDate={this.disabledEndDate}
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate(end_date)}
              onChange={this.handleEndTimeChange}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
              allowClear={false}
            />
          </Col>
        </Row>

        <IncomeTable
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.finance.getPresalesIncomeList(this.state)}
        />
      </div>
    );
  }
}
