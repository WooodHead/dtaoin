import React from 'react';
import { Row, Col } from 'antd';
import api from '../../middleware/api';
import text from '../../config/text';
import ImagePreview from '../../components/widget/ImagePreview';

export default class BaseAutoInfo extends React.Component {
  render() {
    const { auto } = this.props;

    const licenceImage = [];
    if (auto.vehicle_license_pic_front) {
      licenceImage.push({
        title: `${auto.plate_num}-驾驶证正面`,
        url: api.system.getPrivatePicUrl(auto.vehicle_license_pic_front),
      });
    }
    if (auto.vehicle_license_pic_back) {
      licenceImage.push({
        title: `${auto.plate_num}-驾驶证背面`,
        url: api.system.getPrivatePicUrl(auto.vehicle_license_pic_back),
      });
    }

    let content = [];
    if (auto == undefined) {
      content = <Row type="flex" className="info-row"><Col span={24}>暂无信息,请完善</Col></Row>;
    } else {
      content = (
        <div>
          <Row className="mt20">
            <Col span={6}><span className="text-gray label">品牌</span>{auto.auto_brand_name}</Col>
            <Col span={6}><span className="text-gray label">车系</span>{auto.auto_series_name}</Col>
            <Col span={6}><span className="text-gray label">车型</span>{auto.auto_type_name}</Col>
            <Col span={6}><span className="text-gray label">来源4S店</span>{auto.source_4s}</Col>
          </Row>

          <Row className="mt20">
            <Col span={6}><span
              className="text-gray label">外观颜色</span>{auto.out_color === '0' ? '不限' : auto.out_color_name}</Col>
            <Col span={6}><span className="text-gray label">内饰颜色</span>{text.inColorName[Number(auto.in_color)]}</Col>
            <Col span={6}><span className="text-gray label">车架号</span>{auto.vin_num}</Col>
            <Col span={6}><span className="text-gray label">发动机号</span>{auto.engine_num}</Col>
          </Row>

          <Row className="mt20">
            <Col span={6}><span className="text-gray label">初登日期</span>{auto.register_date}</Col>
            <Col span={6}><span className="text-gray label">行驶证照片</span>
              <ImagePreview
                title="行驶证"
                images={licenceImage}
                disabled={!auto.vehicle_license_pic_front}
              />
            </Col>
            <Col span={12}><span className="text-gray label">备注</span>{auto.remark}</Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}
