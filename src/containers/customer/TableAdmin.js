import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';

import BaseTable from '../../components/base/BaseTable';
import TableWithPagination from './../../components/widget/TableWithPagination';
import text from '../../config/text';

import PutOutCoupon from './PutOutCoupon';
import PushActivity from './PushActivity';

export default class Table extends BaseTable {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isFetching, list, total } = this.state;
    const { state } = this.props;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '8%',
      }, {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: '5%',
        render(value) {
          return text.gender[value];
        },
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: '15%',
      }, {
        title: '套餐卡',
        dataIndex: 'coupon_card_types',
        key: 'coupon_card_types',
        width: '30%',
        render: value => {
          let show = '';
          if (!!value) {
            show = value.join(',');
          }
          return show;
        },
      }, {
        title: '注册状态',
        dataIndex: 'is_login',
        key: 'is_login',
        className: 'center',
        width: '8%',
        render: value => (
            <Badge
              status={Number(value) === 0 ? 'default' : 'success'}
              text={Number(value) === 0 ? '未注册' : '已注册'}
            />
          ),
      }, {
        title: '来源门店',
        dataIndex: 'company_name',
        key: 'company_name',
        width: '15%',
      },
    ];
    return (
      <div>
        <div className="mb20">
          <p
            style={{ width: '300px', display: 'inline-block', fontSize: '14px' }}
          >
            {`已选择当前${total}位客户`}
          </p>
          <span className="pull-right">
            <PushActivity state={state} />
            <span className="ml10">
               <PutOutCoupon state={state} />
            </span>
          </span>
        </div>

        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={this.props.page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
