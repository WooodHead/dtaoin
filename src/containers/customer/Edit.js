import React from 'react';
import { Button, Checkbox, Icon, Modal, Popover } from 'antd';

import classNames from 'classnames';

import BaseModal from '../../components/base/BaseModal';

import EditForm from './EditForm';

export default class EditCustomerModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isShowGuideView: false,
      rectInfo: {},
    };

    this.onNoLongerRemindChange = this.onNoLongerRemindChange.bind(this);
    this.onIKnowClick = this.onIKnowClick.bind(this);
    this.onReceiveRectInfo = this.onReceiveRectInfo.bind(this);
  }

  showModal() {
    if (localStorage.getItem('no_remind_edit_customer') === 'true') {
      this.setState({ visible: true });
    } else {
      this.setState({
        visible: true,
        isShowGuideView: true,
      });
    }
  }

  onReceiveRectInfo(rectInfo) {
    this.setState({ rectInfo });
  }

  onNoLongerRemindChange(e) {
    localStorage.setItem('no_remind_edit_customer', e.target.checked);
  }

  onIKnowClick() {
    this.setState({ isShowGuideView: false });
  }

  render() {
    const { size } = this.props;
    const { isShowGuideView, rectInfo } = this.state;

    const guideView = classNames({
      'modal-guide-mask': isShowGuideView,
      hide: !isShowGuideView,
    });

    const contentTip = (
      <div>
        <p>新增补全生日信息,录入后</p>
        <p>系统可自动发送生日祝福~</p>

        <div style={{ marginTop: 5, marginBottom: 5 }}>
          <Checkbox onChange={this.onNoLongerRemindChange}>
            <span style={{ fontSize: 12 }}>不再提醒</span>
          </Checkbox>

          <Button
            type={'primary'}
            size={'small'}
            className="shuidao-btn-tiny"
            onClick={this.onIKnowClick}
          >
            <span style={{ fontSize: 12 }}>我知道了</span>
          </Button>
        </div>
      </div>
    );

    return (
      <span>
        {size === 'small'
          ? <a href="javascript:;" onClick={this.showModal}>编辑</a>
          : <Button type="primary" onClick={this.showModal}>编辑</Button>
        }

        <Modal
          title={<span><Icon type="edit" /> 编辑客户信息</span>}
          visible={this.state.visible}
          width={720}
          className="ant-modal-full"
          onCancel={this.hideModal}
          footer={null}
        >
          <EditForm
            customer_id={this.props.customer_id}
            onSuccess={this.hideModal}
            syncElementRect={this.onReceiveRectInfo}
          />
        </Modal>

        {/* 代码版新手引导：需要制定Popover中div视窗大小刚好为所要聚焦的元素大小*/}
        <div className={guideView}>
          <Popover
            title=""
            content={contentTip}
            visible={isShowGuideView}
            overlayClassName="white"
          >
            <div style={{
              width: rectInfo.width,
              height: rectInfo.height,
              background: 'transparent',
              border: 0,
              marginTop: rectInfo.top,
              marginLeft: rectInfo.left,
              borderRadius: 4,
              boxShadow: '0 0 0 9999px rgba(0,0,0,.5), 0 0 15px rgba(0,0,0,.5)',
            }} />
          </Popover>
        </div>
      </span>
    );
  }
}
