import React from 'react'
import {Modal, Icon, Button, Form, Input, Row, Col, message} from 'antd'
import BaseModal from '../../base/BaseModal'
import QRCode from 'qrcode.react'

const FormItem = Form.Item;

class AppDownloadModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
  }

  render() {
    const {visible}=this.state;
    let timestamp = new Date().getTime();

    return (
      <span>
        <div onClick={this.showModal} style={{display: 'inline'}}>
          下载员工版
        </div>
        <Modal title={<span><Icon type="plus" className="margin-right-10"/>水稻汽车-员工版下载</span>}
               visible={visible}
               width="680px"
               footer={null}
               onCancel={this.hideModal}>

            <Row>
              <Col span="24" className="center" style={{marginTop: '30px'}}>
                <span className="canvas no-print">
                  <QRCode value={location.origin + '/#/app/download?t='+timestamp}
                          size={128} ref="qrCode"/></span>
                <img src='' className="print-image" ref="printImg"/>
              </Col>
            </Row>
            <Row>
              <Col span="24" className="center">
                  <span>水稻汽车-员工版</span>
              </Col>
              <Col span="24" className="center">
                  <span>用微信扫描以上二维码，在浏览器中打开下载</span>
              </Col>
            </Row>
        </Modal>
      </span>
    );
  }
}

AppDownloadModal = Form.create()(AppDownloadModal);
export default AppDownloadModal
