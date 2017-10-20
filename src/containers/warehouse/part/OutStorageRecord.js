import React, { Component } from 'react';
import { Row, Select, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../../middleware/api';

import TableWithPagination from '../../../components/widget/TableWithPagination';
import Layout from '../../../utils/FormLayout';
import DateFormatter from '../../../utils/DateFormatter';
import ConsumpMaterial from '../../aftersales/consumptive-material/New';

const Option = Select.Option;
const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class OutStorageRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partId: props.id,
      list: [],
      page: 1,
      total: 0,
      fromType: '',
      type: '-1',
      startDate: '',
      endDate: '',
      endOpen: false,
    };

    [
      'handlePageChange',
      'handlePartTypeSelect',
      'handleStorageTypeSelect',
      'handleStartTimeChange',
      'handleEndTimeChange',
      'handleStartOpenChange',
      'handleEndOpenChange',
      'disabledEndDate',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getStockLogs(this.state);
  }

  handlePageChange(page) {
    this.setState({ page }, () => {
      this.getStockLogs(this.state);
    });
  }

  handlePartTypeSelect(value) {
    this.setState({ fromType: value }, () => {
      this.getStockLogs(this.state);
    });
  }

  handleStorageTypeSelect(value) {
    this.setState({ type: value }, () => {
      this.getStockLogs(this.state);
    });
  }

  handleStartTimeChange(value) {
    this.setState({ startDate: DateFormatter.day(value) });
  }

  handleEndTimeChange(value) {
    this.setState({ endDate: DateFormatter.day(value) }, () => {
      this.getStockLogs(this.state);
    });
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }

  disabledEndDate(current) {
    const { startDate } = this.state;
    return current && (current.valueOf() >= lastDate || current.valueOf() <= new Date(startDate));
  }

  getStockLogs(condition) {
    api.ajax({ url: api.warehouse.stocktaking.stockLogs(condition) }, data => {
      const { list, total } = data.res;
      this.setState({ list, total: parseInt(total) });
    });
  }

  render() {
    const { total, page, list, endOpen } = this.state;

    const columns = [
      {
        title: '单据',
        dataIndex: 'from_type_desc',
        key: 'from_type_desc',
      }, {
        title: '类型',
        dataIndex: 'type_desc',
        key: 'type_desc',
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
        title: '金额',
        dataIndex: 'total_price',
        key: 'total_price',
        className: 'text-right',
      }, {
        title: '操作人',
        dataIndex: 'operation_user_name',
        key: 'operation_user_name',
      }, {
        title: '出入库时间',
        dataIndex: 'mtime',
        key: 'mtime',
        className: 'center',
      }, {
        title: '操作',
        key: 'operation',
        width: '10%',
        className: 'center',
        render: (value, record) => {
          switch (record.from_type) {
          case '1':// 盘点
            return (
                <Link to={{ pathname: `/warehouse/stocktaking/edit/${record.from_id}` }}
                      target="_blank">
                  查看详情
                </Link>
            );

          case '2':// 进货
            return (
                <Link to={{ pathname: `/warehouse/purchase/detail/${record.from_id}` }}
                      target="_blank">
                  查看详情
                </Link>
            );

          case '3':// 工单
            return (
                <Link to={{ pathname: `/aftersales/project/edit/${record.from_id}` }}
                      target="_blank">
                  查看详情
                </Link>
            );

          case '4':// 销售
            return (
                <Link to={{ pathname: `/aftersales/part-sale/edit/${record.from_id}` }}
                      target="_blank">
                  查看详情
                </Link>
            );

          case '5':// 退货
            return (
                <Link to={{ pathname: `/warehouse/purchase-reject/edit/${record.from_id}` }}
                      target="_blank">
                  查看详情
                </Link>
            );

          case '6':// 耗材领用
            return <ConsumpMaterial consumableId={record.from_id} type={'see'} size="small" />;

          }
        },
      }];

    return (
      <div>
        <Row className="mb10">
          <label className="label">单据</label>
          <Select
            style={{ width: '150px' }}
            onSelect={this.handlePartTypeSelect}
            defaultValue="-1"
            size="large"
          >
            <Option value="-1">全部</Option>
            <Option value="1">盘点</Option>
            <Option value="2">采购</Option>
            <Option value="3">工单</Option>
            <Option value="4">销售</Option>
            <Option value="5">退货</Option>
            <Option value="6">耗材领用</Option>
          </Select>
          <label className="label ml20">出入库类型</label>
          <Select
            style={{ width: '150px' }}
            onSelect={this.handleStorageTypeSelect}
            defaultValue="-1"
            size="large"
          >
            <Option value="-1">全部</Option>
            <Option value="0">出库</Option>
            <Option value="1">入库</Option>
          </Select>
          <label className="ml20 label">开单日期</label>
          <DatePicker
            format={DateFormatter.pattern.day}
            onChange={this.handleStartTimeChange.bind(this)}
            onOpenChange={this.handleStartOpenChange.bind(this)}
            allowClear={false}
            size="large"
          /> - <DatePicker
          disabledDate={this.disabledEndDate}
          format={DateFormatter.pattern.day}
          onChange={this.handleEndTimeChange.bind(this)}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange.bind(this)}
          allowClear={false}
          size="large"
        />
        </Row>
        <TableWithPagination
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
