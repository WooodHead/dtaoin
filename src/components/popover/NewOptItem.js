import React from 'react'
import {Row, Col, Popover, Button, Icon, Radio} from 'antd'
import api from '../../middleware/api'

const RadioGroup = Radio.Group;

const NewOptItem = React.createClass({
  getInitialState() {
    return {
      visible: false,
      types: [],
      typeId: 0
    };
  },

  componentDidMount() {
    this.getItemTypes();
  },

  showPopover() {
    this.setState({
      visible: true
    });
  },

  hide() {
    this.setState({
      visible: false
    });
  },

  handleVisibleChange(visible) {
    this.setState({visible});
  },

  typeChange(e) {
    this.setState({typeId: e.target.value});
  },

  addNewItem(){
    let name = this.refs.newItem.value;
    let {typeId} = this.state;
    if (name) {
      this.props.save(typeId, name);
      this.hide();
    }
  },

  getItemTypes() {
    api.ajax({url: api.getMaintainItemTypes()}, function (data) {
      this.setState({types: data.res.type_list});
    }.bind(this))
  },

  render() {
    let {
      visible,
      types
    } = this.state;

    const content = (
      <div>
        <Row className="mb15">
          <Col span="6">
            <label className="input-label">项目类型：</label>
          </Col>
          <Col span="14">
            <RadioGroup onChange={this.typeChange} defaultValue={0}>
              {types.map(type => <Radio key={type._id} value={type._id}>{type.name}</Radio>)}
            </RadioGroup>
          </Col>
        </Row>

        <Row>
          <Col span="6">
            <label className="input-label">项目名称：</label>
          </Col>
          <Col span="14">
            <input className="ant-input ant-input-lg" ref="newItem" placeholder="维修项目名称"/>
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
        title={<span><Icon type="plus"/> 新增维修项目</span>}
        content={content}
        trigger="click"
        visible={visible}
        overlayStyle={{width: 340}}
        onVisibleChange={this.handleVisibleChange}>
        <a href="javascript:;" onClick={this.showPopover}>新增维修项目</a>
      </Popover>
    );
  }
});

export default NewOptItem;
