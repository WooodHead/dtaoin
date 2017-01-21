import React from 'react';
import api from '../../middleware/api';
import {Row, Col, DatePicker, Select, Badge} from 'antd';
import BaseList from '../../components/base/BaseList';
import NewExpenseModal from '../../components/modals/finance/NewExpenseModal';
import NewIncomeModal from '../../components/modals/finance/NewIncomeModal';
import TableWithPagination from '../../components/base/TableWithPagination';
import formatter from '../../utils/DateFormatter';
import text from '../../config/text';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

export default class MaintExpenseList extends BaseList {
  constructor(props) {
    super(props);
    let lastDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.state = {
      incomeShow: this.props.location.query.incomeShow || false,
      expenseShow: this.props.location.query.expenseShow || false,
      page: props.location.query.page || 1,
      projectTypes: [],
      projectType: '0',
      balancePaymentsType: '-1',
      startTime: formatter.day(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() - 10)),
      endTime: formatter.day(lastDate),
      list: [],
      total: 0,
      isFetching: false,
    };

    [
      'getProjectTypes',
      'handleDateRangeChange',
      'handleProjectSelectChange',
      'handleBalancePaymentsSelectChange',
      'getList',
      'handlePageChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getProjectTypes();
    this.getList();
  }


  getList() {
    this.setState({
      isFetching: true,
    });
    api.ajax({url: api.getExpenseList(this.state.page, this.state.startTime, this.state.endTime, this.state.balancePaymentsType, this.state.projectType)}, function (data) {
      let {list, total} = data.res;
      this.setState({list, total: parseInt(total), isFetching: false});
    }.bind(this));
  }

  handleDateRangeChange(momentTime, stringTime) {
    let startTime = stringTime[0];
    let endTime = stringTime[1];
    this.setState({
      startTime,
      endTime,
      page: 1,
    }, () => {
      this.getList();
    });
  }

  handleProjectSelectChange(value) {
    this.setState({
      projectType: value,
      page: 1,
    }, () => {
      this.getList();
    });
  }

  handleBalancePaymentsSelectChange(value) {
    this.setState({
      balancePaymentsType: value,
      page: 1,
    }, () => {
      this.getList();
    });
  }

  handlePageChange(page) {
    this.setState({
      page,
    }, () => {
      this.getList();
    });
  }

  getProjectTypes() {
    let projectTypes = [];
    let projectTypesPromises = [0, 1].map(item => {
      return new Promise((resolve, reject) => {
        api.ajax({url: api.getProjectTypeList(item)}, function (data) {
          data = data.res.list;
          projectTypes = projectTypes.concat(data);
          resolve(projectTypes);
        }.bind(this), () => {
          reject('0');
        });
      });
    });
    Promise.all(projectTypesPromises).then(() => {
      projectTypes.unshift({_id: '0', name: '全部'});
      this.setState({
        projectTypes,
      });
    });
  }

  render() {
    let {projectTypes, startTime, endTime, list, page, total, isFetching} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render(value, record, index) {
          return index + 1;
        },
      }, {
        title: '收支',
        dataIndex: 'type',
        key: 'type',
        render(value) {
          let status = (Number(value) === 0) ? 'success' : 'error';
          return <Badge status={status} text={text.balancePayments[value]}/>;
        },
      }, {
        title: '项目',
        dataIndex: 'sub_type_name',
        key: 'sub_type_name',
      }, {
        title: '金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        className: 'text-right',
        render(value) {
          return Number(value).toFixed(2);
        },
      }, {
        title: '经办人',
        dataIndex: 'payee',
        key: 'payee',
      }, {
        title: '收款方/付款方',
        dataIndex: 'payer',
        key: 'payer',
      }, {
        title: '付款方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        className: 'center',
        render(value) {
          return text.payType[value];
        },
      }, {
        title: '支付时间',
        dataIndex: 'ptime',
        key: 'ptime',
      }, {
        title: '操作',
        dataIndex: '',
        key: '',
        width: '6%',
        render() {
          return <a href="javascript:void(0)" size="small">查看详情</a>;
        },
      },
    ];
    return (
      <div>
        <Row className="mb15">
          <Col span={20}>
            <label className="margin-right-20">收支款日期:</label>
            <RangePicker
              format={formatter.pattern.day}
              value={[formatter.getMomentDate(startTime), formatter.getMomentDate(endTime)]}
              onChange={this.handleDateRangeChange}
            />
            <label className="margin-right-20 margin-left-60">收支:</label>
            <Select size="large" defaultValue="-1" onSelect={this.handleBalancePaymentsSelectChange}
                    style={{width: 200}}>
              <Option value="-1">全部</Option>
              <Option value="0">收入</Option>
              <Option value="1">支出</Option>
            </Select>

            <label className="margin-right-20 margin-left-60">项目:</label>
            <Select size="large" value={this.state.projectType} onSelect={this.handleProjectSelectChange}
                    style={{width: 200}}>
              {projectTypes.map(type => <Option key={type._id}>{type.name}</Option>)}
            </Select>
          </Col>

          <Col span={4}>
            <span className="pull-right">
              <NewExpenseModal expenseShow={this.state.expenseShow}/>
            </span>
            <span className="pull-right">
              <NewIncomeModal incomeShow={this.state.incomeShow}/>
            </span>
          </Col>
        </Row>

        <TableWithPagination
          isLoading={isFetching}
          columns={columns}
          dataSource={list}
          total={total}
          currentPage={page}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}
