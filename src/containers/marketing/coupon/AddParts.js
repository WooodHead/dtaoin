import React from 'react';
import {Button, Modal, Row, Col, InputNumber, message} from 'antd';

import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';

export default class AddParts extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataEmpty: false,
      inputNum: '',
      projectName: '',
      id: 0,
      projectInfo: [],
      key: '',
      type: 1,
      status: 0,
    };

    [
      'handlePartsInfo',
      'handleInputNum',
      'handleSelectItem',
      'handleSearch',
      'handleContinuePartsInfo',
      'handleProjectName',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleInputNum(value) {
    this.setState({inputNum: value});
  }

  showModal() {
    this.setState({visible: true, dataEmpty: true});
  }

  hideModal() {
    this.setState({visible: false, dataEmpty: false, inputNum: ''});
  }

  handlePartsInfo() {
    let {inputNum, projectName} = this.state;
    if (!inputNum || !projectName) {
      if (!projectName) {
        message.warning('请填写配件分类');
      } else {
        message.warning('请填写优惠数量');
      }
      return;
    }
    let boolRepeat = false;
    let {insertParts} = this.props;
    if (!!insertParts) {
      insertParts.map((item) => {
        if (item.name == projectName) {
          message.warning('配件分类重复, 请重新选择');
          boolRepeat = true;
        }
      });
    }
    if (boolRepeat) {
      return;
    }
    let temp = {amount: inputNum, _id: this.state.id, name: projectName};
    this.setState({
      projectInfo: this.state.projectInfo.concat(temp),
    }, () => {
      this.props.handleParts(this.state.projectInfo);
    });

    this.hideModal();
    this.setState({
      inputNum: '',
    });
  }

  handleContinuePartsInfo() {
    let {inputNum, projectName} = this.state;
    if (!inputNum || !projectName) {
      if (!projectName) {
        message.warning('请填写配件分类');
      } else {
        message.warning('请填写优惠数量');
      }
      return;
    }
    let boolRepeat = false;
    let {insertParts} = this.props;
    if (!!insertParts) {
      insertParts.map((item) => {
        if (item.name == projectName) {
          message.warning('配件分类重复, 请重新选择');
          boolRepeat = true;
        }
      });
    }
    if (boolRepeat) {
      return;
    }
    let temp = {amount: inputNum, _id: this.state.id, name: projectName};
    this.setState({
      projectInfo: this.state.projectInfo.concat(temp),
    }, () => {
      this.props.handleParts(this.state.projectInfo);
    });
    //继续添加时候清除搜索框数据
    this.setState({
      inputNum: '',
      dataEmpty: false,
    }, () => {
      this.setState({
        dataEmpty: true,
      });
    });
  }

  handleProjectName(projectName, id) {
    this.setState({
      projectName: projectName,
      id: id,
    });
  }

  handleSearch(key, successHandle, failHandle) {
    let {type, status} = this.state;
    this.setState({key: key});
    let condition = {key, type, status};
    let url = api.warehouse.category.search(condition.key);
    api.ajax({url}, (data) => {
      if (data.code === 0) {
        this.setState({data: data.res.list});
        successHandle(data.res.list);
      } else {
        failHandle(data.msg);
      }
    }, () => {

    });
  }

  handleSelectItem = function (selectInfo) {
    let projectName = selectInfo.name;
    let id = selectInfo._id;
    let boolRepeat = false;
    let {insertParts} = this.props;
    if (!!insertParts) {
      insertParts.map((item) => {
        if (item.name == projectName) {
          message.warning('配件分类重复, 请重新选择');
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
        <Button key="btn2" type="ghost" onClick={this.handlePartsInfo}>提交</Button>
        <Button key="btn3" type="primary" onClick={this.handleContinuePartsInfo}>继续添加</Button>
      </div>,
    ];
    return (
      <div>
        <Button
          type="primary"
          onClick={this.showModal}
          style={{marginLeft: '20px', marginTop: '20px'}}
        >
          添加配件
        </Button>

        <Modal
          visible={visible}
          title="添加配件"
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
                配件分类
              </label>

              <SearchSelectBox
                style={{width: 150, float: 'left'}}
                placeholder={'请输入搜索名称'}
                onSearch={this.handleSearch}
                displayPattern={item => item.name}
                dataEmpty={dataEmpty}
                onSelectItem={this.handleSelectItem}
              />
            </Col>
            <Col span={12}>
              <label className="mr20" style={{position: 'relative'}}>优惠数量</label>
              <InputNumber
                min={0}
                onChange={this.handleInputNum}
                size="large"
                style={{width: '140px'}}
                value={inputNum}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
