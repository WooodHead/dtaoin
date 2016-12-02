import React from 'react'
import api from '../../../middleware/api'
import {Row, Col} from 'antd'
import text from '../../../middleware/text'
import ImagePreview from '../../modals/ImagePreview'

export default class MaintPartEntryInfo extends React.Component {
  render() {
    const {detail}=this.props;

    return <div className="info-board">
      <Row type="flex" className="info-row">
        <Col span="12">单号：{detail._id}</Col>
      </Row>
      <Row type="flex" className="info-row">
        <Col span="12">供应商：{detail.supplier_company}</Col>
        <Col span="6">进货时间：{detail.ctime}</Col>
        <Col span="6">进货数量(个)：{detail.amount}</Col>
      </Row>
      <Row type="flex" className="info-row">
        <Col span="6">进货价(元)：{detail.in_price}</Col>
        <Col span="6">零售价(元)：{detail.sell_price}</Col>
        <Col span="6">小计(元)：{detail.in_price * detail.amount}</Col>
        <Col span="6">付款方式：{text.partPayType[Number(detail.pay_type)]}</Col>
      </Row>
      <Row type="flex" className="info-row">
        <Col span="6">进货单:
          <ImagePreview
            title="进货单"
            images={[{
                title: `${detail._id}-进货单`,
                url: api.getPartEntryImgUrl(detail._id, 'godown_entry_pic')
               }]}
            disabled={!detail.godown_entry_pic}
          />
        </Col>
        <Col span="18">备注：{detail.remark}</Col>
      </Row>
    </div>
  }
}
