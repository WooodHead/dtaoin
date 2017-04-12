import React, {Component} from 'react';
import {Row, Col} from 'antd';

import api from '../../middleware/api';

export default class MaintenanceReminderInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };

    [].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getMaintenanceReminderInfo();
  }

  getMaintenanceReminderInfo() {
    api.ajax({url: api.task.taskCustomerMaintainList(this.props.customerId)}, data => {
      this.setState({data: data.res.list});
      this.props.onSuccess(data.res.total);
    });
  }

  render() {
    let {data} = this.state;

    let content = (
      data.map(item => {
        return (
          <div className="mb10" key={item._id}>
            <span style={{display: 'inline-block', width: '130px'}}>
              {item.plate_num}
            </span>
            <span style={{display: 'inline-block', width: '230px'}}>
              <label className="label">提醒保养时间</label>
              {item.remind_date}
            </span>
            <span style={{display: 'inline-block', width: '230px'}}>
              <label className="label">工单号</label>
              {!!Number(item.from_maintain_id) ? item.from_maintain_id : '无'}
            </span>

            <span>
              <label className="label">任务描述</label>
              {item.remark}
            </span>
          </div>
        );
      })
    );
    return (
      <div>
        <Row>
          <Col span={6}>
            <h3 className="mb20">提醒信息</h3>
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
