import React from 'react';
import {Button, Modal, Row, Col, Table, Select, Input, Form, Popover, message, Icon} from 'antd';

import QRCode from 'qrcode.react';
import path from '../../../config/path';
import api from '../../../middleware/api';

import BaseModal from '../../../components/base/BaseModal';
import SearchSelectBox from '../../../components/widget/SearchSelectBox';

const FormItem = Form.Item;
const Option = Select.Option;

class New extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      parts: [],
      partsSubmit: [],
      user: [],
      saveBtnVisible: false,
      useVisible: false,
      seeVisible: true,
      editVisible: true,
      consumableId: '1',
      detail: '',
      status: false,
      visible: props.consumptiveShow || false,
      qrCodeVisible: false,
      hasPermission: false,
    };
    [
      'handlePopoverVisibleChange',
      'handleSearch',
      'handleSelectItem',
      'handleSubmit',
      'handleCountChange',
      'handlePartsDelete',
      'handleCheck',
      'handleEdit',
      'handleSelectChange',
      'handleRemarkChange',
      'handleAuthorizeConsumable',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.type) {
      case 'see':
        this.setState({seeVisible: false, useVisible: true, editVisible: true});
        break;
      case 'edit':
        this.setState({seeVisible: true, useVisible: true, editVisible: false});
        break;
      default:
        this.setState({seeVisible: true, useVisible: false, editVisible: true});
    }
    if (nextProps.consumableId) {
      this.setState({
        consumableId: nextProps.consumableId,
      });
    }
  }

  hideModal() {
    this.setState({
      visible: false,
      parts: [],
      detail: '',
      partsSubmit: [],
      saveBtnVisible: false,
    });
    this.props.form.resetFields();
    clearInterval(window.timer);
  }

  showModal() {
    this.setState({visible: true});
    this.getIsAuthorization();
    this.getUsersByDeptAndRole();
  }

  handlePopoverVisibleChange(visible) {
    this.setState({qrCodeVisible: visible});
    if (visible) {
      this.timer = setInterval(() => {
        api.ajax({url: api.aftersales.getConsumableDetail(this.state.consumableId)}, function (data) {
          if (Number(data.res.detail.status) === 1) {
            this.setState({status: true});
            setTimeout(() => {
              location.reload();
            }, 1000);
          }
        }.bind(this));
      }, 2000);
    } else {
      clearInterval(this.timer);
    }
  }

  handleCountChange(e, record) {
    this.setState({saveBtnVisible: false});
    let realAmount = Number(record.amount) - Number(record.freeze);
    if (Number(e.target.value) > realAmount) {
      message.error('输入数量有误，请重新输入');
      this[record._id].value = '';

      let {partsSubmit} = this.state;
      let partsSubmitChange = partsSubmit.map(item => {
        if (Number(item.part_id) === Number(record._id)) {
          item.take_amount = '';
        }
        return item;
      });
      this.setState({partsSubmit: partsSubmitChange});
      return;
    }

    let {partsSubmit} = this.state;
    let partsSubmitChange = partsSubmit.map(item => {
      if (Number(item.part_id) === Number(record._id)) {
        item.take_amount = e.target.value;
      }
      return item;
    });
    this.setState({partsSubmit: partsSubmitChange});
  }

  handlePartsDelete(id) {
    this.setState({saveBtnVisible: false});
    let {parts, partsSubmit} = this.state;
    let partsDelete = [];
    let partsSubmitDelete = [];

    parts.map(item => {
      if (Number(item._id) === Number(id)) {
        return;
      }
      partsDelete.push(item);
    });

    partsSubmit.map(item => {
      if (Number(item.part_id) === Number(id)) {
        return;
      }
      partsSubmitDelete.push(item);
    });

    this.setState({
      parts: partsDelete,
      partsSubmit: partsSubmitDelete,
    });
  }

  handleCheck() {
    this.showModal();
    api.ajax({url: api.aftersales.getConsumableDetail(this.state.consumableId)}, function (data) {
      let detail = data.res.detail;
      this.setState({parts: detail.content, detail});
    }.bind(this));
  }

  handleEdit() {
    this.showModal();
    this.setState({saveBtnVisible: true});
    api.ajax({url: api.aftersales.getConsumableDetail(this.state.consumableId)}, function (data) {
      let detail = data.res.detail;
      //编辑时获取编辑后要提交的内容
      let partsSubmit = [];
      detail.content.map(item => {
        let partSubmit = {part_id: item._id, take_amount: item.take_amount};
        partsSubmit.push(partSubmit);
      });
      this.setState({
        parts: detail.content,
        detail,
        partsSubmit,
      });
    }.bind(this));
  }

  handleSubmit() {
    //提交分两种情况 1.创建提交 2.编辑提交
    let formData = this.props.form.getFieldsValue();
    let {parts} = this.state;
    let part_names = '';
    parts.map(item => {
      part_names = part_names + item.name + ';';
    });
    formData.content = JSON.stringify(this.state.partsSubmit);
    formData.part_names = part_names;
    let url = api.aftersales.createConsumable();
    //如果是编辑后的提交
    if (!this.state.editVisible) {
      url = api.aftersales.editConsumable();
      formData.consumable_id = this.state.consumableId;
    }
    api.ajax({
      url: url,
      type: 'POST',
      data: formData,
    }, (data) => {
      this.setState({
        consumableId: data.res.detail._id,
        saveBtnVisible: true,
      });
      message.success('保存数据成功');
      this.props.getList();
    }, (data) => {
      message.error(data);
    });
  }

  handleSearch(key, successHandle, failHandle) {
    let url = api.warehouse.part.search(key);
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

  handleSelectItem(selectInfo) {
    let realAmount = Number(selectInfo.amount) - Number(selectInfo.freeze);
    if (realAmount <= 0) {
      message.error('该配件剩余库存不足');
      return;
    }
    this.setState({saveBtnVisible: false});
    let {parts, partsSubmit} = this.state;
    let repeatBol = false;
    parts.map(item => {
      if (item._id == selectInfo._id) {
        message.warning('该配件已添加');
        repeatBol = true;
      }
    });
    if (repeatBol) {
      return;
    }

    let partSubmit = {part_id: selectInfo._id, take_amount: 0};
    parts.push(selectInfo);
    partsSubmit.push(partSubmit);
    this.setState({
      parts,
      partsSubmit,
    });
  }

  handleSelectChange() {
    this.setState({saveBtnVisible: false});
  }

  handleRemarkChange() {
    this.setState({saveBtnVisible: false});
  }

  handleAuthorizeConsumable() {
    window.timer = setInterval(() => {
      api.ajax({url: api.aftersales.getConsumableDetail(this.state.consumableId)}, function (data) {
        if (Number(data.res.detail.status) === 1) {
          this.setState({status: true});
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      }.bind(this));
    }, 2000);

    api.ajax({
        url: api.aftersales.authorizeConsumable(),
        type: 'POST',
        data: {consumable_id: this.state.consumableId},
      }, () => {
        message.success('审核通过');
      }, (data) => {
        message.error(data.msg);
        clearInterval(window.timer);
      }
    );
  }

  getUsersByDeptAndRole() {
    api.ajax({url: api.user.getUsersByDeptAndRole()}, function (data) {
      let user = data.res.user_list;
      this.setState({
        user,
      });
    }.bind(this));
  }


  async getIsAuthorization() {
    let hasPermission = await api.checkPermission(path.aftersales.consumptiveMaterial.examine);
    this.setState({hasPermission});
  }

  render() {
    let {
      visible,
      parts,
      saveBtnVisible,
      seeVisible,
      useVisible,
      editVisible,
      detail,
      hasPermission,
    } = this.state;
    let {size} = this.props;
    const formItemLayout = {labelCol: {span: 2}, wrapperCol: {span: 22}};
    const {getFieldDecorator} = this.props.form;
    let self = this;
    const content = (
      <div>
        <span className="canvas no-print">
          <QRCode
            value={JSON.stringify({
              authType: 'confirm-check-consumable',
              requestParams: {
                type: 'post',
                url: api.aftersales.authorizeConsumable(),
                data: {consumable_id: this.state.consumableId},
              },
            })}
            size={128}
            ref="qrCode"
          />
        </span>
        <img src="" className="print-image" ref="printImg"/>
        <div>
          <span>请扫码确认</span>
          <Icon
            type="check-circle"
            className={this.state.status ? 'confirm-check' : 'hide'}
          />
        </div>
      </div>
    );

    const columns = [{
      title: '序号',
      dataIndex: '',
      key: '',
      render: (value, record, index) => index + 1,
    }, {
      title: '规格',
      className: 'text-right',
      width: '8%',
      render: (value, record) => `${record.spec || ''}${record.unit || ''}`,
    }, {
      title: '配件名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '配件号',
      dataIndex: 'part_no',
      key: 'part_no',
    }, {
      title: '适用车型',
      dataIndex: 'scope',
      key: 'scope',
    }, {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    }, {
      title: '库存数/冻结数',
      dataIndex: '',
      key: '',
      render: (value, record) => record.amount + '/' + record.freeze,
    }, {
      title: '领用数',
      dataIndex: 'take_amount',
      key: 'take_amount',
      render: (value, record) => {
        return (
          <input
            className="ant-input ant-input-lg"
            ref={takeAmount => self[record._id] = takeAmount}
            type="text"
            defaultValue={value ? value : ''}
            onInput={e => self.handleCountChange(e, record)}
            disabled={!self.state.seeVisible}
          />
        );
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render: (value, record) => {
        return (
          <Button
            size="small"
            disabled={!self.state.seeVisible}
            onClick={() => self.handlePartsDelete(record._id)}
          >删除
          </Button>
        );
      },
    }];
    return (
      <span>
        {size === 'small' ?
          <span>
            <a href="javascript:;" className={seeVisible ? 'hide' : ''} onClick={this.handleCheck}>查看</a>
            <a href="javascript:;" className={editVisible ? 'hide' : ''} onClick={this.handleEdit}>编辑</a>
          </span> :
          <Button type="primary" className={useVisible ? 'hide' : ''} onClick={this.showModal}>
            耗材领用
          </Button>
        }
        <Modal
          visible={visible}
          title="耗材领用"
          onCancel={this.hideModal}
          footer={null}
          width={960}
        >
          <Form>
            <Row className={seeVisible ? 'padding-15' : 'hide padding-15'}>
              <Col span={12}>
                <SearchSelectBox
                  placeholder={'请输入搜索名称'}
                  onSearch={this.handleSearch}
                  displayPattern={item => `${item.name} ${item.spec}${item.unit}`}
                  onSelectItem={this.handleSelectItem}
                  disabled={true}
                />
              </Col>
            </Row>

            <Row className="padding-15">
              <Table
                columns={columns}
                dataSource={parts}
                pagination={false}
                bordered
              />
            </Row>
            <Row className="mt20">
              <FormItem label="领用人"  {...formItemLayout}>
                {getFieldDecorator('take_user_id', {
                  initialValue: detail.take_user_id ? detail.take_user_id : '',
                  onChange: this.handleSelectChange,
                })(
                  <Select size="large" style={{width: '300px'}} disabled={!seeVisible}>
                    {this.state.user.map(item => <Option key={item._id}>{item.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Row>
            <Row className="mt20">
              <FormItem label="描述" {...formItemLayout}>
                {getFieldDecorator('remark', {
                  initialValue: detail.remark ? detail.remark : '',
                  onChange: this.handleRemarkChange,
                })(
                  <Input style={{width: '300px'}} type="textarea" disabled={!seeVisible}/>
                )}
              </FormItem>
            </Row>
            <Row className="padding-15">
              {
                hasPermission ?
                  <Button
                    type="primary"
                    className="ml20"
                    disabled={!saveBtnVisible}
                    onClick={this.handleAuthorizeConsumable}
                  >
                    审核领用
                  </Button> :
                  <Popover
                    content={content}
                    trigger="click"
                    visible={this.state.qrCodeVisible}
                    onVisibleChange={this.handlePopoverVisibleChange}
                  >
                    <Button type="primary" className="ml20" disabled={!saveBtnVisible}>
                      审核领用
                    </Button>
                  </Popover>

              }
              <Button
                className="ml20"
                onClick={this.handleSubmit}
                disabled={saveBtnVisible || !seeVisible}
              >
                保存
              </Button>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

New = Form.create()(New);
export default New;
