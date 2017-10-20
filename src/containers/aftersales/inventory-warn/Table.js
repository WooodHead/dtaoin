import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import api from '../../../middleware/api';
import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class Table extends BaseTable {
  constructor(props) {
    super(props);

    this.handlePartEnter = this.handlePartEnter.bind(this);
    this.handlePartLeave = this.handlePartLeave.bind(this);
  }

  handlePartEnter(e, record) {
    const enterPartInfo = {};
    enterPartInfo.coordinate = api.getOffsetParentPosition(e);
    enterPartInfo.info = record;
    enterPartInfo.visible = true;
    this.props.onCheckPart(enterPartInfo);
  }

  handlePartLeave(e, record) {
    const enterPartInfo = {};
    enterPartInfo.coordinate = api.getOffsetParentPosition(e);
    enterPartInfo.info = record;
    enterPartInfo.visible = false;
    this.props.onCheckPart(enterPartInfo);
  }

  render() {
    const columns = [
      {
        title: '配件名',
        dataIndex: 'name',
        key: 'name',
        render: (value, record) => (
            <Link
              to={{ pathname: `/warehouse/part/detail/${record._id}` }}
              onMouseEnter={e => this.handlePartEnter(e, record)}
              onMouseLeave={e => this.handlePartLeave(e, record)}
            >
              {value}
            </Link>
          ),
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
        width: '110px',
      }, {
        title: '规格',
        dataIndex: 'spec',
        key: 'spec',
        width: '48px',
        render: (value, record) => value + record.unit,
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: '89px',
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 5) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        key: 'part_type_name',
        render: value => {
          if (!value) {
            return '';
          }
          if (value.length <= 5) {
            return <span>{value}</span>;
          }
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        },
      }, {
        title: '安全库存',
        dataIndex: 'min_amount',
        key: 'min_amount',
        width: '80px',
      }, {
        title: '库存数',
        dataIndex: 'amount',
        key: 'amount',
        width: '70px',
      }, {
        title: '当前进货价',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'text-right',
        width: '90px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '历史最低价',
        dataIndex: 'min_in_price',
        key: 'min_in_price',
        className: 'text-right',
        width: '90px',
        render: value => Number(value).toFixed(2),
      }, {
        title: '操作',
        className: 'center',
        width: '48px',
        render: (value, record) => (
            <div>
              <Link to={{ pathname: `/warehouse/purchase/new/${record._id}` }}>补货</Link>
            </div>
          ),
      }];

    const { isFetching, list, total } = this.state;
    const { rowSelection } = this.props;
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
