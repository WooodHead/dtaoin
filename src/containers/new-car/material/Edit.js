import React from 'react';
import { message, Modal, Icon, Form, Input, Select, Row, Tooltip, Button, Checkbox } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import Qiniu from '../../../components/widget/UploadQiniu';
import BaseModalWithUpload from '../../../components/base/BaseModalWithUpload';

const FormItem = Form.Item;
const Option = Select.Option;

let introducePicIndex = 0;

class Edit extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      keys: [0],
      visible: false,
    };
    [
      'addIntroducePics',
      'assembleIntroducePics',
      'removeIntroducePics',
      'handleSubmit',
      'editBanner',
    ].map(method => this[method] = this[method].bind(this));
  }

  editBanner() {
    const { detail } = this.props;
    /* this.setState({ icon_pic_key: detail.banner_pic });
     if (detail.banner_pic) {
       this.getImageUrl(api.system.getPublicPicUrl(detail.banner_pic), 'banner_pic');
     }*/
    setTimeout(() => {
      this.getIntroducePics(detail.content);
    }, 500);
    this.showModal();
  }

  getIntroducePics(description) {
    let keys = [], stateObj = {};

    let descriptionDetail = [{}];

    try {
      descriptionDetail = JSON.parse(description);
    } catch (e) {
    }

    for (let i = 0; i < (descriptionDetail.length); i++) {
      keys.push(i);
    }

    this.setState({ keys });

    if (descriptionDetail.length > 0) {
      introducePicIndex = descriptionDetail.length - 1;
      const introduceCount = descriptionDetail.length;
      descriptionDetail.map((item, index) => {
        const picUrlProp = `introduce_pics_${index}`;
        const picKeyProp = `introduce_pics_${index}_key`;
        const picFilesProp = `introduce_pics_${index}_files`;
        const picProgressProp = `introduce_pics_${index}_progress`;

        stateObj[picKeyProp] = item.demo_pic;
        stateObj[picFilesProp] = [];
        stateObj[picProgressProp] = {};
        this.setState(stateObj);
        this.setState({ introduceCount });

        if (item.demo_pic) {
          this.getImageUrl(api.system.getPublicPicUrl(item.demo_pic), picUrlProp);
        }

        if (item.title) {
          this.props.form.setFieldsValue({ [`introduce_word_${index}`]: item.title });
        }
        if (item.amount) {
          this.props.form.setFieldsValue({
            [`introduce_amount_${index}`]: Number(item.amount) === 0,
          });
        }
      });
    }
  }

  addIntroducePics() {
    const { introduceCount } = this.state;
    if (Number(introduceCount) === 5) {
      message.error('最多只能添加5张介绍图片');
      return false;
    }
    introducePicIndex = introducePicIndex + 1;

    const currentIntroduceCount = introduceCount + 1;

    const { form } = this.props;

    let keys = form.getFieldValue('keys');
    keys = keys.concat(introducePicIndex);
    form.setFieldsValue({ keys });

    const keyProps = `introduce_pics_${introducePicIndex}_key`;
    const filesProps = `introduce_pics_${introducePicIndex}_files`;
    const progressProps = `introduce_pics_${introducePicIndex}_progress`;

    this.setState({
      [keyProps]: '',
      [filesProps]: [],
      [progressProps]: {},
      introduceCount: currentIntroduceCount,
    });
  }

  removeIntroducePics(k) {
    const { introduceCount } = this.state;

    const currentIntroduceCount = introduceCount - 1;

    this.setState({ introduceCount: currentIntroduceCount }, () => {
      if (Number(currentIntroduceCount) === 0) {
        this.addIntroducePics();
      }
      const hideProp = `introduce_pics_hide_${k}`;
      this.setState({ [hideProp]: true });
    });
  }

  assembleIntroducePics(formData) {
    const pictures = [];
    const keys = formData.keys;
    for (let i = 0; i < keys.length; i++) {
      const deleteProp = `introduce_pics_hide_${i}`;
      const picKeyProp = `introduce_pics_${i}_key`;
      const picWord = this.props.form.getFieldValue(`introduce_word_${i}`);
      const amount = this.props.form.getFieldValue(`introduce_amount_${i}`) ? '0' : '1';

      if (this.state[deleteProp]) {
        delete formData[`introduce_word_${i}`];
        continue;
      }
      pictures.push({ demo_pic: this.state[picKeyProp], title: picWord, amount });
    }
    delete formData.keys;
    return pictures;
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      values.content = JSON.stringify(this.assembleIntroducePics(values));

      this.props.submit(values, this.hideModal);
    });
  }

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { visible, keys } = this.state;

    const { detail, resourceList } = this.props;

    getFieldDecorator('keys', { initialValue: keys });

    const introduceProgressStyle = {
      position: 'absolute',
      left: '170px',
      top: '45px',
      zIndex: '10',
      width: '100px',
      color: '#87d068',
    };

    const introducePics = getFieldValue('keys').map(k => {
      const hideProp = `introduce_pics_hide_${k}`;
      return (
        <FormItem
          key={k}
          {...formItemLayout}
          className={this.state[hideProp] ? 'hide' : 'mb10'}
          label={'照片'}
        >
          <Row>
            {getFieldDecorator(`introduce_word_${k}`)(
              <Input
                style={{ width: '200px' }}
                className="mt10 mb10 mr10"
                placeholder="请输入图片介绍"
              />,
            )}
            {getFieldDecorator(`introduce_amount_${k}`)(
              <Checkbox
                checked={this.props.form.getFieldValue(`introduce_amount_${k}`)}>数量不限</Checkbox>,
            )}
            <Tooltip placement="top" title="双击添加或更换图片">
              <div style={{ width: '167px' }}>
                <Qiniu
                  prefix={`introduce_pics_${k}`}
                  saveKey={this.handleKey.bind(this)}
                  source={api.system.getPublicPicUploadToken('introduce_pics')}
                  onDrop={this.onDrop.bind(this, `introduce_pics_${k}`)}
                  onUpload={this.onUpload.bind(this, `introduce_pics_${k}`)}
                  style={{ width: '167px', height: '126px' }}
                >
                  {this.renderImage(`introduce_pics_${k}`, introduceProgressStyle, {
                    height: '120px',
                    width: '100%',
                  })}
                </Qiniu>
              </div>
            </Tooltip>

            <a
              href="javascript:;"
              className="mt10"
              onClick={() => this.removeIntroducePics(k)}
            >
              删除
            </a>
          </Row>
        </FormItem>

      );
    });

    return (
      <span>
        <a href="javascript:" onClick={this.editBanner}>编辑</a>

        <Modal
          title={<span><Icon type="edit" className="mr10" />编辑材料</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            {getFieldDecorator('material_id', { initialValue: detail._id })(
              <Input type="hidden" />,
            )}

            <FormItem label="材料名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: detail.name,
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入材料名称" />,
              )}
            </FormItem>

             <FormItem label="字段说明" {...formItemLayout}>
              {getFieldDecorator('remark', { initialValue: detail.remark })(
                <Input placeholder="最多不得超过x个字，例如“正面、反面”" />,
              )}
            </FormItem>

             <FormItem label="资源方" {...formItemLayout}>
              {getFieldDecorator('resource_id', { initialValue: detail.resource_id })(
                <Select style={{ width: 200 }} size="large">
                  <Option key="0">不限</Option>
                  {resourceList.map(item => <Option key={item._id}>{item.name}</Option>)}
                </Select>,
              )}
            </FormItem>

            <div className="introduce-pic">
               {introducePics}
            </div>


              <Button
                className="pic-add-button"
                type="dashed"
                icon="plus"
                onClick={this.addIntroducePics}
                style={{ marginLeft: '25%' }}
              >
                添加
              </Button>

          </Form>
        </Modal>
      </span>
    );
  }
}

Edit = Form.create()(Edit);
export default Edit;
