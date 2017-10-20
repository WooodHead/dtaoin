import React from 'react';
import BaseTable from '../../../components/base/BaseTable';

import TableWithPagination from '../../../components/widget/TableWithPagination';

import Edit from './Edit';

export default class Table extends BaseTable {

  renderTable(columns) {
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
        pageSize={30}
        bordered={false}
        scroll={{ y: 785 }}
      />
    );
  }

  render() {
    const columns = [{
      title: '二级分类',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    }, {
      title: '加价率%',
      dataIndex: 'partTypeConfig',
      key: 'markup_rate',
      className: 'center',
      width: '20%',
      render: value => value ? (Number(value.markup_rate) * 100).toFixed(0) : '--',
    }, {
      title: '档次',
      dataIndex: 'partTypeConfig',
      key: 'levels',
      className: 'center',
      width: '20%',
      render: value => {
        let ele = [];
        if (value && value.levels.length > 0) {
          const levels = JSON.parse(value.levels);
          levels.map((item, index) => {
            ele.push(
              <div className="in-table-line" key={`${value._id  }-${  index}`}>
                {item.name}
              </div>
            );
          });
        } else {
          ele = '现场报价';
        }
        return ele;
      },
    }, {
      title: '报价',
      dataIndex: 'partTypeConfig',
      key: 'price',
      className: 'center',
      width: '20%',
      render: value => {
        let ele = [];
        if (value && value.levels.length > 0) {
          const levels = JSON.parse(value.levels);
          levels.map((item, index) => {
            ele.push(
              <div className="in-table-line" key={`${value._id  }-${  index}`}>
                {Number(item.price).toFixed(2)}
              </div>);
          });
        } else {
          ele = '--';
        }
        return ele;
      },
    }, {
      title: '操作',
      key: 'handle',
      className: 'center',
      width: '20%',
      render: (value, record) => <Edit item={record} onSuccess={this.props.onSuccess}/>,
    }];

    return this.renderTable(columns);
  }
}
