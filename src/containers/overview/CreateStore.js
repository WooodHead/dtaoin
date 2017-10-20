import React from 'react';
import { Tabs, Button, Modal, Icon } from 'antd';

import api from '../../middleware/api';

import BaseModal from '../../components/base/BaseModal';

import InfoBasic from './InfoBasic';
import InfoBank from './InfoBank';
import InfoApp from './InfoApp';
import InfoPos from './InfoPos';
import InfoPersonInCharge from './InfoPersonInCharge';
import InfoProfit from './InfoProfit';

const TabPane = Tabs.TabPane;

export default class CreateStore extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo: props.companyInfo,
    };

    [
      'getCompanyDetail',
    ].map(method => this[method] = this[method].bind(this));
  }

  getCompanyDetail(companyId) {
    api.ajax({ url: api.overview.getCompanyDetail(companyId) }, data => {
      this.setState({ companyInfo: data.res.company });
    });
    if (this.props.onSuccess) {
      this.props.onSuccess();
    }
  }

  getCompanyDetailPure(companyId) {
    api.ajax({ url: api.overview.getCompanyDetail(companyId) }, data => {
      this.setState({ companyInfo: data.res.company });
    });
  }

  showModal(action) {
    this.setState({ visible: true });
    if (action == 'edit') {
      const companyId = this.state.companyInfo._id;
      this.getCompanyDetailPure(companyId);
    }
  }

  render() {
    const { size } = this.props;
    const { companyInfo } = this.state;

    const tabPanes = [
      <TabPane tab={'基础信息'} key={'1'}>
        <InfoBasic companyInfo={companyInfo} onSuccess={this.getCompanyDetail}/>
      </TabPane>,

      <TabPane disabled={!companyInfo} tab={'银行信息设置'} key={'2'}>
        <InfoBank companyInfo={companyInfo} onSuccess={this.getCompanyDetail}/>
      </TabPane>,

      <TabPane disabled={!companyInfo} tab={'客户端设置'} key={'3'}>
        <InfoApp companyInfo={companyInfo} onSuccess={this.getCompanyDetail}/>
      </TabPane>,

      <TabPane disabled={!companyInfo} tab={'POS机设置'} key={'4'}>
        <InfoPos companyInfo={companyInfo} onSuccess={this.getCompanyDetail}/>
      </TabPane>,

      <TabPane disabled={!companyInfo} tab={'对接人设置'} key={'5'}>
        <InfoPersonInCharge companyInfo={companyInfo} onSuccess={this.getCompanyDetail}/>
      </TabPane>,

      <TabPane disabled={!companyInfo} tab={'毛利率设置'} key={'6'}>
        <InfoProfit companyInfo={companyInfo} onSuccess={this.getCompanyDetail}/>
      </TabPane>,
    ];

    return (
      <span>
        {
          size == 'small' ?
            <a href="javascript:;" onClick={() => this.showModal('edit')}>编辑</a> :
            <Button onClick={() => this.showModal('create')}>创建门店</Button>
        }
        <Modal
          title={<span><Icon type="plus"/>{!!companyInfo ? '编辑' : '创建'}门店</span>}
          visible={this.state.visible}
          width="960px"
          onCancel={this.hideModal}
          footer={null}
        >
          <Tabs type="card" defaultActiveKey="1">{tabPanes}</Tabs>
        </Modal>
      </span>

    );
  }
}
