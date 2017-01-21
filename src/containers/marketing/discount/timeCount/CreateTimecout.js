import React, {Component} from 'react';
import {Row, Col, Button, Input, Form, message, Table} from 'antd';
import InsertProjectModal from '../InsertProjectModal';
import InsertPartsModal from '../InsertPartsModal';
import api from '../../../../middleware/api';

const FormItem = Form.Item;

export default class CreateTimecout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      items: null,
      handleTypes: null,
      btnDisabled:false,
    };
    [
      'handleProject',
      'handleParts',
      'handleSubmit',
      'handleName',
      'handleDesc',
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
    let {name, desc, items, handleTypes} = this.state;
    let itemsString = JSON.stringify(items);
    let handleTypeString = JSON.stringify(handleTypes);

    if (!name || !desc) {
      message.warning('有未填写项,请填写完整后再保存');
      return;
    }
    if(!items && !handleTypes) {
      message.warning('有未填写项,请填写完整后再保存');
      return;
    }

    this.setState({
      btnDisabled: true,
    });

    api.ajax({
      url: api.coupon.createCouponItem(),
      type: 'POST',
      data: {
        name: name,
        type: 1,
        remark: desc,
        items: itemsString,
        part_types: handleTypeString,
      },
    }, () => {
      message.success('保存成功');
      setTimeout(function () {
        window.location.href = '/#/marketing/timecount';
      }, 500);
    });
  }

  handleName(value) {
    this.setState({name: value.target.value});
  }

  handleDesc(value) {
    this.setState({desc: value.target.value});
  }

  handleDeleteProject(value) {
    let currentState = this.state.items;
    currentState.splice(value, 1);
    this.handleProject(currentState);
  }

  handleDeleteParts(value) {
    let currentState = this.state.handleTypes;
    currentState.splice(value, 1);
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
      render(text, record, index) {
        return <Button type="primary" size="small" onClick={() => handleDeleteProject(index)}>删除</Button>;
      },
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
      render(text, record, index) {
        return <Button size="small" onClick={() => handleDeleteParts(index)}>删除</Button>;
      },
    }];

    return (
      <div>
        <Row className="mb15">
          <Col span={12}>
            <span style={{fontSize: '18px'}}>－计次信息</span>
          </Col>
          <Col span={12}>
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
          <FormItem label="名称" labelCol={{span: 1}} wrapperCol={{span: 5}}>
            <Input placeholder="请输入名称" onChange={this.handleName}/>
          </FormItem>
          <FormItem label="描述" labelCol={{span: 1}} wrapperCol={{span: 7}}>
            <Input placeholder="请输入描述" onChange={this.handleDesc}/>
          </FormItem>
        </Form>

        <Row className="mb15">
          <Col span={12}>
            <span style={{fontSize: '18px'}}>－优惠内容</span>
          </Col>
          <Col span={12}>
            <span className="pull-right">
              <InsertProjectModal
                insertProject={this.state.items}
                handleProject={this.handleProject}
              />
            </span>
          </Col>
        </Row>
        <Table dataSource={items} columns={columnsProject} pagination={false} bordered/>

        <Row className="mb15">
          <div className="pull-right">
            <InsertPartsModal
              insertParts={this.state.handleTypes}
              handleParts={this.handleParts}
            />
          </div>
        </Row>
        <Table dataSource={handleTypes} columns={columnsParts} pagination={false} bordered/>
      </div>
    );
  }
}
