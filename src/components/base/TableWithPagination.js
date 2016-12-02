import React from 'react'
import {Table} from 'antd'
import api from '../../middleware/api'
import TablePagination from '../tables/TablePagination'

export default class TableWithPagination extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {rowSelection, columns, dataSource, pathname, page}=this.props;
    let prevDisabled = page < 2;
    let itemsLength = dataSource ? dataSource.length : 0;

    return (
      <div>
        <Table
          rowSelection={rowSelection || null}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="middle"
          rowKey={record => record._id}
          bordered
        />

        <TablePagination
          pathname={pathname}
          page={page}
          prevDisabled={prevDisabled}
          nextDisabled={itemsLength < api.config.limit}
        />
      </div>
    )
  }
}
