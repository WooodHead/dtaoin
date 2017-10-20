import React from 'react';
import { Row, Popover, Button, Icon } from 'antd';

export default class NewAgent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    [
      'handleVisibleChange',
      'addInsuranceCompany',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleVisibleChange(visible) {
    this.setState({ visible });
  }

  addInsuranceCompany() {
    const name = this.refs.name.value;
    if (!!name) {
      this.props.addInsuranceCompany(name);
      this.hide();
    }
  }

  hide() {
    this.setState({ visible: false });
  }

  render() {
    const content = (
      <div>
        <Row>
          <input className="ant-input ant-input-lg" ref="name" placeholder="请输入" />
        </Row>

        <div className="mt15 center">
          <Button type="ghost" onClick={this.hide} className="mr15">取消</Button>
          <Button type="primary" onClick={this.addInsuranceCompany}>确定</Button>
        </div>
      </div>
    );

    return (
      <Popover
        content={content}
        title={<span><Icon type="plus" /> 新增保险公司</span>}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        overlayClassName="white"
        placement="topLeft"
      >
        <a href="javascript:" className="font-size-14 ml10">新增</a>
      </Popover>
    );
  }
}

