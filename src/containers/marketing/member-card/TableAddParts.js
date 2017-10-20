import React from 'react';
import { message, Icon } from 'antd';

import api from '../../../middleware/api';
import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';
import text from '../../../config/text';

export default class Table extends BaseTable {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowClick(part) {
    const { list } = this.state;
    list.map((item, index) => {
      if (Number(item._id) === Number(part._id)) {
        list[index].choose = !(list[index].choose);
      }
    });

    this.setState({ list });
    this.props.handleRowClick(part);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source !== this.props.source || nextProps.reload) {
      this.getList(nextProps);
    }
  }

  getList(props) {
    const { couponMap } = this.props;

    this.setState({ isFetching: true });
    api.ajax({
      url: props.source,
    }, data => {
      const { list, total } = data.res;
      list.map((item, index) => {
        if (couponMap.has(item._id)) {
          list[index].choose = true;
        }
      });
      this.setState({
        isFetching: false,
        list,
        total: parseInt(total),
      });
    }, error => {
      message.error(`获取列表数据失败[${error}]`);
      this.setState({ isFetching: false });
    });
  }

  renderTable(columns) {
    const { isFetching, list, total } = this.state;

    return (
      <div>
        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={this.props.page}
          onPageChange={this.handlePageChange}
          handleRowClick={this.handleRowClick}
          bordered={false}
        />
      </div>
    );
  }

  render() {
    const columns = [
      {
        title: '优惠券名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      }, {
        title: '有效期',
        dataIndex: 'valid_type',
        key: 'valid_type',
        render: (value, record) => {
          if (String(value) === '0') {
            // 时间段
            return `${record.valid_start_date}至${record.valid_expire_date}`;
          } else if (String(value) === '1') {
            // 具体天数
            return `领取后当天生效${record.valid_day}天有效`;
          }
        },
      }, {
        title: '优惠券类型',
        dataIndex: 'type',
        key: 'type',
        render: value => text.couponType[value],

      }, {
        title: '领用限制',
        dataIndex: 'limit_count',
        key: 'limit_count',
        render: value => Number(value) === 0 ? '无限制' : value,
      }, {
        title: '',
        dataIndex: 'choose',
        className: 'center',
        width: '5%',
        render: value => value ? <a href="javascript:;"><Icon type="check" /></a> : '',
      }];

    return this.renderTable(columns);
  }
}
