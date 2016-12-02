import React from 'react'
import {Row, Col} from 'antd'
import text from '../../../middleware/text'
import NewDealModal from '../../modals/presales/NewDealModal'
import EditDealModal from '../../modals/presales/EditDealModal'

export default class AutoDealInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let auto = this.props.auto, auto_id = this.props.idAuto, customer_id = this.props.id;
    let content = [], action = [];

    if (auto == undefined) {
      action = <NewDealModal customer_id={customer_id} user_auto_id={auto_id} size="default" isSingle={true}/>;
      content = <Row type="flex" className="info-row"><Col span="24">暂无信息,请完善</Col></Row>;
    } else {
      action = <EditDealModal customer_id={customer_id} size="default" user_auto_id={auto_id}/>;
      content = (
        <div>
          <Row type="flex" className="info-row">
            <Col span="6">销售负责人：{auto.seller_user_name}</Col>
            <Col span="6">交易类型：{text.carType[Number(auto.car_type)]}</Col>
            <Col span="6">付款方式：{text.autoPayType[Number(auto.pay_type)]}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span="6">成交时间：{auto.order_date}</Col>
            <Col span="6">交车时间：{auto.deliver_date}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span="6">车辆售价(元)：{auto.sell_price}</Col>
            <Col span="6">置换旧车价(元)：{auto.trade_in_price}</Col>
            <Col span="6">订金(元)：{auto.deposit}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span="6">上牌费(元)：{auto.license_tax_in}</Col>
            <Col span="6">购置税(元)：{auto.purchase_tax}</Col>
            <Col span="6">赠品内容：{auto.gift}</Col>
          </Row>
          <Row type="flex" className="padding-l-20 padding-r-20">
            <Col span="12">备注：{auto.remark}</Col>
          </Row>
        </div>
      )
    }
    return (
      <div className="info-board">
        <Row type="flex" className="info-row">
          <Col span="6" className="font-size-18">购车信息</Col>
          <Col span="6" offset="12">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    )
  }
}
