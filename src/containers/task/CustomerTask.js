import React, {Component} from 'react';
import {Row, Col, Select, message} from 'antd';
import TableWithPagination from '../../components/base/TableWithPagination';
import text from '../../config/text';
import api from '../../middleware/api';
import CustomerTaskModal from './CustomerTaskModal';
import {Link} from 'react-router';

const Option = Select.Option;
export default class CustomerTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      totalPagination: 0,
      typeList: [],
      data: [],
      status: this.props.location.query.status || 0,
      type: '-1',
      page: props.location.query.page || 1,
    };
    [
      'getList',
      'handleChangeStatus',
      'handleChangeType',
      'handleChangeData',
      'getCommonTaskTypeList',
      'handlePaginationChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.location.query.page,
    }, () => {
      this.getList(this.state.type, this.state.status, this.state.page);
    });
  }

  componentDidMount() {
    this.getCommonTaskTypeList();
    this.getList(this.state.type, this.state.status);
  }

  handlePaginationChange(page) {
    this.setState({page});
    this.getList(this.state.type, this.state.status, page);
  }

  getList(type, status, page = 1) {
    this.setState({isFetching: true});
    api.ajax({
      url: api.task.getCustomerTask(type, status, page),
    }, (data) => {
      if (data.code !== 0) {
        message.error(data.msg);
      } else {
        let list = data.res.list ? data.res.list : [];
        let totalPagination = Number(data.res.total) || 0;
        this.setState({data: list, totalPagination: totalPagination, isFetching: false}, () => {
        });
      }
    });
  }

  //获取顾客任务类型
  getCommonTaskTypeList() {
    api.ajax({
      url: api.task.commonTaskTypeList(),
    }, (data) => {
      data.res.list.unshift({_id: '-1', name: '全部'});
      this.setState({
        typeList: data.res.list,
      });
    }, () => {
      message.error('保存数据失败');
    });
  }

  handleChangeStatus(value) {
    this.setState({
      status: value,
      page: 1,
    }, () => {
      this.getList(this.state.type, this.state.status);
    });
  }

  handleChangeType(value) {
    this.setState({
      type: value,
      page: 1,
    }, () => {
      this.getList(this.state.type, this.state.status);
    });
  }

  handleChangeData() {
    this.getList(this.state.type, this.state.status, this.state.page);
  }

  render() {
    let handleChangeData = this.handleChangeData;
    const columns = [{
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      render(value, record, index) {
        return index + 1;
      },
    }, {
      title: '客户姓名 性别',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render(value, record) {
        let customerName = record.customer_name || '';
        let customerGender = record.customer_gender || '-1';
        return (
          <Link to={{pathname: '/customer/detail', query: {customer_id: record.customer_id}}}>
            {customerName + ' ' + text.gender[customerGender]}
          </Link>
        );
      },
    }, {
      title: '手机号',
      dataIndex: 'customer_phone',
      key: 'customer_phone',
    }, {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      render(value, record) {
        return text.taskState[record.status];
      },
    }, {
      title: '任务类型',
      dataIndex: '',
      key: '',
      className: 'center',
      render(value, record) {
        return record.type_name;
      },
    }, {
      title: '任务描述',
      dataIndex: 'remark',
      key: 'remark',
      className: 'center',
    }, {
      title: '下次提醒',
      dataIndex: 'remind_date',
      key: 'remind_date',
      className: 'center',
      render(value) {
        let year = value.split('-')[0];
        if (Number(year) > 0) {
          return value;
        } else {
          return '';
        }
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      className: 'center',
      render(value, record) {
        return (
          <div>
            <CustomerTaskModal
              record={record}
              task_type="common"
              handleChangeData={handleChangeData}
            />
          </div>
        );
      },
    }];
    return (
      <div>
        <Row className="mb15">
          <Col span={6}>
            <label span={6} className="margin-right-20">任务状态:</label>
            <Select size="large" defaultValue={String(this.state.status)} onSelect={this.handleChangeStatus}
                    style={{width: 200}}>
              <Option value="0">未跟进</Option>
              <Option value="1">进行中</Option>
              <Option value="2">已完成</Option>
            </Select>
          </Col>

          <Col span={9}>
            <label span={6} className="margin-right-20">类型:</label>
            <Select size="large" defaultValue="全部" onSelect={this.handleChangeType} style={{width: 200}}>
              {this.state.typeList.map((item, index) =>
                <Option value={`${item._id}`} key={index}>{item.name}</Option>
              )}
            </Select>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={this.state.isFetching}
          columns={columns}
          dataSource={this.state.data}
          total={this.state.totalPagination}
          currentPage={this.state.page}
          onPageChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
