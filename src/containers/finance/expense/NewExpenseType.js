import React from 'react';
import {Row, Col, Popover, Button, Icon} from 'antd';

const NewExpenseType = React.createClass({
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
    this.setState({visible});
  },

  addNewItem(){
    let newItem = this.refs.newItem.value;
    if (newItem) {
      this.props.save(newItem);
      this.hide();
    }
  },

  render() {
    const content = (
      <div>
        <Row>
          <Col span={8}>
            <label className="input-label">项目名称：</label>
          </Col>
          <Col span={16}>
            <input className="ant-input ant-input-lg" ref="newItem" placeholder="类型名称"/>
          </Col>
        </Row>

        <div className="mt15 center">
          <Button type="ghost" onClick={this.hide} className="mr15">取消</Button>
          <Button type="primary" onClick={this.addNewItem}>添加</Button>
        </div>
      </div>
    );

    return (
      <Popover
        content={content}
        title={<span><Icon type="plus"/> 添加新类型</span>}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <a href="javascript:;">新增支出类型</a>
      </Popover>
    );
  },
});

export default NewExpenseType;
