import React from 'react';
import {Button, Modal, Row, Col, InputNumber, Form, message} from 'antd';

import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';

class AddProject extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataEmpty: false,
      inputNum: '',
      id: 0,
      projectName: '',
      projectInfo: [],
      key: '',
      type: 1,
      status: 1,
    };
    [
      'handleInputNum',
      'handleSearch',
      'handleSelectItem',
      'handleProjectName',
      'handleContinueProjectInfo',
      'handleProjectInfo',
    ].map(methed => this[methed] = this[methed].bind(this));
  }

  showModal() {
    this.setState({visible: true, dataEmpty: true});
  }

  hideModal() {
    this.setState({visible: false, dataEmpty: false, inputNum: ''});
  }

  handleInputNum(value) {
    this.setState({inputNum: value});
  }

  //添加完成
  handleProjectInfo() {
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
    if (!!insertProject) {
      insertProject.map((item) => {
        if (item.name == projectName) {
          message.warning('项目名称重复, 请重新选择');
          boolRepeat = true;
        }
      });
    }
    if (boolRepeat) {
      return;
    }
    //获取序号数
    let temp = {amount: inputNum, _id: this.state.id, name: projectName};
    this.setState({
      projectInfo: this.state.projectInfo.concat(temp),
    }, () => {
      this.props.handleProject(this.state.projectInfo);
    });
    this.hideModal();
    this.setState({
      inputNum: '',
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

    if (!!insertProject) {
      insertProject.map((item) => {
        if (item.name == projectName) {
          message.warning('项目名称重复, 请重新选择');
          boolRepeat = true;
        }
      });
    }
    if (boolRepeat) {
      return;
    }
    //获取序号数
    let temp = {amount: inputNum, _id: this.state.id, name: projectName};
    this.setState({
      projectInfo: this.state.projectInfo.concat(temp),
    }, () => {
      this.props.handleProject(this.state.projectInfo);
    });

    //这块是为了继续添加时候清除搜索框数据
    this.setState({inputNum: '', dataEmpty: false}, () => {
      this.setState({dataEmpty: true});
    });
  }

  handleProjectName(projectName, id) {
    this.setState({projectName: projectName, id: id});
  }

  handleSearch(key, successHandle, failHandle) {
    let {type, status} = this.state;
    this.setState({key: key});
    let condition = {key, type, status};
    let url = api.aftersales.searchMaintainItems(condition.key);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({data: data.res.item_list});
        successHandle(data.res.item_list);
      } else {
        failHandle(data.msg);
      }
    }, () => {

    });
  }

  //拿到选中的item
  handleSelectItem = function (selectInfo) {
    let projectName = selectInfo.name;
    let id = selectInfo._id;
    //判断项目名称是否重复
    let boolRepeat = false;
    let {insertProject} = this.props;
    if (!!insertProject) {
      insertProject.map((item) => {
        if (item.name == projectName) {
          message.warning('项目名称重复, 请重新选择');
          boolRepeat = true;
        }
      });
    }
    if (boolRepeat) {
      return;
    }
    this.handleProjectName(projectName, id);
  };


  render() {
    let {visible, inputNum, dataEmpty} = this.state;
    let footer = [
      <div>
        <Button key="btn4" type="ghost" onClick={this.handleProjectInfo}>提交</Button>
        <Button key="btn5" type="primary" onClick={this.handleContinueProjectInfo}>继续添加</Button>
      </div>,
    ];

    return (
      <div>
        <Button
          type="primary"
          style={{marginLeft: '20px'}}
          onClick={this.showModal}
        >
          添加项目
        </Button>

        <Modal
          visible={visible}
          title="添加项目"
          onCancel={this.hideModal}
          footer={footer}
          width="720"
        >
          <Row>
            <Col span={12}>
              <label
                className="mr20"
                style={{position: 'relative', top: '5px', float: 'left'}}
              >
                项目名称
              </label>

              <SearchSelectBox
                style={{width: 150, float: 'left'}}
                placeholder={'请输入搜索名称'}
                onSearch={this.handleSearch}
                dataEmpty={dataEmpty}
                onSelectItem={this.handleSelectItem}
              />
            </Col>
            <Col span={12}>
              <Form>
                <label className="mr20" style={{position: 'relative'}}>优惠数量</label>
                <InputNumber
                  min={0}
                  onChange={this.handleInputNum}
                  size="large"
                  style={{width: '140px'}}
                  value={inputNum}
                />
              </Form>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

AddProject = Form.create()(AddProject);
export default AddProject;
