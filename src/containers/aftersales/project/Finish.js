import React from 'react';
import {message, Modal, Row, Col, Form, Button, Icon, Select, Input} from 'antd';

import api from '../../../middleware/api';
import FormLayout from '../../../utils/FormLayout';

import BaseModal from '../../../components/base/BaseModal';

const FormItem = Form.Item;
const Option = Select.Option;

class Finish extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fitterUsers: [],
      itemMap: new Map(),
    };

    [
      'showFinishModal',
      'handleSubmit',
    ].map(method => this[method] = this[method].bind(this));
  }

  showFinishModal() {
    let {items, parts} = this.props;
    if (items.every(item => item.fitter_user_ids.length > 0)) {
      if (parts.length > 0) {
        if (parts.every(part => parseInt(part.real_count) > 0)) {
          this.getFitterUsers();
          this.showModal();
        } else {
          message.warning('工单未领料');
        }
      } else {
        this.getFitterUsers();
        this.showModal();
      }
    } else {
      message.warning('工单未派工');
    }
  }

  handleSubmit() {
    let {form, items} = this.props;
    let values = form.getFieldsValue();

    let itemList = [];
    items.forEach(item => itemList.push({
      _id: item._id, quality_check_user_ids: values[`quality_check_user_id_${item.item_id}`].toString(),
    }));

    api.ajax({
      url: api.aftersales.project.finish(),
      type: 'post',
      data: {
        _id: values._id,
        item_list: JSON.stringify(itemList),
      },
    }, () => {
      message.success('完成质检成功');
      location.reload();
    });
  }

  getFitterUsers() {
    api.ajax({url: api.user.getMaintainUsers(0)}, data => {
      let {setFieldsValue} = this.props.form;
      let {items} = this.props;

      let itemMap = new Map();
      items.map(item => {
        let firstFitterUserId = item.fitter_user_ids.split(',')[0];

        itemMap.set(item.item_id, {_id: item.item_id, quality_check_user_ids: firstFitterUserId});
        this.setState({fitterUsers: data.res.user_list, itemMap});

        setFieldsValue({[`quality_check_user_id_${item.item_id}`]: firstFitterUserId});
      });
    });
  }

  render() {
    const {formItem8_15} = FormLayout;
    let {form, detail, items, disabled} = this.props;
    let {visible, fitterUsers} = this.state;
    let {getFieldDecorator} = form;

    let status = String(detail.status);

    return (
      <span>
        <Button onClick={this.showFinishModal} disabled={status === '1' || status === '-1' || disabled}>完工</Button>

        <Modal
          title={<span><Icon type="check text-success"/> 完工质检</span>}
          visible={visible}
          width={720}
          okText="确认"
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
        >
          <Form>
            {getFieldDecorator('_id', {initialValue: detail._id})(<Input type="hidden"/>)}

            <Row>
              <Col span={12}>
                <FormItem label="工单号" {...formItem8_15}>
                  <p className="ant-form-text">{detail._id}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="维修人员" {...formItem8_15}>
                  <p className="ant-form-text">{detail.fitter_user_names}</p>
                </FormItem>
              </Col>
            </Row>

            {items.map(item => {
              let firstFitterUserId = item.fitter_user_ids.split(',')[0];

              return (
                <Row key={item._id}>
                  <Col span={12}>
                    <FormItem label="维修项目" {...formItem8_15}>
                      <p className="ant-form-text">{item.item_name}</p>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="质检人" {...formItem8_15}>
                      {getFieldDecorator(`quality_check_user_id_${item.item_id}`, {
                        initialValue: firstFitterUserId,
                      })(
                        <Select multiple placeholder="请选择质检人">
                          {fitterUsers.map(user => <Option key={user._id}>{user.name}</Option>)}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              );
            })}
          </Form>
        </Modal>
      </span>
    );
  }
}

Finish = Form.create()(Finish);
export default Finish;
