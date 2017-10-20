import React from 'react';
import { Row, Col } from 'antd';

import Edit from '../../../containers/presales/potential/Edit';

import api from '../../../middleware/api';
import text from '../../../config/text';

export default class InfoIntention extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intentionInfo: {},
    };
    [
      'handleIntentionChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { customerId, autoId, intentionId } = this.props;

    Number(autoId) ?
      this.getIntentionInfoByautoId(customerId, autoId)
      :
      this.getIntentionInfoByIntentionId(customerId, intentionId);
  }

  getIntentionInfoByautoId(customerId, autoId) {
    api.ajax({ url: api.presales.intention.getIntentionDetailByAutoId(customerId, autoId) }, data => {
      this.setState({ intentionInfo: data.res.intention_info || {} });
    }, () => {
    });
  }

  getIntentionInfoByIntentionId(customerId, intentionId) {
    api.ajax({ url: api.presales.intention.detail(customerId, intentionId) }, data => {
      this.setState({ intentionInfo: data.res.intention_info || {} });
    }, () => {
    });
  }

  handleIntentionChange() {
    const { customerId, autoId, intentionId } = this.props;

    autoId ?
      this.getIntentionInfoByautoId(customerId, autoId)
      :
      this.getIntentionInfoByIntentionId(customerId, intentionId);
  }

  render() {
    const { intentionInfo } = this.state;
    const { customerId } = this.props;
    return (
      <div className="mt20">
        <Row>
          <Col span={12}>
            <h3>意向信息</h3>
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <Edit
                customerId={customerId}
                intentionId={intentionInfo._id}
                type="primary"
                size="default"
                onSuccess={this.handleIntentionChange}
              />
            </span>
          </Col>
        </Row>
        <Row className="mt20">
          <Col span={6}><span className="label text-gray">车辆</span>{intentionInfo.auto_type_name}</Col>
          <Col span={6}>
            <span className="label text-gray">外观内饰</span>
            {`${intentionInfo.out_color_name || '不限'} / ${intentionInfo.in_color ? text.inColorName[Number(intentionInfo.in_color)] : '不限'}`}
          </Col>
          <Col span={6}><span
            className="label text-gray">购买预算</span>{text.budgetLevel[Number(intentionInfo.budget_level)]}</Col>
          <Col span={6}><span
            className="label text-gray">按揭意愿</span>{text.isMortgage[Number(intentionInfo.is_mortgage)]}</Col>
        </Row>

        <Row className="mt20">
          <Col span={6}><span className="label text-gray">4s报价</span>{intentionInfo.other_quotation}</Col>
          <Col span={6}><span className="label text-gray">买车关注点</span>{intentionInfo.focus}</Col>
          <Col span={6}><span className="label text-gray">加装需求</span>{intentionInfo.decoration}</Col>
          <Col span={6}><span className="label text-gray">备注</span>{intentionInfo.remark}</Col>
        </Row>
      </div>
    );
  }

}
