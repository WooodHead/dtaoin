import React, {Component} from 'react';
import TableWithPagination from '../../components/base/TableWithPagination';

export default class TaskTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    [
      'handlePaginationChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  handlePaginationChange(page) {
    this.props.handlePaginationChange(page);
  }

  render() {
    const {data, columns, page}=this.props;
    return (
      <TableWithPagination
        columns={columns}
        dataSource={data}
        total={this.props.totalPagination}
        currentPage={page}
        onPageChange={this.handlePaginationChange}
      />
    );
  }
}
