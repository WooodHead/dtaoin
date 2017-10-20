import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin, Table } from 'antd';

import api from '../../middleware/api';

export default class TableWithPagination extends Component {
  static defaultProps = {
    isLoading: false,
    tip: '加载中...',
    rowSelection: null,
    total: 0,
    currentPage: 1,
    size: 'middle',
    footer: null,
    pageSize: api.config.limit,
    bordered: true,
    handleRowClick: () => {
    },
    handleTableChange: () => {

    },
    scroll: {},
  };

  static propTypes = {
    isLoading: PropTypes.bool,
    tip: PropTypes.string,
    rowSelection: PropTypes.object,
    total: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    size: PropTypes.string,
    footer: PropTypes.func,
  };

  render() {
    const {
      isLoading,
      tip,
      rowSelection,
      columns,
      dataSource,
      total,
      currentPage,
      onPageChange,
      size,
      footer,
      rowKey,
      pageSize,
      bordered,
      handleRowClick,
      pagination,
      scroll,
      handleTableChange,
    } = this.props;

    const _pagination = pagination !== undefined ? pagination : {
      total,
      current: parseInt(currentPage),
      pageSize,
      showQuickJumper: true,
      size: 'middle',
      onChange: onPageChange,
      showTotal: total => `共 ${total} 条数据`,
    };

    return (
      <Spin tip={tip} spinning={isLoading}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          pagination={_pagination}
          size={size}
          rowKey={rowKey || (record => record._id)}
          bordered={bordered}
          footer={footer}
          onRowClick={handleRowClick}
          scroll={scroll}
          onChange={handleTableChange}
        />
      </Spin>
    );
  }
}
