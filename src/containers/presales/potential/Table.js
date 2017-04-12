import React from 'react';
import {Link} from 'react-router';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

import New from './New';
import Edit from './Edit';
import Lost from './Lost';
import CreateRemind from '../../../components/widget/CreateRemind';

export default class Table extends BaseTable {
  render() {
    let self = this;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render (text, record) {
        return <Link to={{pathname: '/customer/detail', query: {customerId: record._id}}}>{text}</Link>;
      },
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '更新时间',
      dataIndex: 'intentions',
      key: 'intentionsMtime',
      className: 'no-padding',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(<div className="in-table-line" key={item.mtime}>{item.mtime}</div>);
        });
        return autos;
      },
    }, {
      title: '意向级别',
      dataIndex: 'intentions',
      key: 'intentionLevel',
      className: 'no-padding',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(<div className="in-table-line" key={item._id}>{item.level}</div>);
        });
        return autos;
      },
    }, {
      title: '意向车型',
      dataIndex: 'intentions',
      key: 'autoType',
      className: 'no-padding',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.auto_type_name || <span className="text-gray">无意向车型</span>}
            </div>
          );
        });
        return autos;
      },
    }, {
      title: '指导价',
      dataIndex: 'intentions',
      key: 'guidePrice',
      className: 'no-padding text-right',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {item.guide_price}
            </div>
          );
        });
        return autos;
      },
    }, {
      title: '按揭意向',
      dataIndex: 'intentions',
      key: 'mortgage',
      className: 'no-padding center',
      render (value) {
        let autos = [];
        value.map(function (item) {
          autos.push(
            <div className="in-table-line" key={item._id}>
              {text.isMortgage[Number(item.is_mortgage)]}
            </div>
          );
        });
        return autos;
      },
    }, {
      title: '意向操作',
      dataIndex: 'intentions',
      key: 'operation',
      className: 'no-padding center action-two',
      render: value => {
        let operations = [];
        value.map(function (item) {
          let status = item.status != 0;
          operations.push(
            <div className="in-table-line" key={item._id}>
              <Edit
                size="small"
                isSingle={true}
                intentionId={item._id}
                customerId={item.customer_id}
                onSuccess={self.props.onSuccess}
              />

              <span className="ant-divider"/>
              <Link to={{
                pathname: '/presales/deal/new', query: {intentionId: item._id, customerId: item.customer_id},
              }}>
                成交
              </Link>

              <span className="ant-divider"/>

              <Lost
                size="small"
                intentionId={item._id}
                customerId={item.customer_id}
                onSuccess={self.props.onSuccess}
                disabled={status}
              />
            </div>
          );
        });
        return operations;
      },
    }, {
      title: '客户操作',
      dataIndex: '_id',
      key: 'action',
      className: 'no-padding center action-two',
      render (id) {
        return (
          <div>
            <New
              size="small"
              isSingle={true}
              customerId={id}
              onSuccess={self.props.onSuccess}
            />

            <span className="ant-divider"/>

            <CreateRemind customer_id={id} size="small"/>
          </div>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
