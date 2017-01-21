import React, {Component} from 'react';
import {Link} from 'react-router';
import {Row, Col, Select, message} from 'antd';

import TableWithPagination from '../../components/base/TableWithPagination';
import TaskModal from './TaskModal';

import text from '../../config/text';
import api from '../../middleware/api';

const Option = Select.Option;

export default class RenewalTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      status: this.props.location.query.status || 0,
      dueData: text.dueData[0],
      page: props.location.query.page || 1,
      totalPagination: 0,
      isFetching: false,
    };
    [
      'getList',
      'handleChangeStatus',
      'handleChangeDueData',
      'dueExpire',
      'handleChangeData',
      'handlePaginationChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.location.query.page,
    }, () => {
      this.getList(this.state.dueData, this.state.status, this.state.page);
    });
  }

  componentDidMount() {
    this.getList(this.state.dueData, this.state.status);
  }

  handlePaginationChange(page) {
    this.setState({page});
    this.getList(this.state.dueData, this.state.status, page);
  }

  getList(between, status, page = 1) {
    this.setState({isFetching: true});
    api.ajax({
      url: api.task.getRenewalTaskList(between, status, page),
    }, (data) => {
      if (data.code !== 0) {
        message.error(data.msg);
      } else {
        let list = data.res.list ? data.res.list : [];
        let totalPagination = Number(data.res.total) || 0;
        this.setState({data: list, totalPagination: totalPagination, isFetching: false});
      }
    });
  }

  handleChangeStatus(value) {
    this.setState({
      status: value,
      page: 1,
    }, () => {
      this.getList(this.state.dueData, this.state.status);
    });
  }

  handleChangeDueData(value) {
    this.setState({
      dueData: text.dueData[value],
      page: 1,
    }, () => {
      this.getList(this.state.dueData, this.state.status);
    });
  }

  //计算指定日期距离今天的天数 date格式为'yyyy-mm-rr'
  dueExpire(date) {
    let forceExpireTimeStamp = Date.parse(new Date(date));
    let todayTimeStamp = new Date().getTime();
    let dueDateStamp = forceExpireTimeStamp - todayTimeStamp;
    return parseInt(dueDateStamp / 1000 / 60 / 60 / 24);
  }

  handleChangeData() {
    this.getList(this.state.dueData, this.state.status, this.state.page);
  }

  render() {
    let handleChangeData = this.handleChangeData;
    let dueExpire = this.dueExpire;
    const columns = [{
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      render(value, record, index) {
        return index + 1;
      },
    }, {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      render(value, record) {
        return text.taskState[record.status];
      },
    }, {
      title: '车牌号',
      dataIndex: 'plate_num',
      key: 'plate_num',
    }, {
      title: '品牌型号',
      dataIndex: 'auto_type_name',
      key: 'auto_type_name',
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
      title: '距离到期',
      key: 'dueExpire',
      className: 'center',
      render(value, record) {
        return dueExpire(record.force_expire_date) + '日';
      },
    }, {
      title: '交强险到期',
      dataIndex: 'force_expire_date',
      key: 'force_expire_date',
      className: 'center',
    }, {
      title: '商业险到期',
      dataIndex: 'business_expire_date',
      key: 'business_expire_date',
      className: 'center',
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      className: 'center',
      render(value, record) {
        return <TaskModal record={record} task_type="insurance" handleChangeData={handleChangeData}/>;
      },
    }];
    return (
      <div>
        <Row className="mb15">
          <Col span={6}>
            <label span={6} className="margin-right-20">任务状态:</label>
            <Select size="large" defaultValue={String(this.state.status)} onSelect={this.handleChangeStatus}
                    style={{width: 200}}>
              <Option value="-1">全部</Option>
              <Option value="0">未跟进</Option>
              <Option value="1">进行中</Option>
              <Option value="2">已完成</Option>
            </Select>
          </Col>

          <Col span={9}>
            <label span={6} className="margin-right-20">距离到期:</label>
            <Select size="large" defaultValue={String(this.state.status)} onSelect={this.handleChangeDueData}
                    style={{width: 200}}>
              <Option value="0">{'<15天'}</Option>
              <Option value="1">16-30天</Option>
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
