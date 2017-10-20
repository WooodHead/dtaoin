import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';
import DateFormatter from '../../../utils/DateFormatter';

import New from './New';
import Edit from './Edit';
import Lost from './Lost';
import CreateRemind from '../../../components/widget/CreateRemind';

export default class Table extends BaseTable {
  render() {
    const self = this;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '100px',
        render(text, record) {
          return <Link to={{ pathname: `/customer/detail/${record._id}` }} target="_blank">{text}</Link>;
        },
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: '110px',
      }, {
        title: '更新时间',
        dataIndex: 'intentions',
        key: 'intentionsMtime',
        width: '150px',
        render(value) {
          const autos = [];
          value.map(item => {
            autos.push(<div className="in-table-line"
                            key={item.mtime}>{DateFormatter.getFormatTime(item.mtime)}</div>);
          });
          return autos;
        },
      }, {
        title: '意向级别',
        dataIndex: 'intentions',
        key: 'intentionLevel',
        width: '80px',
        render(value) {
          const autos = [];
          value.map(item => {
            autos.push(<div className="in-table-line" key={item._id}>{item.level}</div>);
          });
          return autos;
        },
      }, {
        title: '意向车型',
        dataIndex: 'intentions',
        key: 'autoType',
        render(value) {
          const autos = [];
          value.map(item => {
            if (!item.auto_type_name) {
              autos.push(
                <div className="in-table-line" key={item._id}>
                  <span className="text-gray">无意向车型</span>
                </div>,
              );
            } else if (item.auto_type_name.length <= 5) {
              autos.push(
                <div className="in-table-line" key={item._id}>
                  {item.auto_type_name}
                </div>,
              );
            } else if (item.auto_type_name.length > 5) {
              autos.push(
                <div className="in-table-line" key={item._id}>
                  <Tooltip placement="topLeft" title={item.auto_type_name}>
                    {item.auto_type_name}
                  </Tooltip>
                </div>,
              );
            }
          });
          return autos;
        },
      }, {
        title: '指导价',
        dataIndex: 'intentions',
        key: 'guidePrice',
        className: 'text-right',
        width: '80px',
        render(value) {
          const autos = [];
          value.map(item => {
            autos.push(
              <div className="in-table-line" key={item._id}>
                {item.guide_price}
              </div>,
            );
          });
          return autos;
        },
      }, {
        title: '按揭意向',
        dataIndex: 'intentions',
        key: 'mortgage',
        width: '80px',
        className: 'center',
        render(value) {
          const autos = [];
          value.map(item => {
            autos.push(
              <div className="in-table-line" key={item._id}>
                {text.isMortgage[Number(item.is_mortgage)]}
              </div>,
            );
          });
          return autos;
        },
      }, {
        title: '意向操作',
        dataIndex: 'intentions',
        key: 'operation',
        className: 'center action-two',
        width: '150px',
        render: value => {
          const operations = [];
          value.map(item => {
            const status = item.status != 0;
            operations.push(
              <div className="in-table-line" key={item._id}>
                <Edit
                  size="small"
                  isSingle={true}
                  intentionId={item._id}
                  customerId={item.customer_id}
                  onSuccess={self.props.onSuccess}
                />

                <span className="ant-divider" />
                <Link to={{ pathname: `/presales/deal/new/${item.customer_id}/${item._id}` }}>
                  成交
                </Link>

                <span className="ant-divider" />

                <Lost
                  size="small"
                  intentionId={item._id}
                  customerId={item.customer_id}
                  onSuccess={self.props.onSuccess}
                  disabled={status}
                />
              </div>,
            );
          });
          return operations;
        },
      }, {
        title: '客户操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center action-two',
        width: '120px',
        render(id) {
          return (
            <div>
              <New
                size="small"
                isSingle={true}
                customerId={id}
                onSuccess={self.props.onSuccess}
              />

              <span className="ant-divider" />

              <CreateRemind customer_id={id} size="small" />
            </div>
          );
        },
      }];

    return this.renderTable(columns);
  }
}
