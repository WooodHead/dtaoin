import React from 'react';
import {Row, Col, Radio} from 'antd';

import BaseList from '../../../components/base/BaseList';
import DateFormatter from '../../../utils/DateFormatter';
import DateRangeSelector from '../../../components/DateRangeSelector';
import TableWithPagination from '../../../components/base/TableWithPagination';

import api from '../../../middleware/api';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      list: [],
      total: 0,
      page: 1,
      type: -1,
      fromType: -1,
      startDate: DateFormatter.day(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endDate: DateFormatter.day(),
    };

    [
      'handleDateRangeChange',
      'handlePageChange',
      'handleTypeChange',
      'handleFromTypeChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {page, startDate, endDate, type, fromType} = this.state;
    this.getTableData(page, startDate, endDate, type, fromType);
  }

  handleDateRangeChange(startDate, endDate) {
    let {page, type, fromType} = this.state;
    this.getTableData(page, startDate, endDate, type, fromType);
    this.setState({startDate, endDate, page: 1});
  }

  handlePageChange(page) {
    let {startDate, endDate, type, fromType} = this.state;
    this.setState({page});
    this.getTableData(page, startDate, endDate, type, fromType);
  }

  handleTypeChange(e) {
    let type = e.target.value;
    let {page, startDate, endDate, fromType} = this.state;

    this.setState({type, page: 1});
    this.getTableData(page, startDate, endDate, type, fromType);
  }

  handleFromTypeChange(e) {
    let fromType = e.target.value;
    let {page, startDate, endDate, type} = this.state;

    this.setState({fromType, page: 1});
    this.getTableData(page, startDate, endDate, type, fromType);
  }

  getTableData(page, startDate, endDate, type, fromType) {
    this.setState({isFetching: true});
    api.ajax({
      url: api.warehouse.stocktaking.logs(page, startDate, endDate, type, fromType),
    }, (data) => {
      this.setState({
        isFetching: false,
        list: data.res.list,
        total: parseInt(data.res.total),
      });
    });
  }

  render() {
    let {isFetching, list, total, page} = this.state;

    const columns = [
      {
        title: '配件名',
        dataIndex: 'part_name',
        key: 'part_name',
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
      }, {
        title: '类型',
        dataIndex: 'type_desc',
        key: 'type_desc',
      }, {
        title: '单据',
        dataIndex: 'from_type_desc',
        key: 'from_type_desc',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: '单价',
        dataIndex: 'unit_price',
        key: 'unit_price',
        className: 'text-right',
      }, {
        title: '账单金额',
        dataIndex: 'total_price',
        key: 'total_price',
        className: 'text-right',
      }, {
        title: '出入库日期',
        dataIndex: 'mtime',
        key: 'mtime',
        className: 'center',
        render(value) {
          return DateFormatter.day(value);
        },
      }];

    return (
      <div>
        <Row>
          <Col span={8}>
            <DateRangeSelector
              label="出入库日期"
              type="day"
              showInterval={false}
              onDateChange={this.handleDateRangeChange}
            />
          </Col>
          <Col span={6}>
            <label className="mr15">类型:</label>
            <RadioGroup defaultValue="-1" size="large" onChange={this.handleTypeChange}>
              <RadioButton value="-1">全部</RadioButton>
              <RadioButton value="1">入库</RadioButton>
              <RadioButton value="0">出库</RadioButton>
            </RadioGroup>
          </Col>
          <Col span={6}>
            <label className="mr15">单据:</label>
            <RadioGroup defaultValue="-1" size="large" onChange={this.handleFromTypeChange}>
              <RadioButton value="-1">全部</RadioButton>
              <RadioButton value="2">进货</RadioButton>
              <RadioButton value="3">开单</RadioButton>
              <RadioButton value="1">盘点</RadioButton>
            </RadioGroup>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
