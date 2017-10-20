import React from 'react';
import { Select, DatePicker, Input } from 'antd';

import Table from './Table';
import ConsumpMaterialModal from './New';

import BaseList from '../../../components/base/BaseList';

import formatter from '../../../utils/DateFormatter';
import api from '../../../middleware/api';

const Option = Select.Option;
const Search = Input.Search;

const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class ConsumptiveMaterialList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      page: 1,
      status: '-2',
      startTime: '',
      endTime: '',
      endOpen: false,
      partsInfo: '',
      chooseRejectParts: '',
      consumptiveShow: props.match.params.consumptiveShow || false,

      searchKey: '',
    };

    [
      'handleStatusSelectChange',
      'handleShowPartsInfo',
      'disabledEndDate',
      'handleSearchChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleStartTimeChange(value) {
    this.setState({ startTime: formatter.day(value) });
  }

  handleEndTimeChange(value) {
    this.setState({ endTime: formatter.day(value), page: 1 });
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleShowPartsInfo(partsInfo) {
    this.setState({ partsInfo });
  }

  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }

  disabledEndDate(current) {
    const { startTime } = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(startTime));
  }

  handleStatusSelectChange(value) {
    const now = new Date();
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

  handleSearchChange(e) {
    const key = e.target.value;
    this.setState({ key, page: 1 });
  }

  handleSelectItem(selectedItem) {
    this.setState({ selectedItem });
  }

  render() {
    const { key, page, startTime, endTime, status, reload, endOpen } = this.state;
    return (
      <div>
        <div className="mb15">
          <Search
            onChange={this.handleSearchChange}
            size="large"
            style={{ width: '250px' }}
            placeholder="请输入搜索名称"
          />

          <label className="ml20">状态：</label>
          <Select
            size="large" defaultValue="-2"
            onSelect={this.handleStatusSelectChange}
            style={{ width: 200 }}
          >
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
                disabledDate={this.disabledEndDate}
                format={formatter.pattern.day}
                value={formatter.getMomentDate(endTime)}
                onChange={this.handleEndTimeChange.bind(this)}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange.bind(this)}
                allowClear={false}
              />
            </span>
          <div className="pull-right">
            <ConsumpMaterialModal
              getList={this.handleSuccess}
              consumptiveShow={this.state.consumptiveShow}
              showPartsInfo={this.handleShowPartsInfo}
            />
          </div>
        </div>

        <span className="consumptive-index">
          <Table
            source={api.aftersales.getConsumableList(key, page, startTime, endTime, status)}
            page={page}
            reload={reload}
            updateState={this.updateState}
            onSuccess={this.handleSuccess}
          />
        </span>
      </div>
    );
  }
}
