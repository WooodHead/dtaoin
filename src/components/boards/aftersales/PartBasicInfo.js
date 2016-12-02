import React from 'react'
import {Row, Col} from 'antd'
import StockPartModal from '../../modals/warehouse/part/StockPartModal'
import EditPart from '../../modals/warehouse/part/EditPart'

export default class PartsBasicInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {detail}=this.props;
    let content = [], action = [];
    if (detail == undefined) {
      action = <EditPart part={detail}/>;
      content = (
        <Row type="flex" className="info-row">
          <Col span="24">暂无信息,请完善</Col>
        </Row>
      )
    } else {
      action = <EditPart part={detail}/>;
      content = (
        <div>
          <Row type="flex" className="info-row">
            <Col span="6">配件号：{detail.part_no}</Col>
            <Col span="6">配件名：{detail.name}</Col>
            <Col span="6">产值类型：{detail.maintain_type_name}</Col>
            <Col span="6">配件分类：{detail.part_type_name}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span="6">适用车型：{detail.scope}</Col>
            <Col span="6">库存数(个)：{detail.amount}</Col>
            <Col span="6">当前进货价(元)：{detail.in_price}</Col>
            <Col span="6">当前零售价(元)：{detail.sell_price}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span="12">备注：{detail.remark}</Col>
          </Row>
        </div>
      )
    }

    return (
      <div className="info-board">
        <Row type="flex" className="info-row">
          <Col span="6" className="font-size-18">基本信息</Col>
          <Col span="6" offset="12">
            <EditPart part={detail}/>
            <StockPartModal
              isNew={false}
              part={detail}
            />
          </Col>
        </Row>
        {content}
      </div>
    )
  }
}
