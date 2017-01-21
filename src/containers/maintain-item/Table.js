import React, {Component} from 'react';
import {Row, Col} from 'antd';
import api from '../../middleware/api';
import TableWithPagination from '../../components/base/TableWithPagination';
import SearchBox from '../../components/search/SearchBox';

import NewItem from './New';
import EditItem from './Edit';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      isFetching: false,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  handleSearchChange(name) {
    this.props.updateState({name, page: 1});
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  refreshData() {
    this.getListData(this.props);
  }

  getListData(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source}, function (data) {
      let {item_list, total} = data.res;
      this.setState({list: item_list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }

  render() {
    let {list, total, isFetching} = this.state;
    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};

    const columns = [{
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '类型',
      dataIndex: 'type_name',
      key: 'type_name',
    }, {
      title: '配件分类',
      dataIndex: 'part_type_list',
      key: 'part_types',
      className: 'no-padding',
      render (value) {
        let ele = [];
        if (value.length > 0) {
          value.map(function (item) {
            ele.push(item.name);
          });
        }
        return ele.join(',');
      },
    }, {
      title: '工时档次',
      key: 'level',
      className: 'no-padding',
      render (value, record) {
        let ele = [];
        if (record.levels.length > 0) {
          let levels = JSON.parse(record.levels);
          levels.map(function (item, index) {
            ele.push(
              <div
                className="in-table-line"
                key={record._id + '-' + index}
              >
                {item.name}
              </div>
            );
          });
        }
        return ele;
      },
    }, {
      title: '工时单价(元)',
      key: 'price',
      className: 'column-money',
      render (value, record) {
        let ele = [];
        if (record.levels.length > 0) {
          let levels = JSON.parse(record.levels);
          levels.map(function (item, index) {
            ele.push(
              <div
                className="in-table-line column-money"
                key={record._id + '-' + index}
              >
                {Number(item.price).toFixed(2)}
              </div>);
          });
        }
        return ele;
      },
    }, {
      title: '操作',
      key: 'option',
      className: 'center',
      render (value, record) {
        return (
          <div>
            <EditItem item={record} disabled={USER_SESSION.company_id != record.company_id}/>
          </div>
        );
      },
    }];

    return (
      <div>
        <Row className="mb10">
          <Col span={12}>
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入名称搜索"
              style={{width: 200}}
            />
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <NewItem onSuccess={this.refreshData.bind(this)}/>
            </span>
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
