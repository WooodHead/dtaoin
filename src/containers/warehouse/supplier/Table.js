import React from 'react';
import { Tooltip } from 'antd';
import BaseTable from '../../../components/base/BaseTable';

import api from '../../../middleware/api';
import path from '../../../config/path';

import Edit from './Edit';
import Clearing from './Clearing';
import PurchaseLogs from './PurchaseLogs';
import RejectLogs from './RejectLogs';

export default class Table extends BaseTable {

  componentDidMount() {
    this.getList(this.props);
    this.getIsAuthorization();
  }

  async getIsAuthorization() {
    const hasPermission = await api.checkPermission(path.warehouse.supplier.pay);
    this.setState({ hasPermission });
  }

  render() {
    const { hasPermission } = this.state;
    const self = this;
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'supplier_company',
        key: 'supplier_company',
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
        title: '主营业务',
        dataIndex: 'main_business',
        key: 'main_business',
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
        title: '联系人',
        dataIndex: 'user_name',
        key: 'user_name',
        width: '75px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 4) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
        width: '120px',
      }, {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
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
        title: '税号',
        dataIndex: 'tax',
        key: 'tax',
      }, {
        title: '开户行',
        dataIndex: 'bank',
        key: 'bank',
        width: '75px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 4) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '账号',
        dataIndex: 'bank_account',
        key: 'bank_account',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center width-250',
        width: '230px',
        render(id, record) {
          return (
            <span>
              <Edit supplier={record} onSuccess={self.props.onSuccess} />
              <span className="ant-divider" />

              <span className={hasPermission ? '' : 'hide'}>
                <Clearing supplierId={id} />
                <span className="ant-divider" />
              </span>

              <PurchaseLogs supplierId={id} />
              <span className="ant-divider" />

              <RejectLogs supplierId={id} />
            </span>
          );
        },
      },
    ];

    return this.renderTable(columns);
  }
}
