import React from 'react'
import {Row, Col, Modal, Icon, Button, Form, Input, Select, Radio} from 'antd'
import classNames from 'classnames'
import api from '../../../middleware/api'
import Layout from '../../forms/Layout'
import SearchMultipleBox from '../../search/SearchMultipleBox'
import BaseModalWithUpload from '../../base/BaseModalWithUpload'
import validator from '../../../middleware/validator'
import formatter from '../../../middleware/formatter'
import FormValidator from '../../../components/forms/FormValidator'
import Qiniu from '../../../middleware/UploadQiniu'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

let introducePicIndex = 0;

class EditItem extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      itemLevelIndex: this.props.item.levels.length,
      item: this.props.item,
      types: [],
      selectedPartTypes: this.props.item.part_types ? this.props.item.part_types.trim().split(',') : [],
      partTypes: this.props.item.part_type_list,
      quoteType: this.props.item.quote_type,
      intro_keys: [0],
      icon_pic_key: '',
      icon_pic_files: [],
      icon_pic_progress: {},
      banner_pic_key: '',
      banner_pic_files: [],
      banner_pic_progress: {},
      introduce_pics_0_key: '',
      introduce_pics_0_files: [],
      introduce_pics_0_progress: {},
    };
    [
      'editItem',
      'handleChange',
      'handleSelect',
      'addItemLevel',
      'handleSubmit',
      'handleRadioChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  editItem() {
    this.getMaintainItemTypes();

    let {item} = this.props;
    this.setState({
      icon_pic_key: item.icon_pic,
      banner_pic_key: item.banner_pic,
    });
    this.props.form.setFieldsValue({
      icon_pic: item.icon_pic,
      banner_pic: item.banner_pic,
    });

    if (item.icon_pic) {
      this.getImageUrl(api.system.getPublicPicUrl(item.icon_pic), 'icon_pic');
    }
    if (item.banner_pic) {
      this.getImageUrl(api.system.getPublicPicUrl(item.banner_pic), 'banner_pic');
    }
    this.getIntroducePics(item.introduce_pics);

    this.showModal();
  }

  handleSelect(data) {
    this.setState({selectedPartTypes: data});
  }

  handleChange(key) {
    api.ajax({url: api.warehouse.searchCategory(key)}, data => {
      this.setState({partTypes: data.res.list})
    })
  }

  addItemLevel() {
    const {form} = this.props;

    let keys = form.getFieldValue('keys');
    keys = keys.concat(this.state.itemLevelIndex);
    form.setFieldsValue({keys});

    this.setState({itemLevelIndex: this.state.itemLevelIndex + 1});
  }

  deleteItemLevel(key) {
    const {form} = this.props;

    let keys = form.getFieldValue('keys');
    if (keys.length > 1) {
      keys.splice(keys.indexOf(key), 1);

      form.setFieldsValue({keys});

      this.setState({itemLevelIndex: this.state.itemLevelIndex - 1});
    }
  }

  handleSubmit() {
    let formData = this.props.form.getFieldsValue();
    if (this.state.quoteType == 1) {
      let levels = [];
      for (let i = 0; i <= this.state.itemLevelIndex; i++) {
        let nameProp = `name_${i}`,
          priceProp = `price_${i}`;

        if (formData[nameProp]) {
          let level = {
            name: formData[nameProp],
            price: formData[priceProp],
          };
          levels.push(level);
        }

        delete formData[nameProp];
        delete formData[priceProp];
      }
      formData.levels = JSON.stringify(levels);
    }
    delete formData.keys;
    formData.part_types = this.state.selectedPartTypes.join(',');
    formData.introduce_pics = this.assembleIntroducePics(formData);

    api.ajax({
      url: api.maintain.editItem(),
      type: 'POST',
      data: formData
    }, data => {
      this.hideModal();
      location.hash = api.getHash();
    })
  }

  handleRadioChange(e) {
    this.setState({quoteType: e.target.value})
  }

  assembleIntroducePics(formData) {
    let pictures = [];
    let keys = formData.intro_keys;
    for (let i = 0; i < keys.length; i++) {
      let
        deleteProp = `introduce_pics_hide_${i}`,
        picKeyProp = `introduce_pics_${i}_key`;

      if (this.state[deleteProp]) {
        continue;
      }

      pictures.push(this.state[picKeyProp]);
    }
    delete formData.intro_keys;

    return pictures.join(',');
  }

  getMaintainItemTypes() {
    api.ajax({url: api.getMaintainItemTypes()}, data => {
      this.setState({types: data.res.type_list});
    })
  }

  getIntroducePics(introducePicIds) {
    let keys = [], stateObj = {};

    let ids = introducePicIds.split(',');
    if (ids.length > 0) {
      introducePicIndex = ids.length - 1;
      ids.map((id, index) => {
        keys.push(index);

        let picUrlProp = `introduce_pics_${index}`,
          picKeyProp = `introduce_pics_${index}_key`,
          picFilesProp = `introduce_pics_${index}_files`,
          picProgressProp = `introduce_pics_${index}_progress`;

        stateObj[picKeyProp] = id;
        stateObj[picFilesProp] = [];
        stateObj[picProgressProp] = {};
        this.setState(stateObj);

        if (id) {
          this.getImageUrl(api.system.getPublicPicUrl(id), picUrlProp);
        }
      });
    }

    this.setState({intro_keys: keys});
  }

  addIntroducePics() {
    introducePicIndex++;

    const {form} = this.props;

    let keys = form.getFieldValue('intro_keys');
    keys = keys.concat(introducePicIndex);
    form.setFieldsValue({intro_keys: keys});

    let keyProps = `introduce_pics_${introducePicIndex}_key`,
      filesProps = `introduce_pics_${introducePicIndex}_files`,
      progressProps = `introduce_pics_${introducePicIndex}_progress`;
    this.setState({
      [keyProps]: '',
      [filesProps]: [],
      [progressProps]: {}
    });
  }

  removeIntroducePics(k) {
    let hideProp = `introduce_pics_hide_${k}`;
    this.setState({[hideProp]: true});
  }

  render() {
    const {formItemLayout, formItemFour, selectStyle} = Layout;
    const {getFieldProps, getFieldValue} = this.props.form;
    const {visible, types, item, quoteType, intro_keys} = this.state;
    if (item.levels == "") {
      item.levels = [{'name': '', 'price': ''}];
    }

    let initKeys = [];
    for (var i = 0; i < item.levels.length; i++) {
      initKeys.push(i);
    }

    const nameProps = getFieldProps('name', {
      initialValue: this.state.item.name,
      validate: [{
        rules: [{validator: FormValidator.validateItemName}],
        trigger: ['onBlur', 'onChange']
      }, {
        rules: [{required: true, message: validator.required.itemName}],
        trigger: ['onBlur', 'onChange']
      }]
    });

    getFieldProps('keys', {
      initialValue: initKeys
    });

    const itemLevelElements = getFieldValue('keys').map((k) => {
      return (
        <Row key={k}>
          <Col span="12">
            <FormItem label={`项目档次${k + 1}`} labelCol={{span: 12}} wrapperCol={{span: 12}}>
              <Input {...getFieldProps(`name_${k}`, {initialValue: (k >= item.levels.length) ? '' : item.levels[k].name})}/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="工时单价" labelCol={{span: 8}} wrapperCol={{span: 14}}>
              <Input
                type="number"
                {...getFieldProps(`price_${k}`, {initialValue: (k >= item.levels.length) ? '' : item.levels[k].price})}
                addonAfter="元"
                min={0}
                placeholder="请输入工时单价"
              />
            </FormItem>
          </Col>
          <Col span="5">
            <div>
              <a href="javascript:;" onClick={this.deleteItemLevel.bind(this, k)}>
                <Icon type="minus-circle-o"/>
                <span>删除档次</span>
              </a>
            </div>
          </Col>
        </Row>
      );
    });

    const itemLevelContainer = classNames({
      'hide': this.state.quoteType == 0
    });

    // intro pics
    getFieldProps('intro_keys', {initialValue: intro_keys});
    const introducePics = getFieldValue('intro_keys').map((k) => {
      let hideProp = `introduce_pics_hide_${k}`;

      return (
        <Row className={this.state[hideProp] ? 'hide' : ''} key={k}>
          <Col span="12">
            <FormItem label="项目介绍" {...formItemFour} help="尺寸: 1080*1800px">
              <Qiniu prefix={`introduce_pics_${k}`}
                     saveKey={this.handleKey.bind(this)}
                     source={api.system.getPublicPicUploadToken('introduce_pics')}
                     onDrop={this.onDrop.bind(this, `introduce_pics_${k}`)}
                     onUpload={this.onUpload.bind(this, `introduce_pics_${k}`)}>
                {this.renderImage(`introduce_pics_${k}`)}
              </Qiniu>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem {...formItemFour}>
              {k === 0 ?
                <Button size="small" type="primary" icon="plus" onClick={() => this.addIntroducePics(k)}>添加</Button>
                :
                <Button size="small" type="ghost" icon="minus" onClick={() => this.removeIntroducePics(k)}>删除</Button>
              }
            </FormItem>
          </Col>
        </Row>
      );
    });

    return (
      <span>
        <Button
          type="primary"
          size="small"
          disabled={this.props.disabled}
          className="margin-left-20"
          onClick={this.editItem}>
          编辑
        </Button>
        <Modal
          title={<span><Icon type="edit" className="margin-right-10"/>编辑项目</span>}
          visible={visible}
          width="680px"
          onOk={this.handleSubmit}
          onCancel={this.hideModal}>

          <Form horizontal>
            <Input type="hidden" {...getFieldProps('_id', {initialValue: item._id})}/>

            <FormItem label="项目名称" {...formItemLayout}>
              <Input {...nameProps} placeholder="请输入项目名称"/>
            </FormItem>

            <FormItem label="产值类型" {...formItemLayout}>
              <Select
                {...getFieldProps('maintain_type', {initialValue: this.state.item.maintain_type})}
                {...selectStyle}
                placeholder="请选择产值类型">
                {this.state.types.map(type => <Option key={type._id}>{type.name}</Option>)}
              </Select>
            </FormItem>

            <FormItem label="关联配件分类" {...formItemLayout}>
              <SearchMultipleBox
                data={this.state.partTypes}
                defaultValue={this.state.selectedPartTypes}
                change={this.handleChange}
                select={this.handleSelect}
                placeholder="请输入配件分类"
              />
            </FormItem>

            <Row>
              <Col span="14">
                <FormItem label="报价方式" {...formItemLayout}>
                  <RadioGroup {...getFieldProps('quote_type', {
                    initialValue: parseInt(item.quote_type) || 0,
                    onChange: this.handleRadioChange
                  })}>
                    <Radio key="0" value={0}>现场报价</Radio>
                    <Radio key="1" value={1}>预设报价</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="顺序" {...formItemLayout} help="数值越大越靠前"  labelCol={{span: 4}} wrapperCol={{span: 10}}>
                  <Input {...getFieldProps('order', {initialValue: item.order})} />
                </FormItem>
              </Col>
            </Row>

            <div className={itemLevelContainer}>
              {itemLevelElements}

              <Row className="mb15">
                <Col span={12} offset={6}>
                  <a href="javascript:;" onClick={this.addItemLevel}>
                    <Icon type="plus-circle-o"/>
                    <span>添加项目档次</span>
                  </a>
                </Col>
              </Row>
            </div>

            <Row type="flex">
              <Col span="12">
                <FormItem label="项目封面" {...formItemFour} help="尺寸: 360*240px">
                  <Input type="hidden" {...getFieldProps('icon_pic')} />
                  <Qiniu prefix="icon_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.system.getPublicPicUploadToken('icon_pic')}
                         onDrop={this.onDrop.bind(this, 'icon_pic')}
                         onUpload={this.onUpload.bind(this, 'icon_pic')}>
                    {this.renderImage('icon_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
            </Row>

            <Row type="flex">
              <Col span="12">
                <FormItem label="banner图" {...formItemFour} help="尺寸: 1080*480px">
                  <Input type="hidden" {...getFieldProps('banner_pic')} />
                  <Qiniu prefix="banner_pic"
                         saveKey={this.handleKey.bind(this)}
                         source={api.system.getPublicPicUploadToken('banner_pic')}
                         onDrop={this.onDrop.bind(this, 'banner_pic')}
                         onUpload={this.onUpload.bind(this, 'banner_pic')}>
                    {this.renderImage('banner_pic')}
                  </Qiniu>
                </FormItem>
              </Col>
            </Row>

            {introducePics}

          </Form>
        </Modal>
      </span>
    );
  }
}

EditItem = Form.create()(EditItem);
export default EditItem
