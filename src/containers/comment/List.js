import React from 'react';
import {Select, Row, Col, DatePicker} from 'antd';

import BaseList from '../../components/base/BaseList';
import Table from './Table';

import formatter from '../../utils/DateFormatter';
import api from '../../middleware/api';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: props.location.query.page || 1,
      comment_date: formatter.day(new Date()),   //评价时间
      company_id: '',
      company_data: [],
    };
    [
      'handleTimeChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.location.query.page,
    });
  }

  componentDidMount() {
    this.getCompanyList();
  }

  getCompanyList() {
    api.ajax({url: api.company.list(this.state.page)}, (data)=> {
      let list = data.res.company_list;
      if (list.length > 0) {
        this.setState({company_data: list});
      } else {
        this.setState({company_data: []});
      }
    });
  }

  handleSelect(value, option) {
    let index = option.props.index;
    let list = this.state.company_data;

    this.setState({value: option.props.children, company_id: list[index]._id});
  }

  handleChange(value) {
    if (!value) {
      this.setState({company_id: ''});
    }
  }

  handleTimeChange(value, dateString) {
    this.setState({
      comment_date: dateString,
    });
  }

  render() {
    let {
      comment_date,
    } = this.state;

    return (
      <div>
        <Row className="mb15">
          <Col span={18}>
            <label className="margin-right-20">评价时间:</label>
            <DatePicker
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate(comment_date)}
              onChange={this.handleTimeChange.bind(this)}
            />

            <label span={6} className="margin-left-20 mr15">门店筛选:</label>
            <Select
              span={14}
              style={{ width: '300px' }}
              placeholder="请选择公司"
              allowClear
              size="large"
              onSelect={this.handleSelect.bind(this)}
              onChange={this.handleChange.bind(this)}>
              {this.state.company_data.map((item, index) => <Select.Option key={index} value={item._id}>{item.name}</Select.Option>)}
            </Select>
          </Col>
        </Row>

        <Table
          updateState={this.updateState}
          currentPage={this.state.page}
          source={api.comment.list(this.state)}
        />
      </div>
    );
  }
}
