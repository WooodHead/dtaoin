import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, DatePicker, Tooltip } from 'antd';

import api from '../../../middleware/api';

import TableWithPagination from '../../../components/widget/TableWithPagination';
import DateFormatter from '../../../utils/DateFormatter';

const lastDate = new Date(new Date().setDate(new Date().getDate() - 1));

export default class ClassName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partId: props.id,
      list: [],
      page: 1,
      total: 0,
      startDate: '',
      endDate: '',
      endOpen: false,
    };

    [
      'handleStartTimeChange',
      'handleEndTimeChange',
      'handleStartOpenChange',
      'handleEndOpenChange',
      'disabledEndDate',
      'handlePageChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintainUseLog(this.state);
  }

  handlePageChange(page) {
    this.setState({ page }, () => {
      this.getMaintainUseLog(this.state);
    });
  }

  handleStartTimeChange(value) {
    this.setState({ startDate: DateFormatter.day(value) });
  }

  handleEndTimeChange(value) {
    this.setState({ endDate: DateFormatter.day(value) }, () => {
      this.getMaintainUseLog(this.state);
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

  getMaintainUseLog(condition) {
    api.ajax({ url: api.warehouse.part.partMaintainUseLogList(condition) }, data => {
      const { list, total } = data.res;
      this.setState({ list, total: parseInt(total) });
    });
  }

  render() {
    const { total, page, list, endOpen } = this.state;

    const columns = [
      {
        title: '车牌号',
        dataIndex: 'auto_plate_num',
        key: 'auto_plate_num',
        width: '85px',
      }, {
        title: '车型',
        dataIndex: 'auto_type_name',
        key: 'auto_type_name',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 9) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '客户姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '110px',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '48px',
      }, {
        title: '进价单价',
        key: 'base_price',
        className: 'text-right',
        width: '75px',
        render: (value, record) => record.material_cost && record.amount &&
            (Number(record.material_cost) / Number(record.amount)).toFixed(2),
      }, {
        title: '进价总价',
        dataIndex: 'material_cost',
        key: 'material_cos',
        className: 'text-right',
        width: '80px',
        render: value => value && Number(value).toFixed(2),
      }, {
        title: '销售单价',
        dataIndex: 'material_fee_base',
        key: 'material_fee_base',
        className: 'text-right',
        width: '75px',
        render: value => value && Number(value).toFixed(2),
      }, {
        title: '销售总价',
        dataIndex: 'material_fee',
        key: 'material_fee',
        className: 'text-right',
        width: '80px',
        render: value => value && Number(value).toFixed(2),
      }, {
        title: '配件毛利',
        key: 'prifit',
        className: 'text-right',
        width: '75px',
        render: (value, record) => record.material_fee && record.material_cost &&
            (Number(record.material_fee) - Number(record.material_cost)).toFixed(2),
      }, {
        title: '出库时间',
        dataIndex: 'mtime',
        key: 'mtime5',
        className: 'center',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '操作',
        key: 'operation',
        className: 'center',
        width: '94px',
        render: (value, record) => {
          switch (record.from_type) {
          case '1':// 盘点
            return (
                <Link
                  to={{ pathname: `/warehouse/stocktaking/edit/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '2':// 进货
            return (
                <Link
                  to={{ pathname: `/warehouse/purchase/detail/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '3':// 工单
            return (
                <Link
                  to={{ pathname: `/aftersales/project/edit/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '4':// 销售
            return (
                <Link
                  to={{ pathname: `/aftersales/part-sale/edit/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '5':// 退货
            return (
                <Link
                  to={{ pathname: `/warehouse/purchase-reject/edit/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '6':// 耗材领用
            return <ConsumpMaterial consumableId={record.from_id} type={'see'} size="small" />;

          }
        },
      }];

    return (
      <div className="warehouse-part-maintenance">
        <Row className="mb10">
          <Col span={24}>
            <label className="ml20">开单日期：</label>
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
          </Col>
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
