import React from 'react';
import { Link } from 'react-router-dom';

import api from '../../../middleware/api';
import DateFormatter from '../../../utils/DateFormatter';

import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import ConsumpMaterial from '../../../containers/aftersales/consumptive-material/New';

export default class Table extends BaseTable {
  constructor(props) {
    super(props);

    this.handlePartEnter = this.handlePartEnter.bind(this);
    this.handlePartLeave = this.handlePartLeave.bind(this);
  }

  handlePartEnter(e, record) {
    const enterPartInfo = {};
    enterPartInfo.coordinate = api.getOffsetParentPosition(e);
    enterPartInfo.visible = true;
    api.ajax({ url: api.warehouse.part.detail(record.part_id) }, data => {
      const { detail } = data.res;
      enterPartInfo.info = detail;
      this.props.onCheckPart(enterPartInfo);
    },
    );
  }

  handlePartLeave(e, record) {
    record.in_price = record.unit_price;
    const enterPartInfo = {};
    enterPartInfo.coordinate = api.getOffsetParentPosition(e);
    enterPartInfo.info = record;
    enterPartInfo.visible = false;
    this.props.onCheckPart(enterPartInfo);
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
        scroll={{ x: 1200 }}
      />
    );
  }

  render() {
    const columns = [
      {
        title: '配件名',
        dataIndex: 'part_name',
        key: 'part_name',
        render: (value, record) => (
            <Link
              to={{ pathname: `/warehouse/part/detail/${record.part_id}` }}
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
        dataIndex: 'spec',
        key: 'spec',
        width: '75px',
        render: (value, record) => `${value}${record.unit}`,
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
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
        title: '单据',
        dataIndex: 'from_type_desc',
        key: 'from_type_desc',
        width: '80px',
      }, {
        title: '出入库类型',
        dataIndex: 'type_desc',
        key: 'type_desc',
        width: '89px',
      }, {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '50px',
      }, {
        title: '单价',
        dataIndex: 'unit_price',
        key: 'unit_price',
        className: 'text-right',
        width: '80px',
      }, {
        title: '账单金额',
        dataIndex: 'total_price',
        key: 'total_price',
        className: 'text-right',
        width: '80px',
      }, {
        title: '操作人',
        dataIndex: 'operation_user_name',
        key: 'operation_user_name',
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
        title: '出入库时间',
        dataIndex: 'mtime',
        key: 'mtime',
        className: 'center',
        width: '130px',
        render: value => DateFormatter.getFormatTime(value),
      }, {
        title: '操作',
        key: 'operation',
        width: '94px',
        className: 'center',
        fixed: 'right',
        render: (value, record) => {
          switch (record.from_type) {
          case '1':// 盘点
            return (
                <Link
                  to={{ pathname: `/warehouse/stocktaking/edit/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '2':// 进货
            return (
                <Link
                  to={{ pathname: `/warehouse/purchase/detail/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '3':// 工单
            return (
                <Link
                  to={{ pathname: `/aftersales/project/edit/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '4':// 销售
            return (
                <Link
                  to={{ pathname: `/aftersales/part-sale/edit/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '5':// 退货
            return (
                <Link
                  to={{ pathname: `/warehouse/purchase-reject/edit/${record.from_id}` }}
                  target="_blank"
                  disabled={Number(record.from_id) === 0}
                >
                  查看详情
                </Link>
            );

          case '6':// 耗材领用
            return <ConsumpMaterial consumableId={record.from_id} type={'see'} size="small" />;
          }
        },
      }];

    return this.renderTable(columns);
  }
}
