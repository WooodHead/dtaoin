import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import BaseTable from '../../components/base/BaseTable';
import CreateRemind from '../../components/widget/CreateRemind';
import text from '../../config/text';
import DateFormatter from '../../utils/DateFormatter';

import Edit from './Edit';

export default class Table extends BaseTable {
  render() {
    const columns = [
      {
        title: '车牌号',
        dataIndex: 'plate_num',
        key: 'plate_num',
        width: '118px',
      }, {
        title: '姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        width: '110px',
        render(item, record) {
          return (
            <Link
              to={{ pathname: `/customer/detail/${record.customer_id}` }}
              target="_blank">{item}</Link>
          );
        },
      }, {
        title: '性别',
        dataIndex: 'customer_gender',
        key: 'customer_gender',
        width: '50px',
        render(value) {
          return text.gender[value];
        },
      }, {
        title: '手机号',
        dataIndex: 'customer_phone',
        key: 'customer_phone',
        width: '120px',
      }, {
        title: '车型',
        key: 'auto_type_name',
        dataIndex: 'auto_type_name',
        width: '20%',
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
        title: '里程数',
        key: 'mileage',
        dataIndex: 'mileage',
        className: 'column-money',
        width: '75px',
      }, {
        title: '最近维修项目',
        key: 'last_intention_item_names',
        dataIndex: 'last_intention_item_names',
        width: '18%',
        render: value => value ? value : '',
      }, {
        title: '最近到店时间',
        key: 'last_intention_time',
        dataIndex: 'last_intention_time',
        width: '130px',
        render: value => !!value ? DateFormatter.getFormatTime(value) : '--',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'intention_info',
        className: 'center',
        width: '94px',
        render(value, record) {
          return (
            <span>
             <Edit customer_id={record.customer_id} size="small" />
              <span className="ant-divider" />
              <CreateRemind customer_id={record.customer_id} size="small" />
            </span>
          );
        },
      },
    ];
    return this.renderTable(columns);
  }
}
