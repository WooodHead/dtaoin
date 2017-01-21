import React from 'react';
import {Row, Col} from 'antd';
import BaseList from '../../../components/base/BaseList';
import SearchBox from '../../../components/search/SearchBox';
import TableWithPagination from '../../../components/base/TableWithPagination';
import PayWareModal from '../part/PayWareModal';

import New from './New';
import Edit from './Edit';
import PartEntryLog from './PartEntryLog';

import api from '../../../middleware/api';

export default class List extends BaseList {
  constructor(props) {
    super(props);
    this.state = {
      company: '',
      list: [],
      page: 1,
      isFetching: false,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    let {company, page} = this.state;
    this.getTableData({company, page});
  }

  handleSearchChange(company) {
    this.setState({company, page: 1});
    this.getTableData({company, page: 1});
  }

  handlePageChange(page) {
    let {company} = this.state;
    this.setState({page});
    this.getTableData({company, page});
  }

  getTableData(params) {
    this.setState({isFetching: true});
    api.ajax({url: api.warehouse.supplier.list(params)}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }

  render() {
    let {list, total, page, isFetching} = this.state;

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'supplier_company',
        key: 'supplier_company',
      }, {
        title: '主营业务',
        dataIndex: 'main_business',
        key: 'main_business',
      }, {
        title: '电话号码',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '联系人',
        dataIndex: 'user_name',
        key: 'user_name',
      }, {
        title: '单位地址',
        dataIndex: 'address',
        key: 'address',
      }, {
        title: '税号',
        dataIndex: 'tax',
        key: 'tax',
      }, {
        title: '账号',
        dataIndex: 'bank_account',
        key: 'bank_account',
      }, {
        title: '开户行',
        dataIndex: 'bank',
        key: 'bank',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render(id, record){
          return (
            <span>
              <Edit supplier={record}/>
              <PayWareModal supplierId={id} size="small"/>
              <PartEntryLog supplierId={id}/>
            </span>
          );
        },
      },
    ];

    return (
      <div>
        <Row className="mb10">
          <Col span={12}>
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入供应商名称搜索"
              style={{width: 250}}
            />
          </Col>
          <Col span={12}>
            <span className="pull-right"><New /></span>
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
