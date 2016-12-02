import React from 'react'
import {Table} from 'antd'
import api from '../../middleware/api'

export default class BaseTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {rowSelection, columns, dataSource, pathname, page}=this.props;

    const pagination = {
      //onChange(current) {
      //  this.props.onPageChange(current);
      //}
    };
    return (
      <div>
        <Table
          rowSelection={rowSelection || null}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          size="middle"
          rowKey={record => record._id}
          bordered
        />
      </div>
    )
  }
}
