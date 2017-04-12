import React from 'react';
import {message, Row, Col, Modal, Icon, Button, Form, Input, Select, Switch, Tabs} from 'antd';

import classNames from 'classnames';
import Layout from '../../utils/FormLayout';
import SearchMultipleBox from '../../components/search/SearchMultipleBox';
import BaseModalWithUpload from '../../components/base/BaseModalWithUpload';
import FormValidator from '../../utils/FormValidator';

import api from '../../middleware/api';
import Qiniu from '../../components/widget/UploadQiniu';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

let levelIndex = 0;

class Edit extends BaseModalWithUpload {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      itemLevelIndex: (props.item && props.item.levels) ? JSON.parse(props.item.levels).length : 0,
      item: props.item || {},
      types: [],
      selectedPartTypes: (props.item && props.item.part_types) ? props.item.part_types.trim().split(',') : [],
      partTypes: props.item ? props.item.part_type_list : [],
      quoteType: props.item ? props.item.quote_type : 0,
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
      isAppShow: props.item ? props.item.is_show_on_app : false,
    };
    [
      'editItem',
      'handleChange',
      'handleSelect',
      'addItemLevel',
      'handleSubmit',
      'handleQuoteTypeChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    let isAppShow = nextProps.form.getFieldValue('is_show_on_app') !== false;
    this.setState({isAppShow});
  }

  editItem() {
    this.getMaintainItemTypes();

    let {item} = this.props;
    if (item) {
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
    }

    this.showModal();
  }

  handleSelect(data) {
    this.setState({selectedPartTypes: data});
  }

  handleChange(key) {
    api.ajax({url: api.warehouse.category.search(key)}, data => {
      this.setState({partTypes: data.res.list});
    });
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
    let {item} = this.state;

    formData.quote_type = formData.quote_type ? '1' : '0';
    formData.is_show_on_app = formData.is_show_on_app ? '1' : '0';

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
      url: item._id ? api.maintainItem.edit() : api.maintainItem.add(),
      type: 'POST',
      data: formData,
    }, data => {
      item._id ? message.success('编辑成功！') : message.success('添加成功！');
      this.props.onSuccess(data.res.item);
      this.hideModal();
    }, () => {
      item._id ? message.success('编辑失败！') : message.success('添加失败！');
    });
  }

  handleQuoteTypeChange(isUse) {
    this.setState({quoteType: isUse ? '1' : '0'});
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
    api.ajax({url: api.aftersales.getMaintainItemTypes()}, data => {
      this.setState({types: data.res.type_list});
    });
  }

  getIntroducePics(introducePicIds) {
    let keys = [], stateObj = {};

    let ids = introducePicIds.split(',');
    if (ids.length > 0) {
      levelIndex = ids.length - 1;
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
    levelIndex++;

    const {form} = this.props;

    let keys = form.getFieldValue('intro_keys');
    keys = keys.concat(levelIndex);
    form.setFieldsValue({intro_keys: keys});

    let keyProps = `introduce_pics_${levelIndex}_key`,
      filesProps = `introduce_pics_${levelIndex}_files`,
      progressProps = `introduce_pics_${levelIndex}_progress`;
    this.setState({
      [keyProps]: '',
      [filesProps]: [],
      [progressProps]: {},
    });
  }

  removeIntroducePics(k) {
    let hideProp = `introduce_pics_hide_${k}`;
    this.setState({[hideProp]: true});
  }

  render() {
    const {formItemLayout, selectStyle, formItem_814Half, formItem_814} = Layout;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {visible, item, intro_keys} = this.state;
    const {disabled, size} = this.props;

    let itemLevels;
    try {
      itemLevels = JSON.parse(item.levels);
    } catch (e) {
      itemLevels = [];
    }
    let initKeys = [];
    for (let i = 0; i < itemLevels.length; i++) {
      initKeys.push(i);
    }

    getFieldDecorator('keys', {
      initialValue: initKeys,
    });
    let keys = getFieldValue('keys');

    const itemLevelElements = getFieldValue('keys').map((k) => {
      return (
        <Row key={k}>
          <Col span={12}>
            <FormItem label={`项目档次${k + 1}`} {...formItemLayout}>
              {getFieldDecorator(`name_${k}`, {initialValue: (k >= itemLevels.length) ? '' : itemLevels[k].name})(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem label="工时单价" {...formItemLayout}>
              {getFieldDecorator(`price_${k}`, {initialValue: (k >= itemLevels.length) ? '' : itemLevels[k].price})(
                <Input
                  type="number"
                  addonAfter="元"
                  min={0}
                  placeholder="请输入工时单价"
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={this.deleteItemLevel.bind(this, k)}
            />
          </Col>
        </Row>
      );
    });

    const itemLevelContainer = classNames({
      'hide': String(this.state.quoteType) === '0',
    });

    const picContainer = classNames({
      'hide': !this.state.isAppShow,
    });

    // intro pics
    getFieldDecorator('intro_keys', {initialValue: intro_keys});
    const introducePics = getFieldValue('intro_keys').map((k) => {
      let hideProp = `introduce_pics_hide_${k}`;

      return (
        <Row className={this.state[hideProp] ? 'hide' : ''} key={k}>
          <Col span={12}>
            <FormItem label="项目介绍" labelCol={{span: 12}} wrapperCol={{span: 12}} help="尺寸: 1080*1800px">
              <Qiniu
                prefix={`introduce_pics_${k}`}
                saveKey={this.handleKey.bind(this)}
                source={api.system.getPublicPicUploadToken('introduce_pics')}
                onDrop={this.onDrop.bind(this, `introduce_pics_${k}`)}
                onUpload={this.onUpload.bind(this, `introduce_pics_${k}`)}
              >
                {this.renderImage(`introduce_pics_${k}`)}
              </Qiniu>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{span: 12}} wrapperCol={{span: 12}}>
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

    let tabPaneOne = (
      <TabPane tab="基本信息" key="1">
        {getFieldDecorator('_id', {initialValue: item._id})(
          <Input type="hidden"/>
        )}

        <Row>
          <Col span={24}>
            <FormItem label="项目名称" {...formItem_814Half}>
              {getFieldDecorator('name', {
                initialValue: this.props.inputValue ? this.props.inputValue : this.state.item.name,
                rules: FormValidator.getRuleItemName(),
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入项目名称"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="产值类型" {...formItem_814}>
              {getFieldDecorator('maintain_type', {initialValue: this.state.item.maintain_type})(
                <Select{...selectStyle} placeholder="请选择产值类型">
                  {this.state.types.map(type => <Option key={type._id}>{type.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="顺序" {...formItem_814} help="数值越大越靠前">
              {getFieldDecorator('order', {initialValue: item.order})(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label="关联配件分类" {...formItem_814Half}>
              <SearchMultipleBox
                data={this.state.partTypes}
                defaultValue={this.state.selectedPartTypes}
                change={this.handleChange}
                select={this.handleSelect}
                placeholder="请输入配件分类"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label="预设报价" {...formItem_814Half}>
              {getFieldDecorator('quote_type', {
                valuePropName: 'checked',
                initialValue: item.quote_type === '1' || false,
                onChange: this.handleQuoteTypeChange,
              })(
                <Switch checkedChildren={'启用'} unCheckedChildren={'停用'}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <div className={itemLevelContainer}>
          {itemLevelElements}
          <Row>
            <Col span={6} offset={3}>
              <Button type="dashed" onClick={this.addItemLevel} style={{width: '100%'}}>
                <Icon type="plus"/> 添加项目档次
              </Button>
            </Col>
          </Row>
        </div>
      </TabPane>
    );

    let tabPaneTwo = (
      <TabPane tab="客户端设置" key="2">
        <FormItem label="客户端展示" {...formItemLayout}>
          {getFieldDecorator('is_show_on_app', {
            valuePropName: 'checked',
            initialValue: item.is_show_on_app === '1' || false,
          })(
            <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
          )}
        </FormItem>

        <div className={picContainer}>
          <FormItem label="项目封面" {...formItemLayout} help="尺寸: 360*240px">
            {getFieldDecorator('icon_pic')(
              <Input type="hidden"/>
            )}
            <Qiniu
              prefix="icon_pic"
              saveKey={this.handleKey.bind(this)}
              source={api.system.getPublicPicUploadToken('icon_pic')}
              onDrop={this.onDrop.bind(this, 'icon_pic')}
              onUpload={this.onUpload.bind(this, 'icon_pic')}
            >
              {this.renderImage('icon_pic')}
            </Qiniu>
          </FormItem>

          <FormItem label="banner图" {...formItemLayout} help="尺寸: 1080*480px">
            {getFieldDecorator('banner_pic')(
              <Input type="hidden"/>
            )}
            <Qiniu
              prefix="banner_pic"
              saveKey={this.handleKey.bind(this)}
              source={api.system.getPublicPicUploadToken('banner_pic')}
              onDrop={this.onDrop.bind(this, 'banner_pic')}
              onUpload={this.onUpload.bind(this, 'banner_pic')}
            >
              {this.renderImage('banner_pic')}
            </Qiniu>
          </FormItem>

          {introducePics}
        </div>
      </TabPane>
    );

    return (
      <span>
        {
          size === 'small' ?
            disabled ?
              <span className="text-gray">编辑</span> :
              <a href="javascript:;" onClick={this.editItem}>编辑</a> :
            <Button
              type="primary"
              onClick={this.editItem}
              style={{position: 'relative', left: '95px'}}
            >
              创建项目
            </Button>
        }

        <Modal
          title={<span><Icon type="edit"/> 编辑项目</span>}
          visible={visible}
          width={720}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        >
          <Form>
            <Tabs defaultActiveKey="1">
              {tabPaneOne}
              {
                api.isSuperAdministrator() ?
                  tabPaneTwo :
                  ''
              }
            </Tabs>
          </Form>
        </Modal>
      </span>
    );
  }
}

Edit = Form.create()(Edit);
export default Edit;
