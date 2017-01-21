import React from 'react';
import {Button, Modal, Row, Col, Table, Select, Input, Form, Popover, message, Icon} from 'antd';
import SearchSelectBox from '../../../components/base/SearchSelectBox';
import api from '../../../middleware/api';
import BaseModal from '../../../components/base/BaseModal';
import QRCode from 'qrcode.react';

const FormItem = Form.Item;
const Option = Select.Option;
class ConsumpMaterialModal extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      qrCodeVisible: false,
      parts: [],
      partsSubmit: [],
      user: [],
      saveBtnVisible: false,
      UseVisible: false,
      SeeVisible: true,
      EditVisible: true,
      consumableId: '1',
      detail: '',
      status: false,
    };
    [
      'handlePopoverVisibleChange',
      'onSearch',
      'onSelectItem',
      'handleSubmit',
      'handleCollarNumberChange',
      'handlePartsDelete',
      'handleCheck',
      'handleEdit',
    ].map(method => this[method] = this[method].bind(this));
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.type == 'see') {
      this.setState({
        SeeVisible: false,
        UseVisible: true,
        EditVisible: true,
      });
    } else if (nextProps.type == 'edit') {
      this.setState({
        SeeVisible: true,
        UseVisible: true,
        EditVisible: false,
      });
    } else {
      this.setState({
        SeeVisible: true,
        UseVisible: false,
        EditVisible: true,
      });
    }

    if (nextProps.consumableId) {
      this.setState({
        consumableId: nextProps.consumableId,
      });
    }
  }

  handlePopoverVisibleChange(visible) {
    this.setState({qrCodeVisible: visible});
    if (visible) {
      this.timer = setInterval(() => {
        api.ajax({url: api.statistics.getConsumableDetail(this.state.consumableId)}, function (data) {
          if (Number(data.res.detail.status) === 1) {
            this.setState({status: true});
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        }.bind(this));
      }, 500);
    } else {
      clearInterval(this.timer);
    }
  }

  handleCollarNumberChange(e, _id) {
    let {partsSubmit} = this.state;
    let partsSubmitChange = partsSubmit.map(item => {
      if (Number(item.part_id) === Number(_id)) {
        item.take_amount = e.target.value;
      }
      return item;
    });
    this.setState({
      partsSubmit: partsSubmitChange,
    });
  }

  handlePartsDelete(_id) {
    let {parts, partsSubmit} = this.state;
    let partsDelete = [];
    let partsSubmitDelete = [];

    parts.map(item => {
      if (Number(item._id) === Number(_id)) {
        return;
      }
      partsDelete.push(item);
    });
    partsSubmit.map(item => {
      if (Number(item.part_id) === Number(_id)) {
        return;
      }
      partsSubmitDelete.push(item);
    });

    this.setState({
      parts: partsDelete,
      partsSubmit: partsSubmitDelete,
    });
  }

  showModal() {
    this.setState({visible: true});
    api.ajax({url: api.user.getUsersByDeptAndRole()}, function (data) {
      let user = data.res.user_list;
      this.setState({
        user,
      });
    }.bind(this));
  }

  hideModal() {
    this.setState({visible: false, parts: [], detail: '', partsSubmit: [], saveBtnVisible: false});
    this.props.form.resetFields();
  }

  handleCheck() {
    this.showModal();
    api.ajax({url: api.statistics.getConsumableDetail(this.state.consumableId)}, function (data) {
      let detail = data.res.detail;
      this.setState({
        parts: detail.content,
        detail,
      });
    }.bind(this));
  }

  handleEdit() {
    this.showModal();
    api.ajax({url: api.statistics.getConsumableDetail(this.state.consumableId)}, function (data) {
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
    let url = api.statistics.createConsumable();
    //如果是编辑后的提交
    if (!this.state.EditVisible) {
      url = api.statistics.editConsumable();
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
    }, (data) => {
      message.error(data);
    });
  }

  onSearch(key, successHandle, failHandle) {
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

  onSelectItem(selectInfo) {
    let {parts, partsSubmit} = this.state;
    let repeatBol = false;
    parts.map(item => {
      if (item._id == selectInfo._id) {
        message.warning('该配件已添加');
        repeatBol = true;
      }
    });
    if(repeatBol) {
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

  render() {
    let {visible, parts} = this.state;
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
                url: api.statistics.authorizeConsumable(),
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
      render(value, record, index) {
        return index + 1;
      },
    }, {
      title: '配件分类',
      dataIndex: 'part_type_name',
      key: 'part_type_name',
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
      render(value, record) {
        return (
          <div>
            {record.amount + '/' + record.freeze}
          </div>
        );
      },
    }, {
      title: '领用数',
      dataIndex: 'take_amount',
      key: 'take_amount',
      render(value, record) {
        return <Input
          type="number"
          defaultValue={value ? value : 0}
          onChange={(e) => self.handleCollarNumberChange(e, record._id)}
          disabled={!self.state.SeeVisible}
        />;
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render(value, record) {
        return <Button
          size="small"
          disabled={!self.state.SeeVisible}
          onClick={() => self.handlePartsDelete(record._id)}
        >删除
        </Button>;
      },
    }];
    return (
      <div>
        <Button
          type="primary"
          className={this.state.UseVisible ? 'hide' : ''}
          onClick={this.showModal}
        >
          耗材领用
        </Button>

        <a
          href="javascript:void(0)"
          className={this.state.SeeVisible ? 'hide' : ''}
          onClick={this.handleCheck}
        >
          查看
        </a>

        <a
          href="javascript:void(0)"
          className={this.state.EditVisible ? 'hide' : ''}
          onClick={this.handleEdit}
        >
          编辑
        </a>

        <Modal
          visible={visible}
          title="添加配件"
          onCancel={this.hideModal}
          footer={null}
          width={800}
        >
          <Form horizontal>
            <Row className={this.state.SeeVisible ? 'padding-15' : 'hide padding-15'}>
              <Col span={12}>
                <SearchSelectBox
                  placeholder={'请输入搜索名称'}
                  onSearch={this.onSearch}
                  displayPattern={item => item.name}
                  onSelectItem={this.onSelectItem}
                />
              </Col>
              <Col span={12}>
                <p className="margin-left-12 margin-top-5">选中配件添加</p>
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
            <Row className="margin-top-20">
              <FormItem label="领用人"  {...formItemLayout}>
                {getFieldDecorator('take_user_id', {initialValue: this.state.detail.take_user_id ? this.state.detail.take_user_id : ''})(
                  <Select size="large" style={{width: '300px'}} disabled={!this.state.SeeVisible}>
                    {this.state.user.map(item => <Option key={item._id}>{item.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Row>
            <Row className="margin-top-20">
              <FormItem label="描述" {...formItemLayout}>
                {getFieldDecorator('remark', {initialValue: this.state.detail.remark ? this.state.detail.remark : ''})(
                  <Input style={{width: '300px'}} type="textarea" disabled={!this.state.SeeVisible}/>
                )}
              </FormItem>
            </Row>
            <Row className="padding-15">
              <Popover
                content={content}
                trigger="click"
                visible={this.state.qrCodeVisible}
                onVisibleChange={this.handlePopoverVisibleChange}
              >
                <Button type="primary" className="margin-left-60" disabled={!this.state.saveBtnVisible}>
                  审核领用
                </Button>
              </Popover>

              <Button className="margin-left-20" onClick={this.handleSubmit}
                      disabled={this.state.saveBtnVisible || !this.state.SeeVisible}>
                保存
              </Button>
            </Row>
          </Form>

        </Modal>
      </div>
    );
  }
}

ConsumpMaterialModal = Form.create()(ConsumpMaterialModal);
export default ConsumpMaterialModal;
