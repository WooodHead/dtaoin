import React from 'react';
import { Row, Col, Popover, Button, Icon } from 'antd';
import createReactClass from 'create-react-class';

const NewAgent = createReactClass({
  getInitialState() {
    return {
      visible: false,
    };
  },

  hide() {
    this.setState({
      visible: false,
    });
  },

  handleVisibleChange(visible) {
    this.setState({ visible });
  },

  addAgent() {
    const name = this.refs.name.value;
    const phone = this.refs.phone.value;
    if (name) {
      this.props.addAgent(name, phone);
      this.hide();
    }
  },

  render() {
    const content = (
      <div>
        <Row>
          <Col span={8}>
            <label className="input-label">代理名称：</label>
          </Col>
          <Col span={16}>
            <input className="ant-input ant-input-lg" ref="name" placeholder="请输入" />
          </Col>
        </Row>

        <Row className="mt10">
          <Col span={8}>
            <label className="input-label">联系电话：</label>
          </Col>
          <Col span={16}>
            <input className="ant-input ant-input-lg" ref="phone" placeholder="请输入" />
          </Col>
        </Row>

        <div className="mt15 center">
          <Button type="ghost" onClick={this.hide} className="mr15">取消</Button>
          <Button type="primary" onClick={this.addAgent}>确定</Button>
        </div>
      </div>
    );

    return (
      <Popover
        content={content}
        title={<span><Icon type="plus" /> 创建代理</span>}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        overlayClassName="white"
      >
        <a href="javascript:" className="font-size-14" style={{ lineHeight: '28px' }}>创建</a>
      </Popover>
    );
  },
});

export default NewAgent;
