import React, {Component} from 'react';
import {Row, Col, Button, Input, Form, message, Table} from 'antd';

import FormValidator from '../../../../utils/FormValidator';
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
    this.setState({items: value});
  }

  handleAddParts(value) {
    this.setState({handleTypes: value});
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

      this.setState({btnDisabled: true});
      api.ajax({
        url: api.coupon.createCouponItem(),
        type: 'POST',
        data: {
          name: values.name,
          type: 1,
          remark: values.remark,
          items: itemsString,
          part_types: handleTypeString,
        },
      }, () => {
        message.success('保存成功');
        setTimeout(function () {
          window.location.href = '/marketing/times/list';
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
    let {items, handleTypes} = this.state;
    const {getFieldDecorator} = this.props.form;
    const columnsProject = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
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
      render: (text, record, index) => <a href="javascript:;" onClick={() => this.handleDeleteProject(index)}>删除</a>,
    }];

    const columnsParts = [{
      title: '序号',
      dataIndex: '_id',
      key: '_id',
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
      render: (text, record, index) => <a href="javascript:;" onClick={() => this.handleDeleteParts(index)}>删除</a>,
    }];

    return (
      <div>
        <Row className="head-action-bar-line mb20">
          <Col span={24}>
            <span className="pull-right">
              <Button
                type="primary"
                onClick={this.handleSubmit}
                disabled={this.state.btnDisabled}
              >
                保存
              </Button>
            </span>
          </Col>
        </Row>

        <Form >
          <Row className="mb20">
            <Col span={12}>
              <h3>计次信息</h3>
            </Col>
          </Row>
          <div className="info-line">
            <label className="label ant-form-item-required">名称</label>
            <span className="width-250">
              {getFieldDecorator('name', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input size="large" placeholder="请输入名称"/>
              )}
            </span>
          </div>

          <div className="info-line with-bottom-divider">
            <label className="label">描述</label>
            <span className="width-250">
              {getFieldDecorator('remark', {})(
                <Input size="large" placeholder="请输入描述"/>
              )}
            </span>
          </div>
        </Form>

        <Row className="mb15">
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
