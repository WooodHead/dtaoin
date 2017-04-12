import React from 'react';
import {Link} from 'react-router';
import {Badge} from 'antd';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

import Shield from './Shield';

export default class Table extends BaseTable {
  render() {
    const columns = [{
      title: '提问者',
      dataIndex: 'questioner_name',
      key: 'questioner_name',
      className: 'width-80',
    }, {
      title: '门店',
      dataIndex: 'questioner_company_name',
      key: 'questioner_company_name',
    }, {
      title: '问题类型',
      dataIndex: 'type_name',
      key: 'type_name',
    }, {
      title: '品牌车系',
      dataIndex: 'auto_brand_name',
      key: 'auto_brand_name',
      render: (brandName, record) => `${brandName} ${record.auto_series_name}`,
    }, {
      title: '问题内容',
      dataIndex: 'content',
      key: 'content',
    }, {
      title: '回答数',
      dataIndex: 'dialog_item_count',
      key: 'dialog_item_count',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: value => {
        let status = String(value);
        return <Badge status={status === '0' ? 'success' : 'default'} text={text.question[status]}/>;
      },
    }, {
      title: '提问时间',
      dataIndex: 'ctime',
      key: 'ctime',
      className: 'action-two',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'option',
      className: 'center action-two',
      render (id, record) {
        return (
          <div>
            <Link to={{pathname: '/product/question/detail', query: {id}}}>查看</Link>

            {String(record.status) === '0' && (
              <span>
                <span className="ant-divider"/>
                <Shield id={id}/>
              </span>
            )}
          </div>
        );
      },
    }];

    return this.renderTable(columns);
  }
}
