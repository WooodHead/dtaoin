import React from 'react'
import {Row, Col} from 'antd'
import EditDecorationModal from '../../modals/presales/EditDecorationModal'
import NewDecorationModal from '../../modals/presales/NewDecorationModal'

export default class DecorationInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let auto = this.props.auto, auto_id = this.props.idAuto, customer_id = this.props.id;
    let content = [], action = [];

    if (auto == undefined) {
      action = <NewDecorationModal customer_id={customer_id} user_auto_id={auto_id} isSingle={true}/>
      content = <Row type="flex" className="info-row"><Col span="24">暂无信息,请完善</Col></Row>
    } else {
      action = <EditDecorationModal customer_id={customer_id} user_auto_id={auto_id}/>
      content = <div>
        <Row type="flex" className="info-row">
          <Col span="6">装潢时间：{auto.deal_date}</Col>
          <Col span="6">装潢内容：{auto.content}</Col>
          <Col span="6">装潢金额(元)：{auto.price}</Col>
        </Row>
        <Row type="flex" className="padding-l-20 padding-r-20">
          <Col span="12">备注：{auto.remark}</Col>
        </Row>
      </div>
    }
    return (
      <div className="info-board">
        <Row type="flex" className="info-row">
          <Col span="6" className="font-size-18">装饰信息</Col>
          <Col span="6" offset="12">
            {action}
          </Col>
        </Row>
        {content}
      </div>
    );
  }
}
