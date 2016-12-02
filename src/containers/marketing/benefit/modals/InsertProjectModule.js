import React, {Component} from 'react'
import BaseModal from '../../../../components/base/BaseModal'
import {Tag, Button, Modal, Row, Col, InputNumber, Form, Input, message} from 'antd';
import HCSearchSelectBox from '../../../../components/base/HCSearchSelectBox'
import api from '../../../../middleware/api'

class InsertProjectModule extends BaseModal {
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
        status: 1,
      }
    };
    [
      'handleInputNum',
      'onSearch',
      'onSelectItem',
      'handleProjectName',
      'handleContinueProjectInfo',
      'handleProjectInfo',
    ].map(methed => this[methed] = this[methed].bind(this));
  }

  handleInputNum(value) {
    this.setState({
      inputNum: value,
    });
  };

  //添加完成
  handleProjectInfo() {
    this.hideModal();
    this.setState({
      inputNum: '',
      projectName: '',
    });
  }

  //继续添加
  handleContinueProjectInfo() {
    let {inputNum, projectName} = this.state;
    if (!inputNum || !projectName) {
      if (!projectName) {
        message.warning('请填写项目名称');
      } else {
        message.warning('请填写优惠数量');
      }
      return;
    }
    //判断是否添加重复项目
    let boolRepeat = false;
    let {insertProject} = this.props;
    insertProject.map((item, index) => {
      if (item.name == projectName) {
        message.warning('项目名称重复, 请重新选择');
        boolRepeat = true;
      }
    });
    if (boolRepeat) {
      return;
    }
    //获取序号数
    let len = this.state.projectInfo.length + 1;
    let temp = {amount: inputNum, _id: len, name: projectName};
    this.setState({
      projectInfo: this.state.projectInfo.concat(temp)
    }, () => {
      this.props.handleProject(this.state.projectInfo);
    });
  }

  handleProjectName(value) {
    this.setState({
      projectName: value,
    });
  }

  onSearch(key, successHandle, failHandle) {
    let {type, status} = this.state.condition;
    this.setState({condition: Object.assign(this.state.condition, {key: key})});
    let condition = {key, type, status};
    let url = api.searchMaintainItems(condition.key);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({data: data.res.item_list});
        successHandle(data.res.item_list);
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
    let {insertProject} = this.props;
    insertProject.map((item, index) => {
      if (item.projectName == projectName) {
        message.warning('项目名称重复, 请重新选择');
      }
    });
    if (boolRepeat) {
      return;
    }
    this.handleProjectName(projectName);
  };



  render() {
    let {
      visible,
    } = this.state;
    return (
      <div>
        <Button
          type="primary"
          style={{marginLeft: '20px', width: "80px", height: "35px"}}
          onClick={this.showModal}
        >
          添加项目
        </Button>

        <Modal
          visible={visible}
          title="添加项目"
          onCancel={this.hideModal}
          footer={[
            <Button key="btn1" size="large" style={{visibility: 'hidden'}}>站位</Button>,
            <Button
              key="btn2"
              type="ghost"
              size="large"
              onClick={this.handleProjectInfo}
              style={{position: "absolute", left: "30%"}}
            >
              完成
            </Button>,
            <Button
              key="btn3"
              type="primary"
              size="large"
              onClick={this.handleContinueProjectInfo}
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
                项目名称
              </label>

              <HCSearchSelectBox
                style={{width: 150, float: 'left'}}
                placeholder={'请输入搜索名称'}
                onSearch={this.onSearch}
                displayPattern={(item) => {return item.name;}}
                autoSearch={true}
                onSelectItem={this.onSelectItem}
              />
            </Col>
            <Col span="12">
              <Form>
                <label className="margin-right-20" style={{position: 'relative'}}>优惠数量</label>
                <InputNumber
                  min={0}
                  onChange={this.handleInputNum}
                  size="large"
                  style={{width: '140px'}}
                />
              </Form>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

InsertProjectModule = Form.create()(InsertProjectModule);
export default InsertProjectModule;