import React, {Component} from 'react';
import {Row, Col} from 'antd';
import api from '../../middleware/api';
import TableWithPagination from '../../components/base/TableWithPagination';

import NewCompanyModal from './New';
import EditCompanyModal from './Edit';
import SwitchCompany from '../../components/popover/SwitchCompany';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
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
    this.props.updateState({key, page: 1});
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      let {company_list, total} = data.res;
      this.setState({list: company_list, total: parseInt(total)});
    }.bind(this));
  }

  render() {
    let {list, total} = this.state;

    const columns = [{
      title: '门店编号',
      dataIndex: 'company_num',
      key: 'company_num',
    }, {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
    }, {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    }, {
      title: '区县',
      dataIndex: 'country',
      key: 'country',
    }, {
      title: '详细地址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '店总负责人',
      dataIndex: 'admin_name',
      key: 'admin_name',
    }, {
      title: '负责人电话',
      dataIndex: 'admin_phone',
      key: 'admin_phone',
    }, {
      title: '其他联系人',
      dataIndex: 'other_name',
      key: 'other_name',
    }, {
      title: '联系电话',
      dataIndex: 'other_phone',
      key: 'other_phone',
    }, {
      title: '服务电话',
      dataIndex: 'service_phone',
      key: 'service_phone',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      className: 'center',
      render: function (value, record) {
        return (
          <span>
            <EditCompanyModal company={record}/>
            <SwitchCompany company={record}/>
          </span>
        );
      },
    }];

    return (
      <div>
        <Row className="mb10">
          <Col span={24}>
            <NewCompanyModal />
          </Col>
        </Row>

        <TableWithPagination
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
