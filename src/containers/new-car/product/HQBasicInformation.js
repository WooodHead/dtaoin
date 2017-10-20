import React from 'react';
import {
  message,
  Modal,
  Icon,
  Row,
  Col,
  Select,
  Button,
  Form,
  Input,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Upload,
  Tooltip,
} from 'antd';

const InputGroup = Input.Group;
import api from '../../../middleware/api';
import validator from '../../../utils/validator';
import BaseModal from '../../../components/base/BaseModal';
import FormValidator from '../../../utils/FormValidator';
import Layout from '../../../utils/FormLayout';
import HQAddResource from './HQAddResource';
import Qiniu from '../../../components/widget/UploadQiniu';
import formatter from '../../../utils/DateFormatter';
import UploadComponent from '../../../components/base/BaseUpload';

const upLoad = require('../../../images/upLoad.png');
const FormItem = Form.Item;
const Option = Select.Option;

let productPicIndex = 0;
let applicationPicIndex = 0;

class HQBasicInformation extends UploadComponent {
  constructor(props) {
    super(props);
    this.state = {
      productKeys: [0],
      applicationKeys: [0],
      loading: false,
      visible: false,
      previewVisible: false,
      previewImage: '',
      getMarketListData: [],
      fileList: [
        {
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
    };
    [
      'addProductPics',
      'addApplicationPics',
      'assembleProductPics',
      'assembleApplicationPics',
      'removeProductPics',
      'removeApplicationPics',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const typeValue = this.props.typeValue;
    const getMarketListData = this.props.getMarketListData;
    this.setState({
      getMarketListData,
      typeValue,
    });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };
  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  };
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.product_pics = this.assembleProductPics(values).join(',');
        values.process_pics = this.assembleApplicationPics(values).join(',');

        const isPicComplete = !values.product_pics || !values.process_pics ||
          values.product_pics.endsWith(',') || values.process_pics.endsWith(',');

        if (isPicComplete) {
          message.error('请上传图片');
          return false;
        }

        this.props.post_markertProductCreate(values);
      }
    });
  };

  addProductPics() {
    const { introduceCount } = this.state;
    if (Number(introduceCount) === 5) {
      message.error('最多只能添加5张介绍图片');
      return false;
    }
    productPicIndex++;

    const currentIntroduceCount = introduceCount + 1;

    const { form } = this.props;

    let productKeys = form.getFieldValue('productKeys');
    productKeys = productKeys.concat(productPicIndex);
    form.setFieldsValue({ productKeys });

    const keyProps = `product_pics_${productPicIndex}_key`;
    const filesProps = `product_pics_${productPicIndex}_files`;
    const progressProps = `product_pics_${productPicIndex}_progress`;

    this.setState({
      [keyProps]: '',
      [filesProps]: [],
      [progressProps]: {},
      introduceCount: currentIntroduceCount,
    });
  }

  addApplicationPics() {
    const { introduceCount } = this.state;
    if (Number(introduceCount) === 5) {
      message.error('最多只能添加5张介绍图片');
      return false;
    }
    applicationPicIndex++;

    const currentIntroduceCount = introduceCount + 1;

    const { form } = this.props;

    let applicationKeys = form.getFieldValue('applicationKeys');
    applicationKeys = applicationKeys.concat(applicationPicIndex);
    form.setFieldsValue({ applicationKeys });

    const keyProps = `application_pics_${applicationPicIndex}_key`;
    const filesProps = `application_pics_${applicationPicIndex}_files`;
    const progressProps = `application_pics_${applicationPicIndex}_progress`;

    this.setState({
      [keyProps]: '',
      [filesProps]: [],
      [progressProps]: {},
      introduceCount: currentIntroduceCount,
    });
  }

  removeProductPics(k) {
    const { introduceCount } = this.state;

    const currentIntroduceCount = introduceCount - 1;

    this.setState({ introduceCount: currentIntroduceCount }, () => {
      if (Number(currentIntroduceCount) === 0) {
        this.addProductPics();
      }
      const hideProp = `product_pics_hide_${k}`;
      this.setState({ [hideProp]: true });
    });
  }

  removeApplicationPics(k) {
    const { introduceCount } = this.state;

    const currentIntroduceCount = introduceCount - 1;

    this.setState({ introduceCount: currentIntroduceCount }, () => {
      if (Number(currentIntroduceCount) === 0) {
        this.addApplicationPics();
      }
      const hideProp = `application_pics_hide_${k}`;
      this.setState({ [hideProp]: true });
    });
  }

  assembleProductPics(formData) {
    const pictures = [];
    const productKeys = formData.productKeys;
    for (let i = 0; i < productKeys.length; i++) {
      const deleteProp = `product_pics_hide_${i}`;
      const picKeyProp = `product_pics_${i}_key`;

      if (this.state[deleteProp]) {
        continue;
      }
      pictures.push(this.state[picKeyProp]);
    }
    delete formData.productKeys;
    return pictures;
  }

  assembleApplicationPics(formData) {
    const pictures = [];
    const applicationKeys = formData.applicationKeys;
    for (let i = 0; i < applicationKeys.length; i++) {
      const deleteProp = `application_pics_hide_${i}`;
      const picKeyProp = `application_pics_${i}_key`;

      if (this.state[deleteProp]) {
        continue;
      }
      pictures.push(this.state[picKeyProp]);
    }
    delete formData.productKeys;
    return pictures;
  }

  change_resource = value => {
    if (this.props.postMarkertResourceCreateRes) {
      this.props.form.setFieldsValue({ resource_id: String(this.props.postMarkertResourceCreateRes) });
    }
    this.props.get_marketMaterialListData(value);
  };
  componentWillReceiveProps(propsNew) {
    if (propsNew.postMarkertResourceCreateRes !== '' || undefined) {
      if (this.props.postMarkertResourceCreateRes !== propsNew.postMarkertResourceCreateRes) {
        this.props.form.setFieldsValue({ resource_id: String(propsNew.postMarkertResourceCreateRes) });
      }
    }
  }
  render() {
    const { postMarkertResourceCreateRes, postMarkertPeditRiskRes } = this.props;
    const getMarketListDataList = this.props.getMarketListData.list;
    const { formItemLayout } = Layout;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { visible, previewVisible, previewImage, fileList, productKeys, applicationKeys } = this.state;
    const rouceList = [];
    if (getMarketListDataList) {
      for (let i = 0; i < getMarketListDataList.length; i++) {
        rouceList.push(<Select.Option key={getMarketListDataList[i]._id}
                                      value={getMarketListDataList[i]._id}>{getMarketListDataList[i].name}</Select.Option>);
      }
    }
    const uploadButton = (
      <div className="imgUploadButton">
        <p className="">
          <img src={upLoad} alt="上传图片" />
        </p>
        <p className="antUploadText">点击上传</p>
        <p className="antUploadHint"> 建议图片小于1M</p>
      </div>
    );

    getFieldDecorator('productKeys', { initialValue: productKeys });
    getFieldDecorator('applicationKeys', { initialValue: applicationKeys });

    const introduceProgressStyle = {
      position: 'absolute',
      left: '46px',
      top: '126px',
      zIndex: '10',
      width: '100px',
      color: '#87d068',
    };

    const productPics = getFieldValue('productKeys').map(k => {
      const hideProp = `product_pics_hide_${k}`;
      return (
        <div className={this.state[hideProp] ? 'hide' : 'new-car-product-pic'} key={k}>
          <Tooltip placement="top" title="双击添加或更换图片">
            <div>
              <Qiniu
                prefix={`product_pics_${k}`}
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('product_pics')}
                onDrop={this.onDrop.bind(this, `product_pics_${k}`)}
                onUpload={this.onUpload.bind(this, `product_pics_${k}`)}
                style={{ width: '167px', height: '126px' }}
              >
                {this.renderImage(`product_pics_${k}`, introduceProgressStyle, {
                  height: '120px',
                  width: '100%',
                })}
              </Qiniu>
            </div>
          </Tooltip>
          <a
            href="javascript:;"
            className="mt10"
            onClick={() => this.removeProductPics(k)}
          >
            删除
          </a>
        </div>
      );
    });

    const applicationPics = getFieldValue('applicationKeys').map(k => {
      const hideProp = `application_pics_hide_${k}`;
      return (
        <div className={this.state[hideProp] ? 'hide' : 'new-car-product-pic'} key={k}>
          <Tooltip placement="top" title="双击添加或更换图片">
            <div>
              <Qiniu
                prefix={`application_pics_${k}`}
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('application_pics')}
                onDrop={this.onDrop.bind(this, `application_pics_${k}`)}
                onUpload={this.onUpload.bind(this, `application_pics_${k}`)}
                style={{ width: '167px', height: '126px' }}
              >
                {this.renderImage(`application_pics_${k}`, introduceProgressStyle, {
                  height: '120px',
                  width: '100%',
                })}
              </Qiniu>
            </div>
          </Tooltip>
          <a
            href="javascript:;"
            className="mt10"
            onClick={() => this.removeApplicationPics(k)}
          >
            删除
          </a>
        </div>
      );
    });

    return (
      <div className="hqbasicInfor">
        <Form onSubmit={this.handleSubmit} style={{ marginTop:40 }}>
          <FormItem
            label="产品名称"
            {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: FormValidator.getRuleNotNull(),
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入产品名称" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="资源方"
          >
            <Row>
              <Col span={19}>
                {getFieldDecorator('resource_id', {
                  rules: FormValidator.getRuleNotNull(),
                  validateTrigger: 'onBlur',
                  onChange: this.change_resource,
                  initialValue: postMarkertResourceCreateRes == ''
                    ? <span style={{ color:'#d9d9d9' }}>请选择资源方</span>
                    : String(postMarkertResourceCreateRes),
                })(
                  <Select placeholder="请选择类型"
                          size="large"
                  >
                    {rouceList}
                  </Select>,
                )}
              </Col>
              <Col span={4} offset={1}>
                <HQAddResource
                  post_markertResourceCreate={this.props.post_markertResourceCreate}
                  get_marketList={this.props.get_marketList}
                />
              </Col>
            </Row>

          </FormItem>
          <FormItem label="资源方产品" {...formItemLayout}>
            {getFieldDecorator('resource_product_name', {
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入产品名称" />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="融资类型"

          >
            {getFieldDecorator('type', {
              rules: FormValidator.getRuleNotNull(),
              initialValue: this.props.typeValue,
            })(
              <Select placeholder="请选择融资类型" disabled
              >
                <Select.Option value="1">固定首尾付类型</Select.Option>
                <Select.Option value="2">贷款分期</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="牌照所属"

          >
            {getFieldDecorator('plate_type', {
              rules: FormValidator.getRuleNotNull(),
              validateTrigger: 'onBlur',
            })(
              <Select placeholder="请选择牌照所属">
                <Select.Option value="1">公司户</Select.Option>
                <Select.Option value="2">个人户</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="推荐理由" {...formItemLayout}>
            {getFieldDecorator('introduce', {
              rules: FormValidator.getRuleNotNull(),
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="建议15个字以内，例如：新车含购置税和保险" />,
            )}
          </FormItem>
          <FormItem label="注意事项" {...formItemLayout}>
            {getFieldDecorator('attention', {
              rules: FormValidator.getRuleNotNull(),
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="建议15个字以内，例如：公司户，且需要保证金" />,
            )}
          </FormItem>
          <div className="product-pic">
            <FormItem
              label="产品详情"
              required
              {...formItemLayout}
            >
              {productPics}
              <Button
                type="dashed"
                icon="plus"
                onClick={this.addProductPics}
                style={{ width: '170px', height: '127px' }}
              >
                添加
              </Button>
            </FormItem>
          </div>


          <div className="application-pic">
            <FormItem
              label="申请流程"
              required
              {...formItemLayout}
            >
              {applicationPics}
              <Button
                type="dashed"
                icon="plus"
                onClick={this.addApplicationPics}
                style={{ width: '170px', height: '127px' }}
              >
                添加
              </Button>
            </FormItem>
          </div>
          <FormItem {...formItemLayout}>
            <Row type="flex" justify="center">
              <Col span={4}><Button type="primary" htmlType="submit">下一步</Button></Col>
            </Row>
          </FormItem>
        </Form>
      </div>
    );
  }
}

HQBasicInformation = Form.create()(HQBasicInformation);
export default HQBasicInformation;
