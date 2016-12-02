import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {Table, Row, Col, Button, message} from 'antd'
import api from '../../../middleware/api'
import formatter from '../../../middleware/formatter'
import TableWithPagination from '../../base/TableWithPagination'

import NewActivity from '../../modals/activity/NewActivity'

export default class CommentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }

  componentDidMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      this.setState({tableData: data.res.list});
    }.bind(this));
  }

  render() {
    const columns = [{
      title: '门店',
      dataIndex: 'company_name',
      key: 'company_name',
    }, {
      title: '姓名',
      dataIndex: 'custmer_name',
      key: 'custmer_name',
    }, {
      title: '电话',
      dataIndex: 'custmer_phone',
      key: 'custmer_phone',
    }, {
      title: '车牌号',
      dataIndex: 'plate_num',
      key: 'plate_num',
    }, {
      title: '车型',
      dataIndex: 'auto_type_name',
      key: 'auto_type_name',
    }, {
      title: '服务态度',
      dataIndex: 'attitude',
      key: 'attitude',
      render (value) {
        return (
          <span>
            {value}星
          </span>
        )
      }
    }, {
      title: '施工质量',
      dataIndex: 'quality',
      key: 'quality',
      render (value) {
        return (
          <span>
            {value}星
          </span>
        )
      }
    }, {
      title: '店面环境',
      dataIndex: 'environment',
      key: 'environment',
      render (value) {
        return (
          <span>
            {value}星
          </span>
        )
      }
    }, {
      title: '评价',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '打分时间',
      dataIndex: 'ctime',
      key: 'ctime',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: 'action',
      className: 'center',
      render (value, record) {
        let that = this;
        return (
          <span>
            <Link
              to={{ pathname: "/aftersales/project/create/", query: { customer_id:record.customer_id, user_auto_id:record.user_auto_id, maintain_intention_id:record.intention_id}}} target="_blank">
              <Button type="primary" size="small" >查看工单</Button>
            </Link>
          </span>
        )
      }
    }];

    return (
      <div>
        <TableWithPagination
          columns={columns}
          dataSource={this.state.tableData}
          pathname={this.props.pathname}
          page={this.props.page}
        />
      </div>
    );
  }
}
