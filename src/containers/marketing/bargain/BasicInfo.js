import React from 'react';
import { Row, Col, Button, Form, Input, Icon, Tooltip, message } from 'antd';

import Layout from '../../../utils/FormLayout';
import FormValidator from '../../../utils/FormValidator';
import Qiniu from '../../../components/widget/UploadQiniu';
import api from '../../../middleware/api';

import UploadComponent from '../../../components/base/BaseUpload';
import DateRangeSelector from '../../../components/widget/DateRangeSelector';

import LargePicture from './LargePicture';
import Preview from './Preview';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

require('../bargain.less');

let introducePicIndex = 0;

// 记录添加了几张项目介绍
// let introduceCount = 1;

class New extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      keys: [0],
      startTime: '',
      endTime: '',
      id: props.activityId,
      detail: {},
      introduceCount: 1,
    };

    [
      'addIntroducePics',
      'assembleIntroducePics',
      'removeIntroducePics',
      'handleSubmit',
      'handleDateChange',
      'handleCopyUrl',
      'handleDownLoad',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { id } = this.state;
    if (!!id) {
      this.getDetail(id);
    }
  }

  handleCopyUrl() {
    const url = this.url;
    url.select();
    try {
      if (document.execCommand('copy', false, null)) {
        message.success('复制成功');
      } else {
        message.success('复制失败');
      }
    } catch (err) {
      message.success('复制失败');
    }
  }

  handleDownLoad() {
    const { detail } = this.state;
    const canvas = this.qrCode.refs.canvas.toDataURL('image/png');
    const imgData = canvas.replace(this.handleFixType('png'), 'image/octet-stream');
    const filename = `${detail.title  }.` + 'png';
    this.handleSaveFile(imgData, filename);
  }

  handleSaveFile = function(data, filename) {
    const saveLink = document.createElement('a');
    saveLink.href = data;
    saveLink.download = filename;

    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    saveLink.dispatchEvent(event);
  };

  handleFixType = function(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    const r = type.match(/png|jpeg|bmp|gif/)[0];
    return `image/${  r}`;
  };

  handleSubmit() {
    const { id } = this.state;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('数据未填写完整');
        return false;
      }

      values.description = this.assembleIntroducePics(values);

      if (!values.banner_pic) {
        message.error('请上传项目图片');
        return false;
      }

      if (values.description && !values.description[0].pic) {
        message.error('请上传项目介绍图片');
        return false;
      }

      console.log('values.description', values.description);


      for (let i = 0; i < values.description.length; i++) {
        if (!values.description[i].pic) {
          message.error('优惠项目介绍未填写完整');
          return false;
        }
      }

      values.description = JSON.stringify(values.description);

      let url = api.coupon.createBargainActivity();
      if (!!id) {
        url = api.coupon.editBargainActivity();
        values.activity_id = id;
      }

      api.ajax({
        url,
        type: 'POST',
        data: values,
      }, data => {
        const detail = data.res.detail;
        if (!!id) {
          message.success('编辑项目成功!');
        } else {
          message.success('创建项目成功!');
        }
        location.href = `/marketing/bargain/edit/${detail._id}`;
      });
    });
  }

  getDetail(id) {
    api.ajax({
      url: api.coupon.bargainActivityDetail(id),
    }, data => {
      const { detail } = data.res;
      this.setState({ detail });

      this.props.form.setFieldsValue({
        start_date: detail.start_date,
        expire_date: detail.expire_date,
      });

      this.getPic(detail);
    });
  }

  getPic(detail) {
    this.setState({
      banner_pic_key: detail.banner_pic,
    });
    this.props.form.setFieldsValue({
      banner_pic: detail.banner_pic,
    });

    if (detail.banner_pic) {
      this.getImageUrl(api.system.getPublicPicUrl(detail.banner_pic), 'banner_pic');
    }
    this.getIntroducePics(detail.description);
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
        let picUrlProp = `introduce_pics_${index}`,
          picKeyProp = `introduce_pics_${index}_key`,
          picFilesProp = `introduce_pics_${index}_files`,
          picProgressProp = `introduce_pics_${index}_progress`;

        stateObj[picKeyProp] = item.pic;
        stateObj[picFilesProp] = [];
        stateObj[picProgressProp] = {};
        this.setState(stateObj);
        this.setState({ introduceCount });

        if (item.pic) {
          this.getImageUrl(api.system.getPublicPicUrl(item.pic), picUrlProp);
        }
        if (item.text) {
          this.props.form.setFieldsValue({ [`introduce_word_${index}`]: item.text });
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
    introducePicIndex++;

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

  handleDateChange(startTime, endTime) {
    this.props.form.setFieldsValue({ start_date: startTime, expire_date: endTime });
  }

  assembleIntroducePics(formData) {
    const pictures = [];
    const keys = formData.keys;
    for (let i = 0; i < keys.length; i++) {
      const deleteProp = `introduce_pics_hide_${i}`;
      const picKeyProp = `introduce_pics_${i}_key`;
      const picWord = this.props.form.getFieldValue(`introduce_word_${i}`);

      if (this.state[deleteProp]) {
        delete formData[`introduce_word_${i}`];
        continue;
      }
      pictures.push({ pic: this.state[picKeyProp], text: picWord });
    }
    delete formData.keys;
    return pictures;
  }

  render() {
    const { keys, detail, id } = this.state;
    const { formItemLayout_12 } = Layout;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: keys });

    const introduceProgressStyle = {
      position: 'absolute',
      left: '15px',
      bottom: '-98px',
      zIndex: '10',
      color: '#87d068',
    };
    const projectProgressStyle = {
      position: 'absolute',
      left: '202px',
      top: '60px',
      zIndex: '10',
      width: '100px',
      color: '#87d068',
    };

    const introducePics = getFieldValue('keys').map(k => {
      const hideProp = `introduce_pics_hide_${k}`;
      return (
        <Row className={this.state[hideProp] ? 'hide' : 'mb10'} key={k}>
          <Tooltip placement="top" title="双击添加或更换图片">
            <div>
              <Qiniu
                prefix={`introduce_pics_${k}`}
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('introduce_pics')}
                onDrop={this.onDrop.bind(this, `introduce_pics_${k}`)}
                onUpload={this.onUpload.bind(this, `introduce_pics_${k}`)}
                style={{ width: '320px', height: '240px' }}
              >
                {this.renderImage(`introduce_pics_${k}`, introduceProgressStyle, {
                  height: '230px',
                  width: '100%',
                })}
              </Qiniu>
            </div>
          </Tooltip>

          {getFieldDecorator(`introduce_word_${k}`)(
            <TextArea style={{ width: '100%' }} className="mt10" placeholder="请输入图片介绍" />,
          )}

          <Button
            type="ghost"
            onClick={() => this.removeIntroducePics(k)}
            style={{ float: 'right' }}
            className="pull-right mt10"
          >
            删除
          </Button>
        </Row>
      );
    });

    return (
      <div>
        {getFieldDecorator('start_date')(
          <Input type="hidden" />,
        )}
        {getFieldDecorator('expire_date')(
          <Input type="hidden" />,
        )}
        <Row className="head-action-bar-line mb20">
          <div className="pull-right">
            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
          </div>
        </Row>
        <div className="bargain clearfix">
          <div className="preview">
            <Preview detail={this.props.form.getFieldsValue()} state={this.state} />
          </div>
          <div className="info">
            <Form>
              <div>
                <span style={{
                  fontWeight: 'bold',
                  marginLeft: '80px',
                  marginBottom: '10px',
                  display: 'inline-block',
                }}>
                  基础信息
                </span>
                <div style={{ borderBottom: '1px solid #f1f1f1', margin: '0 0 30px 80px' }} />
              </div>
              <Row>
                <Col span={24}>
                  <FormItem label="活动标题" {...formItemLayout_12}>
                    {getFieldDecorator('title', {
                      initialValue: detail.title,
                      rules: FormValidator.getRuleNotNull(),
                    })(
                      <Input placeholder="请输入活动标题，建议字数在12字以内" style={{ width: '340px' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FormItem label="优惠总数" {...formItemLayout_12}>
                    {getFieldDecorator('total_coupon_count', {
                      initialValue: detail.total_coupon_count,
                      rules: FormValidator.getRuleNotNull(),
                    })(
                      <Input type="number" placeholder="请输入优惠总数" style={{ width: '340px' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FormItem label="活动时间" {...formItemLayout_12} required>
                    <DateRangeSelector
                      onDateChange={this.handleDateChange}
                      startTime={detail.start_date || ''}
                      endTime={detail.expire_date || ''}
                      earlyTodayDisabled={true}
                    />
                    <div className="bargain-icon" style={{ right: '-10px' }}>
                      <Tooltip placement="topLeft" title="起始时间为所选日期的零点，截止时间为所选日期的二十四点。">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </div>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FormItem label="上传项目图片" {...formItemLayout_12} help="尺寸: 800*600px" required>
                    {getFieldDecorator('banner_pic')(
                      <Input type="hidden" />,
                    )}
                    <Tooltip placement="top" title="双击添加或更换图片">
                      <div style={{ width: '210px', height: '150px' }}>
                        <Qiniu
                          prefix="banner_pic"
                          saveKey={this.handleKey.bind(this)}
                          source={api.system.getPublicPicUploadToken('banner_pic')}
                          onDrop={this.onDrop.bind(this, 'banner_pic')}
                          onUpload={this.onUpload.bind(this, 'banner_pic')}
                          style={{ width: '200px', height: '150px' }}
                        >
                          {this.renderImage('banner_pic', projectProgressStyle, {
                            width: '100%',
                            height: '140px',
                          })}
                        </Qiniu>
                      </div>
                    </Tooltip>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FormItem label="项目门市价" {...formItemLayout_12}>
                    {getFieldDecorator('sell_price', {
                      initialValue: Number(detail.sell_price).toFixed(2) || '',
                      rules: FormValidator.getRuleNotNull(),
                    })(
                      <Input
                        style={{ width: '210px' }}
                        type="number"
                        placeholder="请输入项目门市价"
                        addonAfter="元"
                      />,
                    )}
                    <div className="bargain-icon">
                      <Tooltip placement="topLeft" title="门市价是指项目在市场上的正常售价">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </div>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FormItem label="项目起始价" {...formItemLayout_12}>
                    {getFieldDecorator('start_price', {
                      initialValue: Number(detail.start_price).toFixed(2) || '',
                      rules: FormValidator.getRuleNotNull(),
                    })(
                      <Input
                        style={{ width: '210px' }}
                        type="number"
                        placeholder="请输入项目起始价"
                        addonAfter="元"
                      />,
                    )}
                    <div className="bargain-icon">
                      <Tooltip placement="topLeft" title="项目起始价是指砍价活动的起始金额，最大不得超过门市价">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </div>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FormItem label="项目底价" {...formItemLayout_12}>
                    {getFieldDecorator('min_price', {
                      initialValue: Number(detail.min_price).toFixed(2) || '',
                      rules: FormValidator.getRuleNotNull(),
                    })(
                      <Input
                        style={{ width: '210px' }}
                        type="number"
                        placeholder="请输入项目最低价"
                        addonAfter="元"
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FormItem label="砍价次数" {...formItemLayout_12}>
                    {getFieldDecorator('bargain_max_count', {
                      initialValue: detail.bargain_max_count,
                      rules: FormValidator.getRuleNotNull(),
                    })(
                      <Input
                        style={{ width: '210px' }}
                        type="number"
                        placeholder="建议砍价次数为5~20次"
                        addonAfter="次"
                      />,
                    )}
                    <div className="bargain-icon">
                      <Tooltip placement="topLeft" title="此砍价次数为最大砍价次数">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </div>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FormItem label="活动规则描述" {...formItemLayout_12}>
                    {getFieldDecorator('rule', {
                      initialValue: detail.rule,
                      rules: FormValidator.getRuleNotNull(),
                    })(
                      <TextArea
                        placeholder="请输入活动规则描述"
                        rows="4"
                        style={{ width: '340px' }}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="优惠项目介绍" {...formItemLayout_12} required>
                    <p className="text-gray-999">建议以图文形式介绍，最多可添加5组图文</p>
                    <p
                      className="text-gray-999"
                      style={{ lineHeight: '10px' }}
                    >
                      图片尺寸建议800像素*600像素，图片小于2M
                    </p>
                  </FormItem>

                  <div className="example">
                    <LargePicture />
                  </div>

                </Col>
              </Row>

              <div className="introduce-pic">
                {introducePics}
              </div>

              <Button
                className="pic-add-button"
                type="dashed"
                icon="plus"
                onClick={this.addIntroducePics}
              >
                添加
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

New = Form.create()(New);
export default New;
