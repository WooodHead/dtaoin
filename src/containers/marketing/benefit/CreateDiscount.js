import React, {Component} from 'react'
import {Breadcrumb, Icon, Row, Col, Button, Select, DatePicker, Input, Form, message} from 'antd'
import InsertTable from './tables/InsertTable'
import InsertProjectModule from './modals/InsertProjectModule'
import InsertPartsModule from './modals/InsertPartsMoudle'
import api from '../../../middleware/api'


const FormItem = Form.Item;


export default class CreateTimecout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      discount_rate: '',
      discount_amount: '',
      items: [],
      handleTypes: [],
    };
    [
      'handleProject',
      'handleParts',
      'handleSubmit',
      'handleName',
      'handleDesc',
      'handleDiscountAmount',
      'handleDiscountRate',
      'handleDeleteProject',
      'handleDeleteParts',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleProject(value) {
    this.setState({
      items: value,
    });
  }

  handleParts(value) {
    this.setState({
      handleTypes: value,
    });
  }

  handleSubmit() {
    let {name, desc, discount_rate, items, handleTypes, discount_amount} = this.state;
    let items_str = JSON.stringify(items);
    let handle_types_str = JSON.stringify(handleTypes);

    if (!name || !desc || !discount_rate || !items || !handleTypes || !discount_amount) {
      message.warning("有未填项,请填写完整后再保存");
      return;
    }

    api.ajax({
      url: api.coupon.createCouponItem(),
      type: 'POST',
      data: {
        name: name,
        type: 2,
        remark: desc,
        discount_rate: discount_rate,
        discount_amount: discount_amount,
        items: items_str,
        part_types: handle_types_str,
      }
    }, (data) => {
      if(data.code !== 0) {
        message.success('保存成功');
        setTimeout(function () {
          window.location.href = "/#/marketing/timecount";
        }, 1000);
      }
    })
  }

  handleName(value) {
    this.setState({name: value.target.value});
  }

  handleDiscountRate(value) {
    this.setState({discount_rate: value.target.value});
  }

  //处理单笔优惠上线
  handleDiscountAmount(value) {
    this.setState({discount_amount: value.target.value});
  }

  handleDesc(value) {
    this.setState({desc: value.target.value});
  }

  handleDeleteProject(value) {
    let currentState = this.state.items;
    currentState.splice(value, 1);
    //删除一条优惠　序号变化
    currentState.map((item, index)=>{item._id = index + 1});
    this.handleProject(currentState);
  }

  handleDeleteParts(value) {
    let currentState = this.state.handleTypes;
    currentState.splice(value, 1);
    //删除一条优惠　序号变化
    currentState.map((item, index)=>{item._id = index + 1});
    this.handleParts(currentState);
  }

  render() {
    let handleDeleteProject = this.handleDeleteProject;
    let handleDeleteParts = this.handleDeleteParts;
    let {items, handleTypes} = this.state;
    const columnsProject = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '优惠数量',
      dataIndex: 'amount',
      key: 'amount',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render(text, record, index) {
        return (
          <div>
            <Button type="dashed" size="small" onClick={() => handleDeleteProject(index)}>删除</Button>
          </div>
        )
      }
    }];

    const columnsParts = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '配件',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '计费数量',
      dataIndex: 'amount',
      key: 'amount',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render(text, record, index) {
        return (
          <div>
            <Button type="dashed" size="small" onClick={()=>handleDeleteParts(index)}>删除</Button>
          </div>
        )
      }
    }];

    return (
      <div>
        <div className="mb10">
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="javascript:history.back();"><Icon type="left"/>营销/优惠管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              创建折扣
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Row className="mb15">
          <Col span='12'>
            <span style={{fontSize: '18px'}}>－折扣信息</span>
          </Col>
          <Col span='12'>
            <span className="pull-right">
              <Button type="primary" onClick={this.handleSubmit}
                      style={{marginLeft: '20px', width: "80px", height: "35px"}}>
                保存
              </Button>
            </span>
          </Col>
        </Row>

        <Form>
          <Row>
            <Col span='24'>
              <FormItem label="名称" labelCol={{span: 1}} wrapperCol={{span: 5}}>
                <Input placeholder="请输入名称" onChange={this.handleName}/>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="5">
              {/*折扣比例没写*/}
              <FormItem label="折扣比例" labelCol={{span: 4, offset: 1}} wrapperCol={{span: 18}}>
                <Input defaultValue="0.8" onChange={this.handleDiscountRate}/>
              </FormItem>
            </Col>

            <Col span="2">
              <span style={{position: 'relative', top: '6px'}}>(原价为1，0.8即为八折)</span>
            </Col>

            <Col span='13'>
              <FormItem label="单笔优惠上限" labelCol={{span: 2}} wrapperCol={{span: 5}}>
                <Input addonAfter="元" defaultValue="1000.00" onChange={this.handleDiscountAmount}/>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span='24'>
              <FormItem label="描述" labelCol={{span: 1}} wrapperCol={{span: 7}}>
                <Input placeholder="请输入描述" onChange={this.handleDesc}/>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Row className="mb15">
          <Col span='12'>
            <span style={{fontSize: '18px'}}>－优惠内容</span>
          </Col>
          <Col span='12'>
            <span className="pull-right">
              <InsertProjectModule
                insertProject={this.state.items}
                handleProject={this.handleProject}
              />
            </span>
          </Col>
        </Row>

        <InsertTable
          insertInfo={items}
          handleProject={this.handleProject}
          columns={columnsProject}
        />
        <Row className="mb15">
          <div className="pull-right">
            <InsertPartsModule
              insertParts={this.state.handleTypes}
              handleParts={this.handleParts}
            />
          </div>
        </Row>
        <InsertTable
          insertInfo={handleTypes}
          handleParts={this.handleParts}
          columns={columnsParts}
        />
      </div>
    )
  }
}