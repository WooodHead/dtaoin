import React from 'react';
import {message, Row, Col, Form, Input, DatePicker, Select, Checkbox, Button, Collapse} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';
import validator from '../../../utils/validator';
import department from '../../../config/department';
import super_department from '../../../config/super_department';

class EditPositionAndSalaryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirst: true,
      user: props.user || {},
      roles: [],
      salaryGroups: [],
      subItems: [],
    };

    [
      'handleSubmit',
      'handleDepartmentChange',
      'handleRoleChange',
      'handleSalaryGroupChange',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    let {user} = this.props;
    this.getDepartmentRoles(user.department);
    // 暂时停用薪资组
    // this.getSalaryItems(user._id);
    // this.getSalaryGroups();
  }

  componentWillReceiveProps(nextProps) {
    let {user} = nextProps;
    if (JSON.stringify(user) !== JSON.stringify(this.props.user)) {
      this.getDepartmentRoles(user.department);
      this.setState({user});
      this.props.form.setFieldsValue({role: user.role});
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error(validator.text.hasError);
        return;
      }

      values.hire_date = formatter.day(values.hire_date);
      // values = this.translateBooleanValue(values);
      // values.salary_group_items = JSON.stringify(this.assembleShareObjects(values));

      api.ajax({
        url: api.user.updateSalaryInfo(),
        type: 'POST',
        data: values,
      }, () => {
        message.success('更新成功!');
        this.props.onSuccess();
      }, error => {
        message.error(`更新失败[${error}]`);
      });
    });
  }

  handleDepartmentChange(departmentId) {
    this.props.form.setFieldsValue({'role': ''});
    this.getDepartmentRoles(departmentId);
  }

  handleRoleChange(role) {
    this.props.updateState({roleId: role});
  }

  handleCheckboxChange(type, e) {
    this.setState({[type]: e.target.checked});
  }

  handleSalaryGroupChange(groupId) {
    let {salaryGroups} = this.state;
    salaryGroups.map(group => {
      if (group._id === groupId) {
        this.setState({subItems: group.items});
      }
    });
  }

  assembleShareObjects(formData) {
    let {subItems} = this.state;
    let salaryGroupItems = [];

    for (let i = 0; i < subItems.length; i++) {
      let idProp = `share_${i}_id`,
        valueProps = `share_${i}`;

      let shareObj = {
        item_id: formData[idProp],
        share: formData[valueProps],
      };
      // delete useless data
      delete formData[idProp];
      delete formData[valueProps];

      salaryGroupItems.push(shareObj);
    }
    return salaryGroupItems;
  }

  translateBooleanValue(formData) {
    let {isTax, isSocialSecurity, isProvidentFund} = this.state;
    isTax ? formData.is_tax = 1 : formData.is_tax = 0;
    isSocialSecurity ? formData.is_social_security = 1 : formData.is_social_security = 0;
    isProvidentFund ? formData.is_provident_fund = 1 : formData.is_provident_fund = 0;
    return formData;
  }

  getSalaryGroups() {
    api.ajax({url: api.user.getSalaryGroups()}, (data) => {
      this.setState({salaryGroups: data.res.salary_groups});
    });
  }

  getSalaryItems(userId) {
    api.ajax({url: api.user.getSalaryItems(userId)}, (data) => {
      this.setState({subItems: data.res.user_salary_item_list});
    });
  }

  getDepartmentRoles(departmentId) {
    api.ajax({url: api.user.getDepartmentRoles(departmentId)}, (data) => {
      let {roles} = data.res;
      this.setState({roles});
      // if (roles.length > 0) {
      //   let firstRoleId = String(roles[0]._id);
      //   this.props.form.setFieldsValue({role: firstRoleId});
      //   this.props.updateState({roleId: firstRoleId});
      // }
    });
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const Panel = Collapse.Panel;
    const {formItemThree, formItemFour, formNoLabel, selectStyle} = Layout;
    const {getFieldDecorator} = this.props.form;

    let {
      user,
      isTax,
      isSocialSecurity,
      isProvidentFund,
      roles,
      salaryGroups,
      subItems,
    } = this.state;

    let current_department = (api.getLoginUser().companyId === '1') ? super_department : department;

    return (
      <Form className="form-collapse">
        {getFieldDecorator('user_id', {initialValue: user._id})(
          <Input type="hidden"/>
        )}

        <Collapse defaultActiveKey={['1', '2']}>
          <Panel header="岗位及薪资信息" key="1">
            <Row>
              <Col span={12}>
                <FormItem label="入职时间" {...formItemThree} required>
                  {getFieldDecorator('hire_date', {initialValue: formatter.getMomentDate(user.hire_date)})(
                    <DatePicker allowClear={false}/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="入职确认人" {...formItemThree} required>
                  {getFieldDecorator('hire_person', {
                    initialValue: user.hire_person,
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="部门" {...formItemThree} required>
                  {getFieldDecorator('department', {initialValue: user.department})(
                    <Select
                      onSelect={this.handleDepartmentChange}
                      {...selectStyle}
                    >
                      {current_department.map((dept) => <Option key={dept.id}>{dept.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="职位" {...formItemThree} required>
                  {getFieldDecorator('role', {
                    initialValue: String(user.role),
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                    onChange: this.handleRoleChange,
                  })(
                    <Select {...selectStyle} placeholder="请选择职位">
                      {roles.map(role => <Option key={role._id}>{role.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="固定工资" {...formItemThree} required>
                  {getFieldDecorator('base_salary', {
                    initialValue: user.base_salary,
                    rules: [{required: true, message: validator.required.notNull}, {validator: FormValidator.notNull}],
                    validateTrigger: 'onBlur',
                  })(
                    <Input
                      addonAfter="元"
                      placeholder="请输入固定工资"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            {false && (
              <Row>
                <Col span={12}>
                  <FormItem label="职位等级" {...formItemThree}>
                    {getFieldDecorator('level', {initialValue: user.level})(
                      <Select
                        {...selectStyle}
                        disabled={true}>
                        <Option key="1">T1</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="提成类型" {...formItemThree}>
                    {getFieldDecorator('salary_type', {initialValue: user.salary_type})(
                      <Select
                        {...selectStyle}
                        disabled={true}>
                        <Option key="1">销售提成</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            )}
          </Panel>

          {false && (
            <Panel header="薪资信息" key="2">
              <Row>
                <Col span={12}>
                  <FormItem label="固定工资" {...formItemThree} required>
                    {getFieldDecorator('base_salary', {
                      initialValue: user.base_salary,
                      rules: [{
                        required: true,
                        message: validator.required.notNull,
                      }, {validator: FormValidator.notNull}],
                      validateTrigger: 'onBlur',
                    })(
                      <Input
                        addonAfter="元"
                        placeholder="请输入固定工资"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={4} offset={2}>
                  <FormItem label={null} {...formNoLabel}>
                    {getFieldDecorator('is_tax', {
                      onChange: this.handleCheckboxChange.bind(this, 'isTax'),
                    })(
                      <Checkbox checked={isTax}>缴税</Checkbox>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label={null} {...formNoLabel}>
                    {getFieldDecorator('is_social_security', {
                      onChange: this.handleCheckboxChange.bind(this, 'isSocialSecurity'),
                    })(
                      <Checkbox
                        checked={isSocialSecurity}
                      >
                        缴纳社保
                      </Checkbox>
                    )}
                    {getFieldDecorator('social_security_base', {initialValue: user.social_security_base})(
                      <Input className={isSocialSecurity ? '' : 'hide'}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label={null} {...formNoLabel}>
                    {getFieldDecorator('is_provident_fund', {
                      onChange: this.handleCheckboxChange.bind(this, 'isProvidentFund'),
                    })(
                      <Checkbox checked={isProvidentFund}>
                        公积金
                      </Checkbox>
                    )}
                    {getFieldDecorator('provident_fund_base', {initialValue: user.provident_fund_base})(
                      <Input className={isProvidentFund ? '' : 'hide'}/>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row type="flex">
                <Col span={8}>
                  <FormItem label="薪资组" {...formItemThree} required>
                    {getFieldDecorator('salary_group', {
                      initialValue: user.salary_group,
                      rules: [{
                        required: true,
                        message: validator.required.notNull,
                      }, {validator: FormValidator.notNull}],
                      validateTrigger: 'onBlur',
                    })(
                      <Select
                        onSelect={this.handleSalaryGroupChange}
                        {...selectStyle}
                        placeholder="请选择薪资组">
                        {salaryGroups.map(group => <Option key={group._id}>{group.name}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>

              {
                subItems.map((item, index) => {
                  return (
                    <Row type="flex" key={item._id}>
                      <Col span={8}>
                        <FormItem label={`提成项目${index + 1}`} {...formItemFour}>
                          {getFieldDecorator(`share_${index}_id`, {initialValue: item.item_id || item._id})(
                            <p className="ant-form-text">
                              {item.item_name || item.name}
                            </p>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem label="提成占比" {...formItemFour}>
                          {getFieldDecorator(`share_${index}`, {initialValue: item.share || 0})(
                            <Input placeholder="提成占比"/>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  );
                })
              }
            </Panel>
          )}
        </Collapse>

        <div className="form-action-container">
          <Button size="large" type="primary" className="mr10" onClick={this.handleSubmit}>提交</Button>
          <Button size="large" type="ghost" onClick={this.props.cancelModal}>取消</Button>
        </div>
      </Form>
    );
  }
}

EditPositionAndSalaryForm = Form.create()(EditPositionAndSalaryForm);
export default EditPositionAndSalaryForm;
