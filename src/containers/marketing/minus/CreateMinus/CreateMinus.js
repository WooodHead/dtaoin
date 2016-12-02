import React, {Component} from 'react'
import {Breadcrumb, Icon, Row, Col, Button, Select, DatePicker, Input, Form} from 'antd'
import {Link} from 'react-router'
import InsertPartsTable from './InsertPartsTable'
import InsertProjectTable from './InsertProjectTable'
import InsertProjectModule from './InsertProjectModule'
import InsertPartsModule from './InsertPartsMoudle'

const FormItem = Form.Item;

export default class CreateTimecout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/>营销/优惠管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              创建立减
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>


        <Row className="mb15">
          <Col span='12'>
            <span style={{fontSize: '18px'}}>－立减信息</span>
          </Col>
          <Col span='12'>
                         <span className="pull-right">
                            <Button type="primary"
                                    style={{marginLeft: '20px', width: "80px", height: "35px"}}>
                                保存
                            </Button>
                         </span>
          </Col>
        </Row>

        <div>
          <div>
            <Form>
              <Row>
                <Col span='24'>
                  <FormItem label="名称" labelCol={{span: 1}} wrapperCol={{span: 5}}>
                    <Input placeholder="请输入名称"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span='13'>
                  <FormItem label="减价金额" labelCol={{span: 2}} wrapperCol={{span: 5}}>
                    <Input addonAfter="元" defaultValue="1000.00"/>
                  </FormItem>
                </Col>

                <Col span='13'>
                  <FormItem label="单笔优惠上限" labelCol={{span: 2}} wrapperCol={{span: 5}}>
                    <Input addonAfter="元" defaultValue="1000.00"/>
                  </FormItem>
                </Col>
                <Col span="2">
                  <span style={{position: 'relative', top: '6px'}}>及以上金额可用</span>
                </Col>
              </Row>
              <Row>
                <Col span='24'>
                  <FormItem label="描述" labelCol={{span: 1}} wrapperCol={{span: 7}}>
                    <Input placeholder="请输入描述"/>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>


        <Row className="mb15">
          <Col span='12'>
            <span style={{fontSize: '18px'}}>－优惠内容</span>
          </Col>
          <Col span='12'>
                         <span className="pull-right">
                            <InsertProjectModule />
                         </span>
          </Col>
        </Row>

        <InsertPartsTable />
        <Row className="mb15">
          <div className="pull-right">
            <InsertPartsModule />
          </div>
        </Row>
        <InsertProjectTable />
      </div>
    )
  }
}