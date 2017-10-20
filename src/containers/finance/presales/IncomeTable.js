import React from 'react';
import api from '../../../middleware/api';
import TableWithPagination from '../../../components/widget/TableWithPagination';

export default class IncomeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAction: false,
      list: [],
      isFetching: false,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  handlePageChange(page) {
    this.props.updateState({ page });
  }

  getList(props) {
    this.setState({ isFetching: true });
    api.ajax({ url: props.source }, data => {
      const { list, total } = data.res;
      this.setState({ list, total: parseInt(total), isFetching: false });
    });
  }

  render() {
    const { list, total, isFetching } = this.state;
    const columns = [
      {
        title: '交易时间',
        dataIndex: 'deal_date',
        key: 'deal_date',
      }, {
        title: '车牌号',
        dataIndex: 'plate_num',
        key: 'plate_num',
      }, {
        title: '裸车收入',
        dataIndex: 'bare_auto',
        key: 'bare_auto',
        className: 'text-right',
      }, {
        title: '上牌收入',
        dataIndex: 'license_tax',
        key: 'license_tax',
        className: 'text-right',
      }, {
        title: '按揭收入',
        dataIndex: 'loan',
        key: 'loan',
        className: 'text-right',
      }, {
        title: '保险收入',
        dataIndex: 'insurance',
        key: 'insurance',
        className: 'text-right',
      }, {
        title: '加装收入',
        dataIndex: 'decoration',
        key: 'decoration',
        className: 'text-right',
      }, {
        title: '总收入',
        dataIndex: 'total',
        key: 'total',
        className: 'text-right',
      },
    ];

    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.currentPage}
        onPageChange={this.handlePageChange}
      />
    );
  }
}
