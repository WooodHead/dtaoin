import React from 'react';
import {Modal, Row, Col} from 'antd';

import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';

export default class CardStore extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      companyList: [],
      memberCardType: props.memberCardType,
    };
  }

  showModal() {
    this.setState({visible: true});
    this.getMemberCardTypeCompanyList();
  }

  getMemberCardTypeCompanyList() {
    let url = api.coupon.getMemberCardTypeCompanyList(this.state.memberCardType, '');
    api.ajax({url}, (data) => {
      let companyList = data.res.list;
      this.setState({companyList});
    });
  }

  render() {
    let {visible, companyList} = this.state;

    let content = (
      <span>
        {
          <Row className="mb10">
            <Col span={8} className="font-wight-bold">
              门店名称
            </Col>
            <Col span={10} className="font-wight-bold">
              门店类型
            </Col>
          </Row>
        }
        {
          companyList.map(item => {
            return (
              <Row key={item._id} className="mb10">
                <Col span={8}>
                  {item.company_name}
                </Col>
                <Col span={10}>
                  {item.company_cooperation_type_name.full_name}
                </Col>
              </Row>
            );
          })
        }
      </span>
    );

    return (
      <span>
        <a
          href="javascript:;"
          onClick={this.showModal}
        >
          发卡门店详细
        </a>

        <Modal
          visible={visible}
          title="发卡门店详细"
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
