import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button} from 'antd';
import api from '../../middleware/api';
import TableWithPagination from '../../components/base/TableWithPagination';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.getListData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getListData(nextProps);
  }

  handlePageChange(page) {
    this.props.updateState({page});
  }

  getListData(props) {
    api.ajax({url: props.source}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total)});
    }.bind(this));
  }

  render() {
    let {list, total} = this.state;

    const columns = [{
      title: '门店',
      dataIndex: 'company_name',
      key: 'company_name',
    }, {
      title: '姓名',
      dataIndex: 'customer_name',
      key: 'customer_name',
    }, {
      title: '电话',
      dataIndex: 'customer_phone',
      key: 'customer_phone',
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
        return <span>{value}星</span>;
      },
    }, {
      title: '施工质量',
      dataIndex: 'quality',
      key: 'quality',
      render (value) {
        return <span>{value}星</span>;
      },
    }, {
      title: '店面环境',
      dataIndex: 'environment',
      key: 'environment',
      render (value) {
        return <span>{value}星</span>;
      },
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
        return (
          <Link
            to={{
              pathname: '/aftersales/project/create/',
              query: {
                customer_id: record.customer_id,
                auto_id: record.auto_id,
                maintain_intention_id: record.intention_id,
              },
            }} target="_blank">
            <Button type="primary" size="small">查看工单</Button>
          </Link>
        );
      },
    }];

    return (
      <TableWithPagination
        columns={columns}
        dataSource={list}
        total={total}
        currentPage={this.props.currentPage}
        onPageChange={this.handlePageChange}
      />
    );
  }
}
