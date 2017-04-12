import React, {Component} from 'react';
import {Row, Col, Button, Input, Form, message, Table} from 'antd';

import FormValidator from '../../../../utils/FormValidator';
// import Layout from '../../../../utils/FormLayout';
import api from '../../../../middleware/api';

import AddProject from '../AddProject';
import AddParts from '../AddParts';

// const FormItem = Form.Item;

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      handleTypes: null,
      btnDisabled: false,
    };

    [
      'handleAddProject',
      'handleAddParts',
      'handleSubmit',
      'handleDeleteProject',
      'handleDeleteParts',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleAddProject(value) {
    this.setState({
      items: value,
    });
  }

  handleAddParts(value) {
    this.setState({
      handleTypes: value,
    });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('请填写完整信息');
        return;
      }

      let {items, handleTypes} = this.state;
      let itemsString = JSON.stringify(items);
      let handleTypeString = JSON.stringify(handleTypes);

      this.setState({
        btnDisabled: true,
      });

      api.ajax({
        url: api.coupon.createCouponItem(),
        type: 'POST',
        data: {
          name: values.name,
          type: 2,
          remark: values.remark,
          discount_rate: values.rate,
          max_discount_amount: values.upper,
          items: itemsString,
          part_types: handleTypeString,
        },
      }, () => {
        message.success('保存成功');
        setTimeout(function () {
          window.location.href = '/marketing/discount/list';
        }, 500);
      });

    });
  }

  handleDeleteProject(value) {
    let currentState = this.state.items;
    currentState.splice(value, 1);
    this.handleAddProject(currentState);
  }

  handleDeleteParts(value) {
    let currentState = this.state.handleTypes;
    currentState.splice(value, 1);
    this.handleAddParts(currentState);
  }

  render() {
    let self = this;
    let {items, handleTypes} = this.state;
    const {getFieldDecorator} = this.props.form;
    // const {formItemFour} = Layout;

    const columnsProject = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
      width: '5%',
      render(value, record, index) {
        return index + 1;
      },
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
      width: '5%',
      render: (text, record, index) => <a href="javascript:;" onClick={() => self.handleDeleteProject(index)}>删除</a>,
    }];

    const columnsParts = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
      width: '5%',
      render(value, record, index) {
        return index + 1;
      },
    }, {
      title: '配件',
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
      width: '5%',
      render: (text, record, index) => <a href="javascript:;" onClick={() => self.handleDeleteParts(index)}>删除</a>,
    }];

    return (
      <div>
        <Row className="head-action-bar-line">
          <Col span={24}>
            <span className="pull-right">
              <Button
                type="primary"
                onClick={this.handleSubmit}
                style={{marginLeft: '20px'}}
                disabled={this.state.btnDisabled}
              >
                保存
              </Button>
            </span>
          </Col>
        </Row>
        <Form>
          <Row className="mt20 mb20">
            <Col span={12}>
              <h3>折扣信息</h3>
            </Col>
          </Row>

          <div className="info-line">
            <lable className="label ant-form-item-required" style={{width: '58px'}}>名称</lable>
            <span className="width-250">
              {getFieldDecorator('name', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input size="large" placeholder="请输入名称"/>
              )}
              </span>
          </div>

          <div className="info-line mr20" style={{float: 'left'}}>
            <lable className="label ant-form-item-required">折扣比</lable>
            <span className="width-250">
              {getFieldDecorator('rate', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input size="large" placeholder="原价为1，0.8即为八折"/>
              )}
            </span>
          </div>

          <div className="info-line">
            <lable className="label ant-form-item-required">单笔优惠上限</lable>
            <span className="width-150">
              {getFieldDecorator('upper', {})(
                <Input size="large" addonAfter="元"/>
              )}
            </span>
          </div>

          <div className="info-line with-bottom-divider">
            <lable className="label" style={{width: '58px'}}>描述</lable>
            <div className="width-250">
              {getFieldDecorator('remark', {})(
                <Input size="large" placeholder="请输入描述"/>
              )}
            </div>
          </div>
        </Form>

        <Row className="mb20">
          <Col span={12}>
            <h3>优惠内容</h3>
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <AddProject
                insertProject={this.state.items}
                handleProject={this.handleAddProject}
              />
            </span>
          </Col>
        </Row>
        <Table dataSource={items} columns={columnsProject} pagination={false} bordered/>

        <Row className="mb15">
          <div className="pull-right">
            <AddParts
              insertParts={this.state.handleTypes}
              handleParts={this.handleAddParts}
            />
          </div>
        </Row>
        <Table dataSource={handleTypes} columns={columnsParts} pagination={false} bordered/>
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
