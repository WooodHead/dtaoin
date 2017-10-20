import React from 'react';
import { message, Modal, Icon, Form, Input, Select, Row, Tooltip, Button, Checkbox } from 'antd';

import api from '../../../middleware/api';
import Layout from '../../../utils/FormLayout';
import validator from '../../../utils/validator';
import FormValidator from '../../../utils/FormValidator';

import BaseModalWithUpload from '../../../components/base/BaseModalWithUpload';
import Qiniu from '../../../components/widget/UploadQiniu';

const Option = Select.Option;
const FormItem = Form.Item;

let introducePicIndex = 0;

class New extends BaseModalWithUpload {
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
    ].map(method => this[method] = this[method].bind(this));
  }

  addIntroducePics() {
    const { introduceCount } = this.state;
    if (Number(introduceCount) === 5) {
      message.error('最多只能添加5张介绍图片');
      return false;
    }
    introducePicIndex++;

    const currentIntroduceCount = introduceCount + 1;

    const { form } = this.props;

    let keys = form.getFieldValue('keys');
    keys = keys.concat(introducePicIndex);
    form.setFieldsValue({ keys });

    const keyProps = `demo_pic_${introducePicIndex}_key`;
    const filesProps = `demo_pic_${introducePicIndex}_files`;
    const progressProps = `demo_pic_${introducePicIndex}_progress`;

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
      const hideProp = `demo_pic_hide_${k}`;
      this.setState({ [hideProp]: true });
    });
  }

  assembleIntroducePics(formData) {
    const pictures = [];
    const keys = formData.keys;
    for (let i = 0; i < keys.length; i++) {
      const deleteProp = `demo_pic_hide_${i}`;
      const picKeyProp = `demo_pic_${i}_key`;
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

      this.props.createMaterial(values);
    });
  }

  render() {
    const { formItemLayout } = Layout;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { visible, keys } = this.state;

    const { resourceList } = this.props;

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
      const hideProp = `demo_pic_hide_${k}`;
      return (
        <FormItem
          key={k}
          className={this.state[hideProp] ? 'hide' : 'mb10'}
          label="照片"
          {...formItemLayout}
        >
          <Row className={this.state[hideProp] ? 'hide' : 'mb10'}>
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
                  prefix={`demo_pic_${k}`}
                  saveKey={this.handleKey.bind(this)}
                  source={api.system.getPublicPicUploadToken('demo_pic')}
                  onDrop={this.onDrop.bind(this, `demo_pic_${k}`)}
                  onUpload={this.onUpload.bind(this, `demo_pic_${k}`)}
                  style={{ width: '167px', height: '126px' }}
                >
                  {this.renderImage(`demo_pic_${k}`, introduceProgressStyle, {
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
        <Button onClick={this.showModal} type="primary">增加材料</Button>
        <Modal
          title={<span><Icon type="plus" className="mr10" />增加材料</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            <FormItem label="材料名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: FormValidator.getRuleNotNull(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入材料名称" />,
              )}
            </FormItem>

             <FormItem label="字段说明" {...formItemLayout}>
              {getFieldDecorator('remark')(
                <Input placeholder="最多不得超过x个字，例如“正面、反面”" />,
              )}
            </FormItem>

             <FormItem label="资源方" {...formItemLayout}>
              {getFieldDecorator('resource_id', { initialValue: '0' })(
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

New = Form.create()(New);
export default New;
