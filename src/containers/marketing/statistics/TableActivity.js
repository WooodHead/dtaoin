import React from 'react';
import { message, Input } from 'antd';

import api from '../../../middleware/api';
import TableWithPagination from '../../../components/widget/TableWithPagination';

const Search = Input.Search;
export default class TableActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      list: [],
      total: 0,
      page: 1,
      key: '',
    };

    [
      'handleSearch',
      'handlePageChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    const { page, key } = this.state;
    this.setState({ isFetching: true });
    api.ajax({
      url: api.coupon.getCouponActivityList({ key, page }),
    }, data => {
      const { list, total } = data.res;
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

  handlePageChange(page) {
    this.setState({ page }, () => {
      this.getList();
    });
  }

  handleSearch(e) {
    const key = e.target.value;
    this.setState({ key }, () => {
      this.getList();
    });
  }

  render() {
    const { isFetching, list, total } = this.state;
    const columns = [
      {
        title: '活动名称',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: '优惠券名称',
        dataIndex: 'coupon_item_info',
        key: 'coupon_item_info',
        render: value => value.name,
      }, {
        title: '查看总数',
        dataIndex: 'view_count',
        key: 'view_count',
      }, {
        title: '领取总数',
        dataIndex: 'change_count',
        key: 'change_count',
      }, {
        title: '领取率',
        key: 'take-rate',
        render: (value, record) => {
          if (Number(record.change_count) === 0 || Number(record.view_count) === 0) {
            return '0.00%';
          }
          return `${(Number((Number(record.change_count) / Number(record.view_count)).toFixed(4)) *
          100).toFixed(2)}%`;
        },
      }];
    return (
      <div>
        <h3 className="mb20">活动效果数据</h3>
        <div className="mb20">
          <label className="label">选择活动</label>
          <Search
            onChange={this.handleSearch}
            style={{ width: '200px' }}
            placeholder="请选择活动"
          />
        </div>

        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={this.state.page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
