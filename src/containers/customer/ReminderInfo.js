import React, { Component } from 'react';
import { Col, Row } from 'antd';

import formatter from '../../utils/DateFormatter';

import api from '../../middleware/api';

require('./style.less');

/**
 * 客户详情页-提醒信息
 */
export default class ReminderInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      maintainReminders: [],
      renewalReminders: [],
      yearlyInspactionReminders: [],
      couponCardReminders: [],
      birthdayReminders: [],
      debtReminders: [],
      commonReminders: [],
    };
  }

  componentDidMount() {
    const { customerId } = this.props;
    const startDate = formatter.day(formatter.getMomentDate()); // today
    const endDate = formatter.day(formatter.getMomentNextMonth()); // a month after end

    this.getMaintainReminders(customerId);
    this.getRenewalReminders(customerId);
    this.getYearlyInspactionReminders(customerId);
    this.getCouponCardReminders(customerId);
    this.getBirthdayReminders(customerId);
    this.getDebtReminders(customerId, startDate, endDate);
    this.getCommonReminders(customerId, startDate, endDate);
  }

  getMaintainReminders(customerId) {
    api.ajax({ url: api.task.getCustomerMaintainReminders(customerId) }, data => {
      this.setState({ maintainReminders: data.res.list });
      if (parseInt(data.res.total, 10) > 0) {
        this.props.onSuccess(data.res.total);
      }
    });
  }

  getRenewalReminders(customerId) {
    api.ajax({ url: api.task.getCustomerRenewalReminders(customerId) }, data => {
      this.setState({ renewalReminders: data.res.list });
      if (parseInt(data.res.total, 10) > 0) {
        this.props.onSuccess(data.res.total);
      }
    });
  }

  getYearlyInspactionReminders(customerId) {
    api.ajax({ url: api.task.getCustomerYearlyInspectionReminders(customerId) }, data => {
      this.setState({ yearlyInspactionReminders: data.res.list });
      if (parseInt(data.res.total, 10) > 0) {
        this.props.onSuccess(data.res.total);
      }
    });
  }

  getCouponCardReminders(customerId) {
    api.ajax({ url: api.task.getCustomerCouponCardReminders(customerId) }, data => {
      this.setState({ couponCardReminders: data.res.list });
      if (parseInt(data.res.total, 10) > 0) {
        this.props.onSuccess(data.res.total);
      }
    });
  }

  getBirthdayReminders(customerId) {
    api.ajax({ url: api.task.getCustomerBirthdayReminders(customerId) }, data => {
      this.setState({ birthdayReminders: data.res.list });
      if (parseInt(data.res.total, 10) > 0) {
        this.props.onSuccess(data.res.total);
      }
    });
  }

  getDebtReminders(customerId, startDate, endDate) {
    api.ajax({ url: api.task.getCustomerDebtReminders(customerId, startDate, endDate) }, data => {
      this.setState({ debtReminders: data.res.list });
      if (parseInt(data.res.total, 10) > 0) {
        this.props.onSuccess(data.res.total);
      }
    });
  }

  getCommonReminders(customerId, startDate, endDate) {
    api.ajax({ url: api.task.getCustomerCommonRemimders(customerId, startDate, endDate) }, data => {
      this.setState({ commonReminders: data.res.list });
      if (parseInt(data.res.total, 10) > 0) {
        this.props.onSuccess(data.res.total);
      }
    });
  }

  render() {
    const {
      maintainReminders,
      renewalReminders,
      yearlyInspactionReminders,
      couponCardReminders,
      birthdayReminders,
      debtReminders,
      commonReminders,
    } = this.state;

    return (
      <div className="reminder-info">
        <Row>
          <Col span={6}>
            <h3 className="mb20">提醒信息</h3>
          </Col>
        </Row>

        {maintainReminders.map(item => (
            <div className="reminder-line" key={item._id}>
              <div className="reminder-tag">保养</div>

              <div className="reminder-cell" style={{ width: '130px' }}>{item.plate_num}</div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">提醒保养时间</label>{item.remind_date}
              </div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">工单号</label>
                {!!Number(item.from_maintain_id) ? item.from_maintain_id : '无'}
              </div>

              <div className="reminder-cell">
                <label className="label">上次保养项目</label>{item.last_maintain_item}
              </div>
            </div>
          ))}

        {renewalReminders.map(item => (
            <div className="reminder-line" key={item._id}>
              <div className="reminder-tag">续保</div>

              <div className="reminder-cell" style={{ width: '130px' }}>{item.plate_num}</div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">提醒续保时间</label>{item.remind_date}
              </div>

              <div className="reminder-cell" style={{ width: '230px' }}/>
            </div>
          ))}

        {yearlyInspactionReminders.map(item => (
            <div className="reminder-line" key={item._id}>
              <div className="reminder-tag">年检</div>

              <div className="reminder-cell" style={{ width: '130px' }}>{item.plate_num}</div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">提醒年检时间</label>{item.remind_date}
              </div>

              <div className="reminder-cell" style={{ width: '230px' }}/>
            </div>
          ))}

        {couponCardReminders.map(item => (
            <div className="reminder-line" key={item._id}>
              <div className="reminder-tag">套餐卡</div>

              <div className="reminder-cell" style={{ width: '130px' }}>--</div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">套餐卡到期日期</label>{item.expire_date}
              </div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">套餐卡名称</label>{item.coupon_card_type_name}
              </div>
            </div>
          ))}

        {birthdayReminders.map(item => (
            <div className="reminder-line" key={item._id}>
              <div className="reminder-tag">生日</div>

              <div className="reminder-cell" style={{ width: '130px' }}>--</div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">提醒生日时间</label>{item.remind_date}
              </div>

              <div className="reminder-cell" style={{ width: '230px' }}/>
            </div>
          ))}

        {debtReminders.map(item => (
            <div className="reminder-line" key={item._id}>
              <div className="reminder-tag">催款</div>

              <div className="reminder-cell" style={{ width: '130px' }}>{item.plate_num}</div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">提醒催款时间</label>{item.remind_date}
              </div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">工单号</label>
                {!!Number(item.from_maintain_id) ? item.from_maintain_id : '无'}
              </div>

              <div className="reminder-cell">
                <label className="label">备注</label>{item.remark}
              </div>
            </div>
          ))}

        {commonReminders.map(item => (
            <div className="reminder-line" key={item._id}>
              <div className="reminder-tag">回访</div>

              <div className="reminder-cell" style={{ width: '130px' }}>--</div>

              <div className="reminder-cell" style={{ width: '230px' }}>
                <label className="label">下次提醒日期</label>{item.remind_date}
              </div>

              <div className="reminder-cell" style={{ minWidth: '230px' }}>
                <label className="label">任务描述</label>{item.remark}
              </div>

              <div className="reminder-cell" style={{ width: '230px' }}/>
            </div>
          ))}
      </div>
    );
  }
}
