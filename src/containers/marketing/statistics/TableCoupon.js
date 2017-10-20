import React from 'react';
import { message, Input, Icon, Tooltip } from 'antd';

import api from '../../../middleware/api';
import text from '../../../config/text';
import TableWithPagination from '../../../components/widget/TableWithPagination';

const Search = Input.Search;
export default class TableCoupon extends React.Component {
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
      url: api.coupon.getCouponList({ key, page }),
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

    const useCountTitle = (
      <div>
        <span className="mr10">核销比例</span>
        <Tooltip placement="top" title="核销比例=核销数/(发放数+领取数)">
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const fenfaCountTitle = (
      <div>
        <span className="mr10">系统发放总数</span>
        <Tooltip placement="top" title="系统发放总数指通过系统直接发放优惠券到客户账户的数量，客户无需领取。">
          <Icon type="question-circle-o" />
        </Tooltip>
      </div>
    );

    const columns = [
      {
        title: '优惠券名称',
        dataIndex: 'name',
        key: 'name',
        width: '135px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 10) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '有效期',
        dataIndex: 'valid_type',
        key: 'valid_type',
        width: '190px',
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
        width: '89px',
        render: value => text.couponType[value],
      }, {
        title: fenfaCountTitle,
        dataIndex: 'fenfa_count',
        key: 'fenfa_count',
        width: '125px',
      }, {
        title: '活动领取总数',
        dataIndex: 'lingqu_count',
        key: 'lingqu_count',
        width: '103px',
      }, {
        title: '核销总数',
        dataIndex: 'use_count',
        key: 'use_count',
        width: '80px',
      }, {
        title: useCountTitle,
        key: 'proportion',
        width: '100px',
        render: (value, record) => {
          if (Number(record.use_count) === 0 ||
            (Number(record.lingqu_count) + Number(record.fenfa_count)) === 0) {
            return '0.00%';
          }
          return `${(Number((Number(record.use_count) /
            (Number(record.lingqu_count) + Number(record.fenfa_count))).toFixed(4)) *
            100).toFixed(2)}%`;
        },
      }];
    return (
      <div>
        <h3 className={api.isHeadquarters() ? 'mb20' : 'hide'}>优惠券效果数据</h3>
        <div className="mb20">
          <label className="label">选择优惠券</label>
          <Search
            onChange={this.handleSearch}
            style={{ width: '200px' }}
            placeholder="请选择优惠券"
            size="large"
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
