import React from 'react'
import {Row, Col} from 'antd'
import api from '../../middleware/api'
import text from '../../middleware/text'
import EditAutoModal from '../modals/presales/EditAutoModal'
import ImagePreview from '../modals/ImagePreview'

export default class BaseAutoInfo extends React.Component {
  render() {
    let {
      auto,
      auto_id,
      customer_id
    } = this.props;

    let licenceImage = [];
    if (auto.vehicle_license_pic_front) {
      licenceImage.push({
        title: `${auto.plate_num}-驾驶证正面`,
        url: api.getAutoFileUrl(customer_id, auto_id, 'vehicle_license_pic_front')
      })
    }
    if (auto.vehicle_license_pic_back) {
      licenceImage.push({
        title: `${auto.plate_num}-驾驶证背面`,
        url: api.getAutoFileUrl(customer_id, auto_id, 'vehicle_license_pic_back')
      })
    }

    let content = [], action = [];
    if (auto == undefined) {
      content = <Row type="flex" className="info-row"><Col span="24">暂无信息,请完善</Col></Row>
    } else {
      action = <EditAutoModal customer_id={customer_id} auto_id={auto_id}/>;
      content = (
        <div className="ant-table ant-table-bordered">
          <div className="ant-table-body">
            <p
              className="margin-left-20 margin-bottom-10"
              style={{fontSize: '16px'}}
            >
              基本信息<span style={{float: "right"}}>{action}</span>
            </p>
            <table>
              <tbody className="ant-table-tbody">
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>车牌号：{auto.plate_num}</td>
                <td>车型：{auto.auto_brand_name} {auto.auto_series_name} {auto.auto_type_name}</td>
                <td>车架号：{auto.vin_num}</td>
                <td>发动机号：{auto.engine_num}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>车型指导价(元)：{auto.guide_price}</td>
                <td>
                  外观/内饰：{auto.out_color === '0' ? '不限' : auto.out_color_name}/{text.inColorName[Number(auto.in_color)]}</td>
                <td>销售地：{text.soldPlaceType[Number(auto.source)]}</td>
                <td>来源4S店：{auto.source_4s}</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td>车辆型号：{auto.auto_type_num}</td>
                <td>燃油：{text.energyType[Number(auto.energy_type)]}</td>
                <td>初登日期：{auto.register_date}</td>
                <td>
                  行驶证:
                  <ImagePreview
                    title="行驶证"
                    images={licenceImage}
                    disabled={!auto.vehicle_license_pic_front}
                  />
                </td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td colSpan="4">备注：{auto.remark}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}
