import React from 'react';
import {Row, Col} from 'antd';

import BaseList from '../../../components/base/BaseList';
import SearchBox from '../../../components/base/SearchBox';
import TableWithPagination from '../../../components/base/TableWithPagination';

import New from './New';
import EditStatus from './EditStatus';
import Detail from './Detail';
import UseLog from './UseLog';

import api from '../../../middleware/api';

export default class PotentialCustomerList extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      name: '',
      page: props.location.query.page || 1,
      list: [],
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    let {name, page} = this.state;
    this.getTableData(name, page);
  }

  handleSearch(value) {
    this.setState({page: 1});
    this.getTableData(value, 1);
  }

  handlePageChange(page) {
    this.setState({page});
    this.getTableData(this.state.name, page);
  }

  getTableData(name, page) {
    this.setState({isFetching: true});
    api.ajax({
      url: api.fixedAssets.list(name, page),
    }, data => {
      let {list, total} = data.res;

      this.setState({
        isFetching: false,
        name,
        list,
        total: parseInt(total),
      });
    });
  }

  render() {
    let {isFetching, list, total, page} = this.state;
    const columns = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '品牌 型号',
      dataIndex: 'brand',
      key: 'brand',
    }, {
      title: '购买日期',
      dataIndex: 'buy_date',
      key: 'buy_date',
    }, {
      title: '购入单价(元)',
      dataIndex: 'unit_price',
      key: 'unit_price',
    }, {
      title: '数量',
      dataIndex: 'total_count',
      key: 'total_count',
    }, {
      title: '总值(元)',
      dataIndex: 'total_price',
      key: 'total_price',
    }, {
      title: '正常',
      dataIndex: 'zhengchang_count',
      key: 'zhengchang_count',
    }, {
      title: '维修',
      dataIndex: 'weixiu_count',
      key: 'weixiu_count',
    }, {
      title: '出借',
      dataIndex: 'chujie_count',
      key: 'chujie_count',
    }, {
      title: '丢失',
      dataIndex: 'diushi_count',
      key: 'diushi_count',
    }, {
      title: '报废',
      dataIndex: 'baofei_count',
      key: 'baofei_count',
    }, {
      title: '负责人',
      dataIndex: 'incharge_user_name',
      key: 'incharge_user_name',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render (value, record) {
        return (
          <span>
            <EditStatus _id={value}/>
            <Detail detail={record}/>
            <UseLog _id={value} detail={record}/>
          </span>
        );
      },
    }];

    return (
      <div>
        <Row>
          <Col span={12}>
            <SearchBox
              onSearch={this.handleSearch}
              isSearching={this.state.isFetching}
              style={{width: 200, marginBottom: 10}}
              placeholder="请输入资产名称搜索"
            />
          </Col>
          <Col span={12}>
            <New />
          </Col>
        </Row>

        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

