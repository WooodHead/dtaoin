import React, {Component} from 'react'
import BaseModal from '../../../../components/base/BaseModal'
import {Tag, Button, Modal, Row, Col, Form, Input} from 'antd';
import SearchBox from '../SearchBox'
import api from '../../../../middleware/api'

const FormItem = Form.Item;
export default class InsertProjectModule extends BaseModal {
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
                style={{marginLeft: '20px', width: "80px", height: "35px"}}
                onClick={this.showModal}>
          添加项目
        </Button>

        <Modal
          visible={visible}
          title="添加项目"
          onCancel={this.hideModal}
          footer={[
            <Button key="btn1" size="large" style={{visibility: 'hidden'}}>站位</Button>,
            <Button key="btn2" type="ghost" size="large" style={{position: "absolute", left: "30%"}}>完成</Button>,
            <Button key="btn3" type="primary" size="large" style={{position: "absolute", right: "30%"}}>
              继续添加
            </Button>,
          ]}
        >
          <Row className="margin-top-20">
            <Col span="12">
              <label className="margin-right-20" style={{position: 'relative', top: '8px'}}>项目名称</label>
              <SearchBox
                api={api.searchAutoPotentialCustomerList()}
                change={this.handleSearchChange}
                style={{width: 150}}
              />
            </Col>
            <Col span="3">
              <label style={{position: 'relative', top: '8px'}}>减价金额</label>
            </Col>
            <Col span="8">
              <FormItem wrapperCol={{span: 22, offset: 1}}>
                <Input addonAfter={"元"} placeholder="40"/>
              </FormItem>
            </Col>
          </Row>

        </Modal>
      </div>
    )
  }
}
