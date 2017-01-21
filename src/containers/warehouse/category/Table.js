import React from 'react';
import {Row, Col} from 'antd';
import api from '../../../middleware/api';
import TableWithPagination from '../../../components/base/TableWithPagination';
import SearchBox from '../../../components/search/SearchBox';

import New from './New';
import Edit from './Edit';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      isFetching: false,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  handleSearchChange(name) {
    this.props.updateState({name, page: 1});
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  getList(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source}, (data) => {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total), isFetching: false});
    });
  }

  render() {
    let {list, total, isFetching} = this.state;

    let USER_SESSION = sessionStorage.getItem('USER_SESSION');
    USER_SESSION = USER_SESSION ? JSON.parse(USER_SESSION) : {};

    const columns = [
      {
        title: '配件分类',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '配件档次',
        dataIndex: 'levels',
        key: 'level',
        render (value) {
          let ele = [];
          if (value.length > 0) {
            let levels = JSON.parse(value);
            levels.map(function (item, index) {
              ele.push(
                <div className="in-table-line" key={index}>
                  {item.name}
                </div>
              );
            });
          }
          return ele;
        },
      }, {
        title: '报价(元)',
        dataIndex: 'levels',
        key: 'price',
        render (value) {
          let ele = [];
          if (value.length > 0) {
            let levels = JSON.parse(value);
            levels.map(function (item, index) {
              ele.push(
                <div className="in-table-line column-money" key={index}>
                  {Number(item.price).toFixed(2)}
                </div>);
            });
          }
          return ele;
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'operation',
        render(item, record){
          return <Edit category={record} disabled={USER_SESSION.company_id != record.company_id}/>;
        },
      },
    ];

    return (
      <div>
        <Row className="mb10">
          <Col span={12}>
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入配件分类"
              style={{width: 250}}
            />
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <New />
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
