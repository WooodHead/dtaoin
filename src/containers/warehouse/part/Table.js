import React from 'react';
import { Badge, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../../middleware/api';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

import Edit from './Edit';

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
        width: '120px',
      }, {
        title: '规格',
        className: 'text-right',
        width: '75px',
        render: (value, record) => `${record.spec || ''}${record.unit || ''}`,
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: '89px',
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
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        key: 'part_type_name',
      }, {
        title: '库存数',
        dataIndex: 'amount',
        key: 'amount',
        width: '70px',
      }, {
        title: '已冻结',
        dataIndex: 'freeze',
        key: 'freeze',
        width: '70px',
      }, {
        title: '当前进价',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'text-right',
        width: '80px',
      }, {
        title: '当前售价',
        dataIndex: 'sell_price',
        key: 'sell_price',
        className: 'text-right',
        width: '80px',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        className: 'center',
        width: '80px',
        render: value => {
          const statusValue = String(value);
          let statusLabel = 'default';

          if (statusValue === '-1') {
            statusLabel = 'error';
          } else if (statusValue === '0') {
            statusLabel = 'success';
          }
          return <Badge status={statusLabel} text={text.partStatus[value]} />;
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        width: '94px',
        render: (id, record) => (
            <div>
              <Edit part={record} onSuccess={this.props.onSuccess} size="small" />
              <span className="ant-divider" />
              <Link to={{ pathname: `/warehouse/purchase/new/${record._id}` }}>采购</Link>
            </div>
          ),
      },
    ];

    return this.renderTable(columns);
  }
}
