import React, {Component} from 'react'
import {Button, Row, Col, Table} from 'antd'
import api from '../../../middleware/api'
import TableWithPagination from '../../base/TableWithPagination'
import SearchBox from '../../search/SearchBox'
import NewSupplier from '../../modals/warehouse/supplier/NewSupplier'
import EditSupplier from '../../modals/warehouse/supplier/EditSupplier'
import PartEntryLog from '../../modals/warehouse/supplier/PartEntryLog'
import PayWareModal from '../../modals/warehouse/part/PayWareModal'

export default class ApplierTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentWillMount() {
    this.getList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  handleSearchChange(company) {
    this.props.updateCondition({company: company});
  }

  getList(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({list: data.res.list});
    }.bind(this))
  }

  render() {
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'supplier_company',
        key: 'supplier_company'
      }, {
        title: '电话号码',
        dataIndex: 'phone',
        key: 'phone'
      }, {
        title: '联系人',
        dataIndex: 'user_name',
        key: 'user_name'
      }, {
        title: '单位地址',
        dataIndex: 'address',
        key: 'address'
      }, {
        title: '税号',
        dataIndex: 'tax',
        key: 'tax',
      }, {
        title: '账号',
        dataIndex: 'bank_account',
        key: 'bank_account'
      }, {
        title: '开户行',
        dataIndex: 'bank',
        key: 'bank'
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'action',
        render(item, record){
          return (
            <div>
              <EditSupplier supplier={record}/>
              <PayWareModal supplierId={item} size='small'/>
            </div>
          )
        }
      }
    ];

    return (
      <div>
        <Row>
          <Col span="12">
            <SearchBox
              change={this.handleSearchChange}
              placeholder="请输入供应商名称搜索"
              style={{width: 250}}
            />
          </Col>
          <Col span="12">
            <span className="pull-right">
              <NewSupplier />
            </span>
          </Col>
        </Row>

        <TableWithPagination
          columns={columns}
          dataSource={this.state.list}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    )
  }
}
