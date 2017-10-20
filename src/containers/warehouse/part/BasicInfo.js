import React from 'react';
import { Row, Col, Button, Popconfirm, message } from 'antd';

import api from '../../../middleware/api';
import EditPart from './Edit';

export default class PartsBasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: props.detail,
    };
    [
      'handlePartEdit',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.detail) {
      this.setState({ detail: nextProps.detail });
    }
  }

  handleDisablePart() {
    this.updatePartStatus('-1');
  }

  handleEnablePart() {
    this.updatePartStatus('0');
  }

  handlePartEdit(detail) {
    this.setState({ detail });
  }

  updatePartStatus(type) {
    const values = {
      _id: this.props.detail._id,
      status: type,
    };

    api.ajax({
      url: api.warehouse.part.updatePartStatus(),
      type: 'POST',
      data: values,
    }, () => {
      message.success('修改成功');
      this.props.onStatusChange();
    });
  }

  render() {
    const { detail } = this.state;
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
            <Col span={6}>规格：{detail.spec} {detail.unit}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span={6}>品牌：{detail.brand}</Col>
            <Col span={6}>适用车型：{detail.scope}</Col>
            <Col span={6}>配件分类：{detail.part_type_name}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span={6}>库存数：{detail.amount}</Col>
            <Col span={6}>冻结数：{detail.freeze}</Col>
            <Col span={6}>安全库存：{detail.min_amount}</Col>
            <Col span={6}>加价率：{`${Number(detail.markup_rate) * 100}%`}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span={6}>当前进价：{detail.in_price}</Col>
            <Col span={6}>最低进价：{detail.min_in_price}</Col>
            <Col span={6}>当前售价：{detail.sell_price}</Col>
            <Col span={6}>最低售价：{(Number(detail.in_price) *
            (Number(detail.markup_rate || 0) + 1)).toFixed(2)}</Col>
          </Row>
          <Row type="flex" className="info-row">
            <Col span={12}>备注：{detail.remark}</Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <Row type="flex" className="info-row">
          <Col span={24}>
            {
              detail && Number(detail.status) === 0 ? (
                <div>
                  <div className="pull-right">
                    <EditPart part={detail} type="button" onSuccess={this.handlePartEdit} />
                  </div>
                  <Popconfirm
                    placement="topRight"
                    title="你确定要停用该配件？"
                    onConfirm={this.handleDisablePart.bind(this)}
                  >
                    <Button className="pull-right mr10">停用</Button>
                  </Popconfirm>
                </div>
              ) : (
                <div>
                  <Popconfirm
                    placement="topRight"
                    title="你确定要停用该配件？"
                    onConfirm={this.handleEnablePart.bind(this)}
                  >
                    <Button className="pull-right">启用</Button>
                  </Popconfirm>
                  <span className="pull-right mt5 mr10">配件已停用</span>
                </div>
              )

            }

          </Col>
        </Row>
        <div className="info-board">
          {content}
        </div>
      </div>
    );
  }
}
