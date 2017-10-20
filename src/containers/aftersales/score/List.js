import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Select, Radio } from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import Table from './Table';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      startDate: DateFormatter.date(DateFormatter.getLatestMonthStart()),
      endDate: DateFormatter.date(new Date()),
      type: '-1',
      page: 1,
      rate: '-2',
      source: '-2',
    };

    [
      'handleDateChange',
      'handleScoreChange',
      'handleSourceChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleDateChange(startDate, endDate) {
    this.setState({ startDate, endDate });
  }

  handleScoreChange(e) {
    this.setState({ rate: e.target.value });
  }

  handleSourceChange(e) {
    this.setState({ source: e.target.value });
  }

  render() {
    const { startDate, endDate, page } = this.state;
    return (
      <div>
        <Row className="mb10">
          <label className="ml20">发送日期：</label>
          <DateRangeSelector
            onDateChange={this.handleDateChange}
            startTime={startDate}
            endTime={endDate}
          />
        </Row>

        <Row className="head-action-bar-line mb20">
          <label className="label" style={{ marginLeft: '47px' }}>评价</label>
          <RadioGroup defaultValue="-2" size="large" onChange={this.handleScoreChange}>
            <RadioButton value="-2">全部</RadioButton>
            <RadioButton value="5">5星</RadioButton>
            <RadioButton value="4">4星</RadioButton>
            <RadioButton value="3">3星</RadioButton>
            <RadioButton value="2">2星</RadioButton>
            <RadioButton value="1">1星</RadioButton>
          </RadioGroup>

          <label className="ml20 label">评价来源</label>
          <RadioGroup defaultValue="-2" size="large" onChange={this.handleSourceChange}>
            <RadioButton value="-2">全部</RadioButton>
            <RadioButton value="1">客户端</RadioButton>
            <RadioButton value="0">短信</RadioButton>
          </RadioGroup>
        </Row>

        <span className="aftersales-score">
          <Table
            page={page}
            source={api.aftersales.comment.getCommentList(this.state)}
            updateState={this.updateState}
          />
        </span>
      </div>
    );
  }
}
