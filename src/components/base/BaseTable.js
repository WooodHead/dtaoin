import React from 'react';
import {message} from 'antd';

import api from '../../middleware/api';
import TableWithPagination from '../widget/TableWithPagination';

export default class BaseTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      list: [],
      total: 0,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getList(this.props);
  }

  /**
   * source 加载数据接口
   * reload 添加或编辑一条数据成功后，可手动触发更新数据，比刷新浏览器体验更好
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.source !== this.props.source || nextProps.reload) {
      this.getList(nextProps);
    }
  }

  getList(props) {
    this.setState({isFetching: true});
    api.ajax({
      url: props.source,
    }, (data) => {
      let {list, total} = data.res;
      this.setState({
        isFetching: false,
        list,
        total: parseInt(total),
      });
    }, (error) => {
      message.error(`获取列表数据失败[${error}]`);
      this.setState({isFetching: false});
    });
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  renderTable(columns) {
    let {isFetching, list, total} = this.state;

    return (
      <TableWithPagination
        isLoading={isFetching}
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.page}
        onPageChange={this.handlePageChange}
      />
    );
  }
}
