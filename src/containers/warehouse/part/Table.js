import React from 'react';
import {Link} from 'react-router';
import {Row, Col} from 'antd';

import SearchBox from '../../../components/search/SearchBox';
import TableWithPagination from '../../../components/base/TableWithPagination';

import New from './New';
import Edit from './Edit';
import StockPartModal from './StockPartModal';

import api from '../../../middleware/api';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAction: false,
      list: [],
      isFetching: false,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  handleSearchChange(key) {
    this.props.updateState({key, page: 1});
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  handleAdd() {
    this.getList(this.props);
  }

  getList(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }

  render() {
    let {list, total, isFetching} = this.state;

    const columns = [
      {
        title: '配件名',
        dataIndex: 'name',
        key: 'name',
        render(item, record){
          return (
            <Link to={{pathname: '/warehouse/part/detail', query: {id: record._id, page: 1}}}>
              {item}
            </Link>
          );
        },
      }, {
        title: '配件号',
        dataIndex: 'part_no',
        key: 'part_no',
      }, {
        title: '产值类型',
        dataIndex: 'maintain_type_name',
        key: 'maintain_type_name',
      }, {
        title: '配件分类',
        dataIndex: 'part_type_name',
        key: 'part_type_name',
      }, {
        title: '适用车型',
        dataIndex: 'scope',
        key: 'scope',
      }, {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
      }, {
        title: '库存数量/已冻结',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right',
        render(item, record){
          return <span>{item}/{record.freeze}</span>;
        },
      }, {
        title: '当前进货价（元）',
        dataIndex: 'in_price',
        key: 'in_price',
        className: 'text-right',
      }, {
        title: '进货时间',
        dataIndex: 'ctime',
        key: 'ctime',
        className: 'center',
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        className: 'center',
        render(item, record){
          return (
            <div>
              <Edit part={record} size="small"/>
              <StockPartModal part={record} size="small"/>
            </div>
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
              placeholder="请输入配件名或配件号搜索"
              style={{width: 250}}
            />
          </Col>
          <Col span={12}>
            <div className="pull-right">
              <New onSuccess={this.handleAdd.bind(this)}/>
            </div>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={this.props.currentPage}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
