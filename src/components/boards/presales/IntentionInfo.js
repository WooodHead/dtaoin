import React from 'react'
import {Row, Col} from 'antd'
import text from '../../../middleware/text'

export default class IntentionInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {intention} = this.props,
      reason = '',
      disabled = false;

    if (Number(intention.status) === -1) {
      reason = `流失原因：${intention.fail_type_names} ${intention.fail_reason}`;
      disabled = true;
    }

    /*put separately from the title info for reusage of auto potential and customer detail*/
    return (
      <div>
        <Row type="flex" className="info-row">
          <Col span="6">意向级别：{intention.level}</Col>
          <Col span="6">意向状态：{intention.status_desc}</Col>
          <Col span="12">{reason}</Col>
        </Row>
        <Row type="flex" className="info-row">
          <Col span="6">意向车型：{intention.auto_type_name}</Col>
          <Col span="6">外观内饰：{intention.out_color_name}/{text.inColorName[Number(intention.in_color)]}</Col>
          <Col span="6">购买预算：{text.budgetLevel[Number(intention.budget_level)]}</Col>
          <Col span="6">按揭意愿：{text.isMortgage[Number(intention.is_mortgage)]}</Col>
        </Row>
        <Row type="flex" className="info-row">
          <Col span="6">4S给客户报价单：{intention.other_quotation}</Col>
          <Col span="6">买车关注点：{intention.focus}</Col>
          <Col span="12">加装需求：{intention.decoration}</Col>
        </Row>
        <Row type="flex" className="info-row">
          <Col span="6">销售负责人：{intention.seller_user_name}</Col>
          <Col span="6">创建时间：{intention.ctime}</Col>
          <Col span="12">更新时间：{intention.mtime}</Col>
        </Row>

        <Row type="flex" className="padding-l-20 padding-r-20">
          <Col span="12">备注：{intention.remark}</Col>
        </Row>
      </div>
    );
  }
}
