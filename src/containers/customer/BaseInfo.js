import React from 'react';
import { Col, Icon, Row } from 'antd';

import ImagePreview from '../../components/widget/ImagePreview';
import EditCustomerModal from './Edit';
import CouponDetail from './CouponDetail';
import CreateRemind from '../../components/widget/CreateRemind';

import text from '../../config/text';
import className from 'classnames';
import api from '../../middleware/api';

/**
 * 客户基本信息
 */
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberDetail: [],
      memberDetailList: [],
    };
  }

  componentWillReceiveProps(props) {
    const memberDetail = this.state.memberDetail;
    if (props.detail._id && (!memberDetail || memberDetail.length === 0)) {
      this.getMemberDetail(props.detail._id);
    }
  }

  getMemberDetail(customerId) {
    api.ajax({ url: api.statistics.getCustomerCouponCards(customerId, 1, 0) }, data => {
      this.setState({ memberDetail: data.res.list });
    });
  }

  getMemberDetail(customerId) {
    api.ajax({
      url: api.statistics.getCustomerCouponCards(customerId, 1, 0),
    }, data => {
      this.setState({ memberDetailList: data.res.list });
    });
  }

  render() {
    const { memberDetailList } = this.state;
    const { detail } = this.props;

    const customerNameIcon = className({
      'icon-first-name-none': !detail._id,
      'icon-first-name': true,
    });

    const customerInfoContainer = className({
      'customer-info': !!detail._id,
      hide: !detail._id,
    });

    const idCardImages = [];
    if (detail.id_card_pic_front) {
      idCardImages.push({
        title: '身份证正面',
        url: api.system.getPrivatePicUrl(detail.id_card_pic_front),
      });
    }
    if (detail.id_card_pic_back) {
      idCardImages.push({
        title: '身份证背面',
        url: api.system.getPrivatePicUrl(detail.id_card_pic_back),
      });
    }

    const driverLicenceImage = [];
    if (detail.driver_license_front) {
      driverLicenceImage.push({
        title: `${detail.name}-驾驶证正面`,
        url: api.system.getPrivatePicUrl(detail.driver_license_front),
      });
    }
    if (detail.driver_license_back) {
      driverLicenceImage.push({
        title: `${detail.name}-驾驶证背面`,
        url: api.system.getPrivatePicUrl(detail.driver_license_back),
      });
    }

    return (
      <div>
        <div className="base-info-noline mb20 with-bottom-divider">
          <div className="customer-container">
            <div className={customerNameIcon}>
              {detail.name ? detail.name.substr(0, 1) :
                <Icon type="user" style={{ color: '#fff' }} />}
            </div>

            <div className={customerInfoContainer}>
              <div>
                <span className="customer-name">{detail.name}</span>
                <span className="ml6">{text.gender[Number(detail.gender)]}</span>
              </div>
              <div>
                <span>{detail.phone}</span>
                <CouponDetail detail={detail} couponDetail={memberDetailList} />
              </div>
            </div>
          </div>

          <div className="pull-right">
            <span className="mr10">
              <CreateRemind customer_id={detail._id} />
            </span>
            <EditCustomerModal customer_id={detail._id} />
          </div>
        </div>

        <Row className="mt20">
          <Col span={6}><span className="text-gray label">微信号</span>{detail.weixin}</Col>
          <Col span={6}><span className="text-gray label">QQ</span>{detail.qq}</Col>
          <Col span={6}><span className="text-gray label">邮箱</span>{detail.mail}</Col>
          <Col span={6}><span className="text-gray label">常住地址</span>{detail.address}</Col>
        </Row>

        <Row className="mt20">
          <Col span={6}><span className="text-gray label">身份证号</span>
            {detail.id_card_num}

            <ImagePreview
              title={`${detail.name}-身份证`}
              images={idCardImages}
              disabled={!detail.id_card_pic_front}
            />
          </Col>
          <Col span={6}><span className="text-gray label">身份证地址</span>{detail.id_card_address}</Col>
          <Col span={6}><span className="text-gray label">驾驶证号</span>
            {detail.driver_license_num}
            <ImagePreview
              title="驾驶证"
              images={driverLicenceImage}
              disabled={!detail.driver_license_front}
            />
          </Col>
          <Col span={6}>
            <span className="text-gray label">生日</span>
            {detail.birth_date && (detail.birth_date.indexOf('0000') > -1 ? '' : detail.birth_date)}
          </Col>
        </Row>

        <Row className="mt20">
          <Col span={6}><span className="text-gray label">创建时间</span>{detail.ctime}</Col>
          <Col span={18}><span className="text-gray label">备注</span>{detail.remark}</Col>
        </Row>
      </div>
    );
  }
}
