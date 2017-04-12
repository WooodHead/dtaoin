import React from 'react';
import {Row, Col, Select, DatePicker} from 'antd';

import Table from './Table';
import ConsumpMaterialModal from './New';

import SearchSelectBox from '../../../components/widget/SearchSelectBox';
import BaseList from '../../../components/base/BaseList';

import formatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';

const Option = Select.Option;

export default class ConsumptiveMaterialList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      selectedItem: '',
      page: 1,
      status: '-2',
      startTime: '',
      endTime: '',
      endOpen: false,
      consumptiveShow: props.location.query.consumptiveShow || false,
    };

    [
      'handleStatusSelectChange',
      'handleSearch',
      'handleSelectItem',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleStartTimeChange(value) {
    this.setState({startTime: formatter.day(value)});
  }

  handleEndTimeChange(value) {
    this.setState({endTime: formatter.day(value), page: 1});
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange(open) {
    this.setState({endOpen: open});
  }

  handleStatusSelectChange(value) {
    let now = new Date();
    let startTime = '';
    let endTime = '';
    if (Number(value) === 1) {
      startTime = formatter.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10));
      endTime = formatter.day(now);
    }
    this.setState({
      status: value,
      page: 1,
      startTime,
      endTime,
    });
  }

  handleSearch(key, successHandle, failHandle) {
    let {page, startTime, endTime, status} = this.state;
    let url = api.aftersales.getConsumableList(key, page, startTime, endTime, status);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({key});
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, () => {
    });
  }

  handleSelectItem(selectedItem) {
    this.setState({selectedItem});
  }

  render() {
    let {key, page, startTime, endTime, status, selectedItem, reload, endOpen} = this.state;
    return (
      <div>
        <Row className="mb15">
          <Col span={22}>
            <SearchSelectBox
              style={{width: 250, float: 'left'}}
              placeholder={'请输入搜索名称'}
              onSearch={this.handleSearch}
              displayPattern={item => item.part_names}
              onSelectItem={this.handleSelectItem}
            />

            <label className="ml20">状态：</label>
            <Select size="large" defaultValue="-2" onSelect={this.handleStatusSelectChange} style={{width: 200}}>
              <Option value="-2">全部</Option>
              <Option value="-1">已取消</Option>
              <Option value="0">待审核</Option>
              <Option value="1">已领用</Option>
            </Select>

            <span className={Number(this.state.status) === 1 ? '' : 'hide'}>
              <label className="ml20">领用日期：</label>
              <DatePicker
                format={formatter.pattern.day}
                value={formatter.getMomentDate(startTime)}
                onChange={this.handleStartTimeChange.bind(this)}
                onOpenChange={this.handleStartOpenChange.bind(this)}
                allowClear={false}
              />
              -
              <DatePicker
                format={formatter.pattern.day}
                value={formatter.getMomentDate(endTime)}
                onChange={this.handleEndTimeChange.bind(this)}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange.bind(this)}
                allowClear={false}
              />
            </span>
          </Col>

          <Col span={2}>
            <div className="pull-right">
              <ConsumpMaterialModal getList={this.handleSuccess} consumptiveShow={this.state.consumptiveShow}/>
            </div>
          </Col>
        </Row>

        <Table
          source={api.aftersales.getConsumableList(key, page, startTime, endTime, status)}
          page={page}
          reload={reload}
          selectedItem={selectedItem}
          updateState={this.updateState}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}
