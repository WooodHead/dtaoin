import React from 'react';
import {Row, Col} from 'antd';
import api from '../../../middleware/api';
import text from '../../../config/text';
import EditCustomerModal from '../../modals/presales/EditCustomerModal';
import ImagePreview from '../../modals/ImagePreview';

export default class CustomerInfo extends React.Component {
  render() {
    let {detail} = this.props;

    let idCardImages = [],
      driverLicenceImage = [];

    if (detail.id_card_pic_front) {
      idCardImages.push({
        title: '身份证正面',
        url: api.customer.getFileUrl(detail._id, 'id_card_pic_front'),
      });
    }
    if (detail.id_card_pic_back) {
      idCardImages.push({
        title: '身份证背面',
        url: api.customer.getFileUrl(detail._id, 'id_card_pic_back'),
      });
    }
    if (detail.driver_license_front) {
      driverLicenceImage.push({
        title: `${detail.name}-驾驶证正面`,
        url: api.customer.getFileUrl(detail._id, 'driver_license_front'),
      });
    }
    if (detail.driver_license_back) {
      driverLicenceImage.push({
        title: `${detail.name}-驾驶证背面`,
        url: api.customer.getFileUrl(detail._id, 'driver_license_back'),
      });
    }

    return (
      <div className="info-board">
        <Row type="flex" className="info-row">
          <Col span={6} className="font-size-18">{detail.name}--基本信息</Col>
          <Col span={6} offset={12}>
            <EditCustomerModal customer_id={detail._id}/>
          </Col>
        </Row>
        <Row type="flex" className="info-row">
          <Col span={6}>姓名：{detail.name}</Col>
          <Col span={6}>性别：{text.gender[Number(detail.gender)]}</Col>
          <Col span={6}>手机号：{detail.phone}</Col>
          <Col span={6}>会员等级：{detail.member_level_name}</Col>
        </Row>
        <Row type="flex" className="info-row">
          <Col span={6}>微信号：{detail.weixin}</Col>
          <Col span={6}>QQ：{detail.qq}</Col>
          <Col span={6}>邮箱：{detail.mail}</Col>

        </Row>
        <Row type="flex" className="info-row">
          <Col span={6}>常住地址：{detail.address}</Col>
          <Col span={6}>身份证地址：{detail.id_card_address}</Col>
          <Col span={6}>身份证号：{detail.id_card_num}</Col>
          <Col span={6}>身份证照片:
            <ImagePreview
              title={`${detail.name}-身份证`}
              images={idCardImages}
              disabled={!detail.id_card_pic_front}
            />
          </Col>
        </Row>
        <Row type="flex" className="info-row">
          <Col span={6}>驾驶证号：{detail.driver_license_num}</Col>
          <Col span={6}>驾驶证照片:
            <ImagePreview
              title="驾驶证"
              images={driverLicenceImage}
              disabled={!detail.id_card_pic_front}
            />
          </Col>
          <Col span={6}>创建时间：{detail.ctime}</Col>
          <Col span={6}>更新时间：{detail.mtime}</Col>
        </Row>
        {/*
        <Row type="flex" className="info-row">
          <Col span={6}>客户来源：{text.sourceDeal[detail.source_deal]} - {detail.source_name}</Col>
          <Col span={6} className={detail.invite_user_name ? '' : 'hide'}>老客户介绍人：{detail.invite_user_name}</Col>
          <Col span={6} className={detail.other_invite ? '' : 'hide'}>其它介绍人：{detail.other_invite}</Col>
        </Row>
        */}
        <Row type="flex" className="padding-l-20 padding-r-20">
          <Col span={12}>备注：{detail.remark}</Col>
        </Row>
      </div>
    );
  }
}
