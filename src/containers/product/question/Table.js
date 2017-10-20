import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';

import text from '../../../config/text';

import BaseTable from '../../../components/base/BaseTable';

import Shield from './Shield';

export default class Table extends BaseTable {
  render() {
    const self = this;
    const columns = [
      {
        title: '提问者',
        dataIndex: 'questioner_name',
        key: 'questioner_name',
        className: 'width-80',
      }, {
        title: '门店',
        dataIndex: 'questioner_company_name',
        key: 'questioner_company_name',
        width: '15%',
      }, {
        title: '问题类型',
        dataIndex: 'type_name',
        key: 'type_name',
        width: '8%',
      }, {
        title: '品牌车系',
        dataIndex: 'auto_brand_name',
        key: 'auto_brand_name',
        width: '15%',
        render: (brandName, record) => `${brandName} ${record.auto_series_name}`,
      }, {
        title: '问题内容',
        dataIndex: 'content',
        key: 'content',
        width: '20%',
      }, {
        title: '回答数',
        dataIndex: 'dialog_item_count',
        key: 'dialog_item_count',
        width: '5%',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '8%',
        render: value => {
          const status = String(value);
          return <Badge status={status === '0' ? 'success' : 'default'}
                        text={text.question[status]} />;
        },
      }, {
        title: '提问时间',
        dataIndex: 'ctime',
        key: 'ctime',
        className: 'action-two',
        width: '13%',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'option',
        className: 'center action-two',
        width: '10%',
        render (id, record) {
          return (
            <div>
              <Link to={{ pathname: `/product/question/detail/${id}` }}>查看</Link>
              {String(record.status) === '0' && (
                <span>
                <span className="ant-divider" />
                <Shield id={id} handleSuccess={self.props.onSuccess} />
              </span>
              )}
            </div>
          );
        },
      }];

    return this.renderTable(columns);
  }
}
