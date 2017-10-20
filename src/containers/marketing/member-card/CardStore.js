import React from 'react';
import { Modal, Row, Col } from 'antd';

import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';

export default class CardStore extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      companyList: [],
    };
  }

  showModal() {
    this.setState({ visible: true });
    this.getMemberCardTypeCompanyList();
  }

  getMemberCardTypeCompanyList() {
    const url = api.coupon.getCouponCardTypeCompanyList(this.state.id, '');
    api.ajax({ url }, data => {
      const companyList = data.res.list;
      this.setState({ companyList });
    });
  }

  render() {
    const { visible, companyList } = this.state;

    const content = (
      <span>
        {
          <Row className="mb10 font-size-14">
            <Col span={8} className="font-wight-bold">
              门店名称
            </Col>
            <Col span={10} className="font-wight-bold">
              门店类型
            </Col>
          </Row>
        }
        {
          companyList.map(item => (
              <Row key={item._id} className="mb10 font-size-14">
                <Col span={8}>
                  {item.company_name}
                </Col>
                <Col span={10}>
                  {item.company_cooperation_type_name.full_name}
                </Col>
              </Row>
            ))
        }
      </span>
    );

    return (
      <span>
        <a
          href="javascript:;"
          onClick={this.showModal}
        >
          适用门店详情
        </a>

        <Modal
          visible={visible}
          title="适用门店详情"
          onCancel={this.hideModal}
          footer={null}
          width="720px"
        >
          {content}
        </Modal>
      </span>
    );
  }
}
