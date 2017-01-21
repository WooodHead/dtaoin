import React from 'react';
import {Row, Col, Button, Popconfirm, Badge} from 'antd';
import {Link} from 'react-router';
import BaseList from '../../../components/base/BaseList';

import DateFormatter from '../../../utils/DateFormatter';
import DateRangeSelector from '../../../components/DateRangeSelector';
import TableWithPagination from '../../../components/base/TableWithPagination';

import AuthPopover from './AuthPopover';

import api from '../../../middleware/api';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      list: [],
      total: 0,
      page: 1,
      startDate: DateFormatter.day(new Date(new Date().setMonth(new Date().getMonth() - 1))),
      endDate: DateFormatter.day(),
    };

    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    let {page, startDate, endDate} = this.state;
    this.getTableData(page, startDate, endDate);
  }

  componentWillReceiveProps(nextProps) {
    let {startDate, endDate} = this.state;
    let nextPage = nextProps.location.query.page;
    if (this.props.location.query.page !== nextPage) {
      this.setState({page: nextPage});
      this.getTableData(nextPage, startDate, endDate);
    }
  }

  handleDateRangeChange(startDate, endDate) {
    this.getTableData(this.state.page, startDate, endDate);
    this.setState({startDate, endDate});
  }

  handlePageChange(page) {
    let {startDate, endDate} = this.state;
    this.setState({page});
    this.getTableData(page, startDate, endDate);
  }

  handleCancel(id) {
    api.ajax({
      url: api.warehouse.stocktaking.cancel(),
      type: 'post',
      data: {stocktaking_id: id},
    }, () => {
      // 重新获取列表数据
      let {page, startDate, endDate} = this.state;
      this.getTableData(page, startDate, endDate);
    });
  }

  getTableData(page, startDate, endDate) {
    this.setState({isFetching: true});
    api.ajax({url: api.warehouse.stocktaking.list(page, startDate, endDate)}, (data) => {
      this.setState({
        isFetching: false,
        list: data.res.list,
        total: parseInt(data.res.total),
      });
    });
  }

  render() {
    let {isFetching, list, total, page} = this.state;

    let self = this;
    const columns = [
      {
        title: '盘点日期',
        dataIndex: 'stocktaking_time',
        key: 'stocktaking_time',
        className: 'center',
        render (value) {
          return DateFormatter.day(value);
        },
      }, {
        title: '盘盈数量',
        dataIndex: 'panying_amount',
        key: 'panying_amount',
        className: 'center',
      }, {
        title: '盘盈金额',
        dataIndex: 'panying_worth',
        key: 'panying_worth',
        className: 'text-right',
      }, {
        title: '盘亏数量',
        dataIndex: 'pankui_amount',
        key: 'pankui_amount',
        className: 'center',
      }, {
        title: '盘亏金额',
        dataIndex: 'pankui_worth',
        key: 'pankui_worth',
        className: 'text-right',
      }, {
        title: '盘前总值',
        dataIndex: 'panqian_worth',
        key: 'panqian_worth',
        className: 'text-right',
      }, {
        title: '盘后总值',
        dataIndex: 'panhou_worth',
        key: 'panhou_worth',
        className: 'text-right',
      }, {
        title: '差值',
        dataIndex: 'diff_worth',
        key: 'diff_worth',
        className: 'text-right',
        render(value) {
          let diffWorth = parseFloat(value);
          if (diffWorth < 0) {
            return <span className="text-red">{value}</span>;
          } else if (diffWorth == 0) {
            return <span className="text-gray">{value}</span>;
          } else {
            return value;
          }
        },
      }, {
        title: '状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        render(value, record) {
          let statusValue = String(record.status);
          let statusLabel = 'default';
          if (statusValue === '0') {
            statusLabel = 'error';
          } else if (statusValue === '1') {
            statusLabel = 'success';
          }
          return <Badge status={statusLabel} text={value}/>;
        },
      }, {
        title: '盘点人',
        dataIndex: 'stocktaking_user_name',
        key: 'stocktaking_user_name',
        className: 'center',
      }, {
        title: '审核人',
        dataIndex: 'authorize_user_name',
        key: 'authorize_user_name',
        className: 'center',
      }, {
        title: '审核时间',
        dataIndex: 'authorize_time',
        key: 'authorize_time',
        className: 'center',
        render(value){
          if (value === '0000-00-00 00:00:00') {
            return null;
          } else {
            return DateFormatter.day(value);
          }
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render(value, record){
          let actions = '';
          switch (record.status.toString()) {
            case '0':
              actions = (
                <div>
                  <Link to={{pathname: '/warehouse/stocktaking/edit', query: {id: value}}}>
                    <Button size="small">编辑</Button>
                  </Link>

                  <AuthPopover id={value} type="auth"/>

                  <Popconfirm
                    placement="topRight"
                    title="你确定要放弃该盘点单吗，放弃后不可恢复"
                    onConfirm={self.handleCancel.bind(self, value)}
                  >
                    <Button size="small" className="btn-action-small">放弃</Button>
                  </Popconfirm>
                </div>
              );
              break;
            case '1':
              actions = (
                <div>
                  <Link to={{pathname: '/warehouse/stocktaking/edit', query: {id: value}}}>
                    <Button size="small" className="btn-action-small">盘点单</Button>
                  </Link>

                  <AuthPopover
                    id={value}
                    type="auth"
                    text="审核单"
                  />
                </div>
              );
              break;
            case '-1':
              actions = (
                <Link to={{pathname: '/warehouse/stocktaking/edit', query: {id: value}}}>
                  <Button size="small" className="btn-action-small">盘点单</Button>
                </Link>
              );
              break;
          }
          return actions;
        },
      },
    ];

    return (
      <div>
        <Row>
          <Col span={12}>
            <DateRangeSelector
              label="盘点日期"
              type="day"
              showInterval={false}
              onDateChange={this.handleDateRangeChange}
            />
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <Link to={{pathname: '/warehouse/stocktaking/new'}}>
                <Button type={'primary'}>盘点开单</Button>
              </Link>
            </span>
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
