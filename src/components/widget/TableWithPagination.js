import React, {Component, PropTypes} from 'react';
import {Spin, Table} from 'antd';
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
    } = this.props;

    const pagination = {
      total: total,
      current: parseInt(currentPage),
      pageSize: pageSize,
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
          pagination={pagination}
          size={size}
          rowKey={rowKey || (record => record._id)}
          bordered
          footer={footer}
        />
      </Spin>
    );
  }
}
