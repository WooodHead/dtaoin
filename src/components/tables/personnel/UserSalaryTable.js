import React from 'react'
import {Table} from 'antd'
import SocialSecurityDetailModal from '../../../components/modals/personnel/SocialSecurityDetailModal'

export default class UserSalaryTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const columns = [{
      title: '月份',
      dataIndex: 'month',
      key: 'month'
    }, {
      title: '固定工资/标准',
      dataIndex: 'base_salary',
      key: 'base_salary',
      render: function (value, record) {
        return (
          <span>{record.base_salary_gain}/{record.base_salary}</span>
        );
      }
    }, {
      title: '绩效工资',
      dataIndex: 'performance_salary',
      key: 'performance_salary_amount',
      render: function (value, record) {
        let salary = Number(record.performance_salary),
          rate = Number(record.performance_coefficient),
          attentionRate = Number(record.due_day) ? (Number(record.actual_day) + Number(record.paid_vacation)) / Number(record.due_day) : 0;
        return (
          <span>
            {salary * rate * attentionRate}
          </span>
        );
      }
    }, {
      title: '绩效系数',
      dataIndex: 'performance_coefficient',
      key: 'performance_coefficient'
    }, {
      title: '应到天数',
      dataIndex: 'due_day',
      key: 'due_day'
    }, {
      title: '实到天数',
      dataIndex: 'actual_day',
      key: 'actual_day'
    }, {
      title: '带薪休假',
      dataIndex: 'paid_vacation',
      key: 'paid_vacation'
    }, {
      title: '提成合计',
      dataIndex: 'performance_salary',
      key: 'performance_salary'
    }, {
      title: '扣款金额',
      dataIndex: 'punishment',
      key: 'punishment'
    }, {
      title: '五险一金',
      dataIndex: 'provident_fund',
      key: 'provident_fund',
      render: function (value, record) {
        return (
          <SocialSecurityDetailModal
            linkText={(Number(record.provident_fund) + Number(record.social_security)).toFixed(2)}
            detail={JSON.parse(record.social_security_detail)}
          />
        )
      }
    }, {
      title: '个税',
      dataIndex: 'tax',
      key: 'tax'
    }, {
      title: '奖金',
      dataIndex: 'bonus',
      key: 'bonus'
    }, {
      title: '调节项',
      dataIndex: 'adjustment',
      key: 'adjustment'
    }, {
      title: '实际发放',
      dataIndex: 'net_pay',
      key: 'net_pay'
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    }];

    return (
      <Table
        columns={columns}
        dataSource={this.props.salaryHistory}
        pagination={false}
        size="middle"
        rowKey={record => record.month}
        bordered
        footer={() => '单位(元)'}
      />
    );
  }
}
