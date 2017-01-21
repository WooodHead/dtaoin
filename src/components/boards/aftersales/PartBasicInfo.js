import React from 'react';
import {Row, Col} from 'antd';
import EditPart from '../../../containers/warehouse/part/Edit';

export default class PartsBasicInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {detail}=this.props;
    let content = [];
    if (detail == undefined) {
      content = (
        <Row type="flex" className="info-row">
          <Col span={24}><p className="text-gray">暂无信息,请完善</p></Col>
        </Row>
      );
    } else {
      content = (
        <div>
          <Row type="flex" className="info-row">
            <Col span={6}>配件名：{detail.name}</Col>
            <Col span={6}>配件号：{detail.part_no}</Col>
            <Col span={6}>配件分类：{detail.part_type_name}</Col>
            <Col span={6}>产值类型：{detail.maintain_type_name}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span={6}>适用车型：{detail.scope}</Col>
            <Col span={6}>品牌：{detail.brand}</Col>
            <Col span={6}>规格：{detail.spec}/{detail.unit}</Col>
            <Col span={6}>库存数(个)：{detail.amount}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span={6}>冻结数(个)：{detail.freeze}</Col>
            <Col span={6}>当前进货价(元)：{detail.in_price}</Col>
            <Col span={6}>历史最低进价(元)：{detail.min_in_price}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span={12}>备注：{detail.remark}</Col>
          </Row>
        </div>
      );
    }

    return (
      <div className="info-board">
        <Row type="flex" className="info-row">
          <Col span={12} className="font-size-18">基本信息</Col>
          <Col span={12}><span className="pull-right"><EditPart part={detail}/></span></Col>
        </Row>
        {content}
      </div>
    );
  }
}
