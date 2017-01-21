import React from 'react';
import {Link} from 'react-router';
import {Row, Col} from 'antd';
import api from '../../../middleware/api';
import SearchBox from '../../../components/search/SearchBox';
import TableWithPagination from '../../../components/base/TableWithPagination';
import NewUserModal from './NewUserModal';
import EditUserModal from './EditUser';
import CalculateWageModal from './CalculateWage';
import FireUserModal from './FireUser';

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
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  handleSearchChange(key) {
    this.props.updateState({key: key, page: 1});
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  getListData(props) {
    this.setState({isFetching: true});
    api.ajax({url: props.source}, function (data) {
      let {user_list, total} = data.res;
      this.setState({list: user_list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }

  render() {
    let {list, total, isFetching} = this.state;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render(value, record) {
        return (
          <Link to={{pathname: '/personnel/user/detail', query: {user_id: record._id}}}>
            {value}
          </Link>
        );
      },
    }, {
      title: '编号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '区域',
      dataIndex: 'company_region',
      key: 'company_region',
    }, {
      title: '门店',
      dataIndex: 'company_name',
      key: 'company_name',
    }, {
      title: '部门',
      dataIndex: 'department_name',
      key: 'department_name',
    }, {
      title: '职位',
      dataIndex: 'role_name',
      key: 'role_name',
    }, {
      title: '入职时间',
      dataIndex: 'hire_date',
      key: 'hire_date',
    }, {
      title: '固定工资',
      dataIndex: 'base_salary',
      key: 'base_salary',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      className: 'center',
      render: function (value, record) {
        return (
          <span>
            <EditUserModal user={record}/>

            <CalculateWageModal
              type="month"
              user={record}
              disabled={record.status === '1'}
            />

            <FireUserModal
              user={record}
              disabled={record.status === '-1'}
            />
          </span>
        );
      },
    }];

    return (
      <div>
        <Row className="mb10">
          <Col span={12}>
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入姓名搜索"
              style={{width: 250}}
            />
          </Col>
          <Col span={12}>
            <NewUserModal />
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
