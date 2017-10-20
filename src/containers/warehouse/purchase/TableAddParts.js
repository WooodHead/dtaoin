import React from 'react';
import { Link } from 'react-router-dom';
import { message, Icon } from 'antd';

import api from '../../../middleware/api';
import BaseTable from '../../../components/base/BaseTable';
import TableWithPagination from '../../../components/widget/TableWithPagination';

import New from '../../../containers/warehouse/part/New';

const noResult = require('../../../images/noresult.png');

export default class Table extends BaseTable {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowClick(part) {
    const { list } = this.state;
    list.map((item, index) => {
      if (Number(item._id) === Number(part._id)) {
        list[index].choose = !(list[index].choose);
      }
    });

    this.setState({ list });
    this.props.handleRowClick(part);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source !== this.props.source || nextProps.reload) {
      this.getList(nextProps);
    }
  }

  getList(props) {
    const { parts } = this.props;

    this.setState({ isFetching: true });
    api.ajax({
      url: props.source,
    }, data => {
      const { list, total } = data.res;
      list.map((item, index) => {
        if (parts.has(item._id)) {
          list[index].choose = true;
        }
      });
      this.setState({
        isFetching: false,
        list,
        total: parseInt(total),
      });
    }, error => {
      message.error(`获取列表数据失败[${error}]`);
      this.setState({ isFetching: false });
    });
  }

  renderTable(columns) {
    const { isFetching, list, total } = this.state;
    const { keyword } = this.props;

    return (
      <div>
        {
          list && list.length === 0 ?
            <div className="padding-20 center">
              <img src={noResult} style={{ width: '40px', height: '40px' }}/>
              <p>暂时没有找到该配件，请更换关键字查询或创建新配件</p>
              <div className="mt10">
                <New onSuccess={this.handleRowClick} inputValue={keyword}/>
              </div>
            </div> :
            <TableWithPagination
              isLoading={isFetching}
              columns={columns}
              dataSource={list}
              total={total}
              currentPage={this.props.page}
              onPageChange={this.handlePageChange}
              handleRowClick={this.handleRowClick}
              bordered={false}
            />
        }
      </div>
    );
  }

  render() {
    const columns = [{
      title: '序号',
      render: (value, record, index) => index + 1,
    }, {
      title: '配件名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '配件号',
      dataIndex: 'part_no',
      key: 'part_no',
    }, {
      title: '规格',
      className: 'text-right',
      render: (value, record) => `${record.spec || ''}${record.unit || ''}`,
    }, {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    }, {
      title: '适用车型',
      dataIndex: 'scope',
      key: 'scope',
    }, {
      title: '库存数量',
      dataIndex: 'amount',
      key: 'amount',
      className: 'text-right',
    }, {
      title: '已冻结',
      dataIndex: 'freeze',
      key: 'freeze',
      className: 'text-right',
    }, {
      title: '',
      dataIndex: 'choose',
      className: 'center',
      render: value => value ? <a href="javascript:;"><Icon type="check"/></a> : '',
    }];

    return this.renderTable(columns);
  }
}
