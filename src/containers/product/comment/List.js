import React from 'react';
import {Row, Col, DatePicker} from 'antd';

import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';

import BaseList from '../../../components/base/BaseList';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';

import Table from './Table';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      company_id: '',
      company_data: [],
      comment_date: formatter.day(new Date()),
    };

    [
      'handleTimeChange',
      'onSearch',
      'onSelectItem',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getCompanyList();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.location.query.page,
    });
  }

  getCompanyList() {
    api.ajax({url: api.company.list(this.state.page)}, (data) => {
      let {list} = data.res;
      if (list.length > 0) {
        this.setState({company_data: list});
      } else {
        this.setState({company_data: []});
      }
    });
  }

  handleTimeChange(value, dateString) {
    this.setState({
      comment_date: dateString,
    });
  }

  onSearch(key, successHandle, failHandle) {
    let url = api.company.keyList(key);
    api.ajax({url}, (data) => {
      let {list} = data.res;
      if (list.length > 0) {
        this.setState({company_data: list});
      } else {
        this.setState({company_data: []});
      }
      successHandle(list);
    }, (error) => {
      failHandle(error);
    });
  }

  onSelectItem(selectedItem) {
    this.setState({value: selectedItem.name, company_id: selectedItem._id});
  }

  render() {
    let {comment_date} = this.state;

    return (
      <div>
        <Row className="head-action-bar">
          <Col span={18}>
            <SearchSelectBox
              style={{width: 250, float: 'left'}}
              placeholder={'请输入门店名称'}
              onSearch={this.onSearch}
              onSelectItem={this.onSelectItem}
            />

            <label className="ml20">评价时间:</label>
            <DatePicker
              format={formatter.pattern.day}
              defaultValue={formatter.getMomentDate(comment_date)}
              onChange={this.handleTimeChange.bind(this)}
              allowClear={false}
            />
          </Col>
        </Row>

        <Table
          source={api.comment.list(this.state)}
          page={this.state.page}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
