import React from 'react';
import {Link} from 'react-router';
import {Popconfirm, message, Badge} from 'antd';

import text from '../../../config/text';
import api from '../../../middleware/api';

import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class Table extends BaseTable {
  handleSettlement(record) {
    let payInfos = {pay_infos: JSON.stringify([{_id: record._id, pay_amount: record.unpay_amount}])};

    api.ajax({
      url: api.technician.settlement(),
      data: payInfos,
      type: 'POST',
    }, () => {
      message.success('结算成功');
      this.setState({reload: true});
    });
  }

  render() {
    let self = this;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    }, {
      title: '入行时间',
      dataIndex: 'started_work_time',
      key: 'started_work_time',
    }, {
      title: '擅长品牌',
      dataIndex: 'skilled_brand_names',
      key: 'skilled_brand_names',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '未结清(元)',
      dataIndex: 'unpay_amount',
      key: 'unpay_amount',
    }, {
      title: '支付宝',
      dataIndex: 'alipay_account',
      key: 'alipay_account',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      className: 'center',
      render: value => {
        let statusLabel = 'default';
        if (String(value) === '-1') {
          statusLabel = 'error';
        } else if (String(value) === '1') {
          statusLabel = 'success';
        }
        return <Badge status={statusLabel} text={text.technicianStatus[value]}/>;
      },
    }, {
      title: '申请时间',
      dataIndex: 'ctime',
      key: 'ctime',
    }, {
      title: '操作',
      className: 'center',
      render: (value, record) => {
        return (
          <div>
            <span>
              <Link to={{pathname: '/product/artificer/detail', query: {customerId: record._id}}}>查看</Link>
            </span>

            <span className="ant-divider"/>

            <Popconfirm
              placement="topRight"
              title="结算后，该技师未结算金额将清空"
              onConfirm={self.handleSettlement.bind(self, record)}
            >
              <a href="javascript:" disabled={Number(record.unpay_amount) === 0}>结算</a>
            </Popconfirm>
            <span>
            </span>
          </div>
        );
      },
    }];

    let {isFetching, list, total} = this.state;
    let {rowSelection} = this.props;
    return (
      <TableWithPagination
        rowSelection={rowSelection}
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
      />
    );
  }
}
