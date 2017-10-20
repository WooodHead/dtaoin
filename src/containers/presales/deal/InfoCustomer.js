import React from 'react';
import { Row, Col, Icon } from 'antd';

import EditCustomerModal from '../../../containers/customer/Edit';

import ImagePreview from '../../../components/widget/ImagePreview';

import text from '../../../config/text';
import className from 'classnames';
import api from '../../../middleware/api';

export default class CustomerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: {},
    };
    [
      'handleCustomerChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { customerId } = this.props;
    this.getCustomerInfo(customerId);
  }

  handleCustomerChange() {
    const { customerId } = this.props;
    this.getCustomerInfo(customerId);
  }

  getCustomerInfo(customerId) {
    api.ajax({ url: api.customer.detail(customerId) }, data => {
      this.setState({ customerInfo: data.res.customer_info });
    });
  }

  render() {
    const { customerInfo } = this.state;

    const customerNameIcon = className({
      'icon-first-name-none': !customerInfo._id,
      'icon-first-name': true,
    });

    const customerInfoContainer = className({
      'customer-info': !!customerInfo._id,
      hide: !customerInfo._id,
    });

    let idCardImages = [],
      driverLicenceImage = [];

    if (customerInfo.id_card_pic_front) {
      idCardImages.push({
        title: '身份证正面',
        url: api.system.getPrivatePicUrl(customerInfo.id_card_pic_front),
      });
    }
    if (customerInfo.id_card_pic_back) {
      idCardImages.push({
        title: '身份证背面',
        url: api.system.getPrivatePicUrl(customerInfo.id_card_pic_back),
      });
    }
    if (customerInfo.driver_license_front) {
      driverLicenceImage.push({
        title: `${customerInfo.name}-驾驶证正面`,
        url: api.system.getPrivatePicUrl(customerInfo.driver_license_front),
      });
    }
    if (customerInfo.driver_license_back) {
      driverLicenceImage.push({
        title: `${customerInfo.name}-驾驶证背面`,
        url: api.system.getPrivatePicUrl(customerInfo.driver_license_back),
      });
    }

    return (
      <div>
        <Row>
          <Col span={12}>
            <div className="base-info-noline with-bottom-divider mt20">
              <div className="customer-container">
                <div className={customerNameIcon}>
                  {(customerInfo.customer_name || customerInfo.name) ? (customerInfo.customer_name || customerInfo.name).substr(0, 1) :
                    <Icon type="user" style={{ color: '#fff' }}/>}
                </div>
                <div className={customerInfoContainer}>
                  <div>
                    <span className="customer-name">{customerInfo.customer_name || customerInfo.name}</span>
                    <span
                      className="ml6">{text.gender[String(customerInfo.customer_gender || customerInfo.gender)]}
                    </span>
                  </div>
                  <div>
                    <span>{customerInfo.customer_phone || customerInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="pull-right mt20">
              <EditCustomerModal
                customer_id={customerInfo._id}
                onSuccess={this.handleCustomerChange}
              />
            </div>
          </Col>
        </Row>

        <Row className="mt20">
          <Col span={6}><span className="label text-gray">微信号</span>{customerInfo.weixin}</Col>
          <Col span={6}><span className="label text-gray">邮箱</span>{customerInfo.mail}</Col>
          <Col span={6}><span className="label text-gray">常住地址</span>{customerInfo.address}</Col>
          <Col span={6}>
            <span className="label text-gray">身份证号</span>
            {customerInfo.id_card_num}
            <ImagePreview
              title={`${customerInfo.name}-身份证`}
              images={idCardImages}
              disabled={!customerInfo.id_card_pic_front}
            />
          </Col>
        </Row>

        <Row className="mt20 with-bottom-divider">
          <Col span={6}><span className="label text-gray">身份证地址</span>{customerInfo.id_card_address}</Col>
          <Col span={6}>
            <span className="label text-gray">驾驶证号</span>
            <ImagePreview
              title="驾驶证"
              images={driverLicenceImage}
              disabled={!customerInfo.driver_license_front}
            />
          </Col>
          <Col span={6}><span className="label text-gray">备注</span>{customerInfo.remark}</Col>
        </Row>
      </div>
    );
  }
}
