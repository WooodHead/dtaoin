import React from 'react';

import BaseTable from '../../../components/base/BaseTable';

import EditStatus from './EditStatus';
import Detail from './Detail';
import UseLog from './UseLog';

export default class List extends BaseTable {
  render() {
    let self = this;
    const columns = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '品牌 型号',
      dataIndex: 'brand',
      key: 'brand',
    }, {
      title: '购买日期',
      dataIndex: 'buy_date',
      key: 'buy_date',
    }, {
      title: '购入单价(元)',
      dataIndex: 'unit_price',
      key: 'unit_price',
    }, {
      title: '数量',
      dataIndex: 'total_count',
      key: 'total_count',
    }, {
      title: '总值(元)',
      dataIndex: 'total_price',
      key: 'total_price',
    }, {
      title: '正常',
      dataIndex: 'zhengchang_count',
      key: 'zhengchang_count',
    }, {
      title: '维修',
      dataIndex: 'weixiu_count',
      key: 'weixiu_count',
    }, {
      title: '出借',
      dataIndex: 'chujie_count',
      key: 'chujie_count',
    }, {
      title: '丢失',
      dataIndex: 'diushi_count',
      key: 'diushi_count',
    }, {
      title: '报废',
      dataIndex: 'baofei_count',
      key: 'baofei_count',
    }, {
      title: '负责人',
      dataIndex: 'incharge_user_name',
      key: 'incharge_user_name',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render (value, record) {
        return (
          <span>
            <EditStatus _id={value} onSuccess={self.props.onSuccess} size="small"/>

            <span className="ant-divider"/>

            <Detail detail={record} size="small"/>

            <span className="ant-divider"/>

            <UseLog _id={value} detail={record} size="small"/>
          </span>
        );
      },
    }];

    return this.renderTable(columns);
  }
}

