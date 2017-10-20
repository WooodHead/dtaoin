import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Popconfirm, Tooltip } from 'antd';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import AuthPopover from './AuthPopover';

export default class Table extends BaseTable {

  handleCancel(id) {
    api.ajax({
      url: api.warehouse.stocktaking.cancel(),
      type: 'post',
      data: { stocktaking_id: id },
    }, () => {
      this.props.updateState({ reload: true });
    });
  }

  handleReturnDiff(diffWorth, value) {
    if (diffWorth < 0) {
      return <span className="text-red">{Number(value).toFixed(2)}</span>;
    } else if (Number(diffWorth) === 0) {
      return <span className="text-gray">{Number(value).toFixed(2)}</span>;
    } else {
      return value;
    }
  }

  renderTable(columns) {
    const { isFetching, list, total } = this.state;

    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
        scroll={{ x: 1195 }}
      />
    );
  }

  render() {
    const self = this;
    const columns = [
      {
        title: '盘点日期',
        dataIndex: 'stocktaking_time',
        key: 'stocktaking_time',
        className: 'center',
        width: '110px',
        render(value) {
          return DateFormatter.day(value);
        },
      }, {
        title: '盘盈数量',
        dataIndex: 'panying_amount',
        key: 'panying_amount',
      }, {
        title: '盘盈金额',
        dataIndex: 'panying_worth',
        key: 'panying_worth',
        className: 'text-right',
        width: '85px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{Number(value).toFixed(2)}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={Number(value).toFixed(2)}>
              {Number(value).toFixed(2)}
            </Tooltip>
          );
        },
      }, {
        title: '盘亏数量',
        dataIndex: 'pankui_amount',
        key: 'pankui_amount',
        width: '85px',
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
        title: '盘亏金额',
        dataIndex: 'pankui_worth',
        key: 'pankui_worth',
        className: 'text-right',
        width: '85px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{Number(value).toFixed(2)}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={Number(value).toFixed(2)}>
              {Number(value).toFixed(2)}
            </Tooltip>
          );
        },
      }, {
        title: '盘前总值',
        dataIndex: 'panqian_worth',
        key: 'panqian_worth',
        className: 'text-right',
        width: '85px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{Number(value).toFixed(2)}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={Number(value).toFixed(2)}>
              {Number(value).toFixed(2)}
            </Tooltip>
          );
        },
      }, {
        title: '盘后总值',
        dataIndex: 'panhou_worth',
        key: 'panhou_worth',
        className: 'text-right',
        width: '80px',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return <span>{Number(value).toFixed(2)}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={Number(value).toFixed(2)}>
              {Number(value).toFixed(2)}
            </Tooltip>
          );
        },
      }, {
        title: '差值',
        dataIndex: 'diff_worth',
        key: 'diff_worth',
        className: 'text-right',
        width: '85px',
        render(value) {
          const diffWorth = parseFloat(value);
          if (!value) {
            return '';
          }
          if (value.length <= 8) {
            return self.handleReturnDiff(diffWorth, value);
          }
          return (
            <Tooltip placement="topLeft" title={Number(value).toFixed(2)}>
              {self.handleReturnDiff(diffWorth, value)}
            </Tooltip>
          );
        },
      }, {
        title: '状态',
        dataIndex: 'status_name',
        key: 'status_name',
        className: 'center',
        width: '80px',
        render(value, record) {
          const statusValue = String(record.status);
          let statusLabel = 'default';
          if (statusValue === '0') {
            statusLabel = 'error';
          } else if (statusValue === '1') {
            statusLabel = 'success';
          }
          return <Badge status={statusLabel} text={value} />;
        },
      }, {
        title: '盘点人',
        dataIndex: 'stocktaking_user_name',
        key: 'stocktaking_user_name',
        className: 'center',
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
        title: '审核人',
        dataIndex: 'authorize_user_name',
        key: 'authorize_user_name',
        className: 'center',
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
        title: '审核时间',
        dataIndex: 'authorize_time',
        key: 'authorize_time',
        className: 'center',
        width: '130px',
        render: value => {
          if (value === '0000-00-00 00:00:00') {
            return null;
          } else {
            return DateFormatter.getFormatTime(value);
          }
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '140px',
        fixed: 'right',
        render(value, record) {
          let actions = '';
          switch (String(record.status)) {
          case '0':
            actions = (
                <div>
                  <Link to={{ pathname: `/warehouse/stocktaking/edit/${value}` }}>编辑</Link>
                  <span className="ant-divider" />

                  <AuthPopover id={value} type="auth" />
                  <span className="ant-divider" />

                  <Popconfirm
                    placement="topRight"
                    title="你确定要放弃该盘点单吗，放弃后不可恢复"
                    onConfirm={self.handleCancel.bind(self, value)}
                  >
                    <a href="javascript:;">放弃</a>
                  </Popconfirm>
                </div>
              );
            break;
          case '1':
            actions = (
                <div>
                  <Link to={{ pathname: `/warehouse/stocktaking/edit/${value}` }}>盘点单</Link>
                  <span className="ant-divider" />

                  <AuthPopover id={value} type="auth" text="审核单" />
                </div>
              );
            break;
          case '-1':
            actions = <Link to={{ pathname: `/warehouse/stocktaking/edit/${value}` }}>盘点单</Link>;
            break;
          }
          return actions;
        },
      },
    ];

    return this.renderTable(columns);
  }
}
