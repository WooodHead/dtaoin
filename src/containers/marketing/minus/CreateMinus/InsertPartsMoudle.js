import React, {Component} from 'react'
import {Tag, Button, Modal, Row, Col, Input, InputNumber, Form} from 'antd'
import SearchBox from '../SearchBox'
import api from '../../../../middleware/api'
import BaseModal from '../../../../components/base/BaseModal'
const FormItem = Form.Item;

export default class InsertPartsMoudle extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }


  render() {
    let {
      visible
    } = this.state;
    return (
      <div>
        <Button type="primary"
                onClick={this.showModal}
                style={{marginLeft: '20px', width: "80px", height: "35px", marginTop: '20px'}}>
          添加配件
        </Button>

        <Modal
          visible={visible}
          title="添加配件"
          onCancel={this.hideModal}
          footer={[
            <Button key="btn1" size="large" style={{visibility: 'hidden'}}>站位</Button>,
            <Button key="btn2" type="ghost" size="large" style={{position: "absolute", left: "30%"}}>完成</Button>,
            <Button key="btn3" type="primary" size="large" style={{position: "absolute", right: "30%"}}>
              继续添加
            </Button>,
          ]}
        >
          <Row>
            <Col span="12">
              <label className="margin-right-20" style={{position: 'relative', top: "5px"}}>配件分类</label>
              <SearchBox
                api={api.searchAutoPotentialCustomerList()}
                change={this.handleSearchChange}
                style={{width: 150}}
              />
            </Col>
            <Col span="12">
              <label className="margin-right-20" style={{position: 'relative'}}>计费数量</label>
              <InputNumber size="large" style={{width: '140px'}}/>

            </Col>
          </Row>
          <Row className="margin-top-20">
            <Col span="3">
              <label style={{position: 'relative', top : '8px'}}>减价金额</label>
            </Col>
            <Col span="8">
              <FormItem wrapperCol={{span: 22, offset : 1}}>
                <Input addonAfter={"元"} placeholder="40"/>
              </FormItem>
            </Col>
            <Col span="4">
              <label className="margin-right-20" style={{position: 'relative', left : '20px', top : '8px'}}>减价总额</label>
            </Col>
            <Col span="8">
              <FormItem wrapperCol={{span: 21, offset : 1}}>
                <Input addonAfter={"元"} placeholder="40"/>
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
