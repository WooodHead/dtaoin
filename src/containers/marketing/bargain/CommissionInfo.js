import React from 'react';
import { Tooltip, Icon, Button, message } from 'antd';

import api from '../../../middleware/api';

import NumberInput from '../../../components/widget/NumberInput';

export default class CommissionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewBonus: '',
      changeBonus: '',
      detail: {},
    };
    [
      'handleReadChange',
      'handleVerificationChange',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.getDetail();
  }

  handleReadChange(value) {
    this.setState({ viewBonus: value });
  }

  handleVerificationChange(value) {
    this.setState({ changeBonus: value });
  }

  handleSubmit() {
    const { viewBonus, changeBonus } = this.state;
    const { activityId } = this.props;

    const data = {
      activity_id: activityId,
      view_bonus: viewBonus,
      change_bonus: changeBonus,
    };
    api.ajax({
      url: api.coupon.bonusEditBargainActivity(),
      type: 'POST',
      data,
    }, () => {
      message.success('编辑提成信息成功');
    });
  }

  getDetail() {
    const { activityId } = this.props;
    api.ajax({ url: api.coupon.bargainActivityDetail(activityId) }, data => {
      const { detail } = data.res;
      this.setState({
        detail,
        viewBonus: detail.view_bonus,
        changeBonus: detail.change_bonus,
      });
    });
  }

  render() {
    const { viewBonus, changeBonus } = this.state;
    const self = this;

    return (
      <div className="commission-info">
        <div className="line" />
        <div className="mb10">
          <label className="label">阅读提成</label>
          <NumberInput
            style={{ width: '164px' }}
            id="read"
            unit="元"
            unitVisible={true}
            onChange={self.handleReadChange}
            value={viewBonus || ''}
          />
          <span className="ml10">
            <Tooltip placement="topLeft" title={<span>指活动每被查看一次，给员工的提成，同一用户重复查看，不计入提成</span>}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        </div>

        <div>
          <label className="label">兑换提成</label>
          <NumberInput
            style={{ width: '164px' }}
            id="verification"
            unit="元"
            unitVisible={true}
            onChange={self.handleVerificationChange}
            value={changeBonus || ''}
          />
          <span className="ml10">
            <Tooltip placement="topLeft" title={<span>指参与砍价活动的商品每被成功兑换，给员工的提成</span>}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        </div>
        <div className="line" />
        <Button type="primary" onClick={this.handleSubmit}>提交</Button>
      </div>
    );
  }
}
