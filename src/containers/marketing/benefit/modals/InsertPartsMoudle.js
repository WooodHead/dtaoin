import React, {Component} from 'react'
import {Tag, Button, Modal, Row, Col, Input, InputNumber,message} from 'antd'
import HCSearchSelectBox from '../../../../components/base/HCSearchSelectBox'
import api from '../../../../middleware/api'
import BaseModal from '../../../../components/base/BaseModal'

export default class InsertPartsMoudle extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      inputNum: 0,
      projectName: "",
      projectInfo: [],
      condition: {
        key: '',
        type: 1,
        status: 0,
      }
    };
    [
      'handlePartsInfo',
      'handleInputNum',
      'onSelectItem',
      'onSearch',
      'handleContinuePartsInfo',
      'handleProjectName',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleInputNum(value) {
    this.setState({
      inputNum: value,
    });
  }
  //添加完成
  handlePartsInfo() {
    this.hideModal();
    this.setState({
      inputNum : '',
      projectName : '',
    });
  }

  //继续添加
  handleContinuePartsInfo() {
    let {inputNum, projectName} = this.state;
    if (!inputNum || !projectName) {
      if(!projectName) {
        message.warning('请填写项目名称');
      }else {
        message.warning('请填写优惠数量');
      }
      return;
    }
    //判断是否添加重复项目
    let boolRepeat = false;
    let {insertParts} = this.props;
    insertParts.map((item, index)=>{
      if(item.name == projectName) {
        message.warning('项目名称重复, 请重新选择');
        boolRepeat = true;
      }
    });
    if(boolRepeat) {
      return;
    }

    //获取序号数
    let len = this.state.projectInfo.length + 1;
    let temp = {amount: inputNum, _id: len, name: projectName};
    this.setState({
      projectInfo: this.state.projectInfo.concat(temp)
    }, () => {
      this.props.handleParts(this.state.projectInfo);
    });
  }

  handleProjectName(value) {
    this.setState({
      projectName : value,
    });
  }

  onSearch(key, successHandle, failHandle) {
    let {type, status} = this.state.condition;
    this.setState({condition: Object.assign(this.state.condition, {key: key})});
    let condition = {key, type, status};
    let url = api.warehouse.searchCategory(condition.key);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({data: data.res.list});
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, (error) => {
      failHandle(error);
    })
  }

  //拿到选中的item
  onSelectItem = function (selectInfo) {
    let projectName = selectInfo.name;
    //判断项目名称是否重复
    let boolRepeat = false;
    let {insertParts} = this.props;
    insertParts.map((item, index)=>{
      if(item.projectName == projectName) {
        message.warning('项目名称重复, 请重新选择');
      }
    });
    if(boolRepeat) {
      return;
    }
    this.handleProjectName(projectName);
  };

  render() {
    let {
      visible
    } = this.state;
    return (
      <div>
        <Button
          type="primary"
          onClick={this.showModal}
          style={{marginLeft: '20px', width: "80px", height: "35px", marginTop: '20px'}}
        >
          添加配件
        </Button>

        <Modal
          visible={visible}
          title="添加配件"
          onCancel={this.hideModal}
          footer={[
            <Button key="btn1" size="large" style={{visibility: 'hidden'}}>占位</Button>,
            <Button
              key="btn2"
              type="ghost"
              size="large"
              onClick={this.handlePartsInfo}
              style={{position: "absolute", left: "30%"}}
            >
              完成
            </Button>,
            <Button
              key="btn3"
              type="primary"
              size="large"
              onClick={this.handleContinuePartsInfo}
              style={{position: "absolute", right: "30%"}}
            >
              继续添加
            </Button>,
          ]}
        >
          <Row>
            <Col span="12">
              <label
                className="margin-right-20"
                style={{position: 'relative', top: "5px", float: 'left'}}
              >
                配件分类
              </label>

              <HCSearchSelectBox
                style={{width: 150, float: 'left'}}
                placeholder={'请输入搜索名称'}
                onSearch={this.onSearch}
                displayPattern={(item)=>{return item.name;}}
                autoSearch={true}
                onSelectItem={this.onSelectItem}
              />
            </Col>
            <Col span="12">
              <label className="margin-right-20" style={{position: 'relative'}}>计费数量</label>
              <InputNumber
                min={0}
                onChange={this.handleInputNum}
                size="large"
                style={{width: '140px'}}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
