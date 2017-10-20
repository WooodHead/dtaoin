import React from 'react';
import {
  message,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Button,
  Collapse,
} from 'antd';
import Layout from '../../../utils/FormLayout';
import api from '../../../middleware/api';
import formatter from '../../../utils/DateFormatter';
import FormValidator from '../../../utils/FormValidator';
import validator from '../../../utils/validator';
import department from '../../../config/department';
import super_department from '../../../config/super_department';

const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

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
      'getUserDetail',
    ].map(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const { user } = this.props;
    if (Number(user.department) > 0) {
      this.getDepartmentRoles(user.department);
    }
    this.getUserDetail();
    // 暂时停用薪资组
    // this.getSalaryItems(user._id);
    // this.getSalaryGroups();
  }

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps;
    if (JSON.stringify(user) !== JSON.stringify(this.props.user)) {
      this.getDepartmentRoles(user.department || 1);
      this.setState({ user });
      this.props.form.setFieldsValue({ role: user.role });
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

      if (!!values.salary_groups) {
        values.salary_groups = values.salary_groups.join(',');
      } else {
        values.salary_groups = '';
      }

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
    this.props.form.setFieldsValue({ role: '' });
    this.getDepartmentRoles(departmentId);
  }

  handleRoleChange(role) {
    this.props.updateState({ roleId: role });
  }

  handleCheckboxChange(type, e) {
    this.setState({ [type]: e.target.checked });
  }

  handleSalaryGroupChange(groupId) {
    const { salaryGroups } = this.state;
    salaryGroups.map(group => {
      if (group._id === groupId) {
        this.setState({ subItems: group.items });
      }
    });
  }

  assembleShareObjects(formData) {
    const { subItems } = this.state;
    const salaryGroupItems = [];

    for (let i = 0; i < subItems.length; i++) {
      let idProp = `share_${i}_id`,
        valueProps = `share_${i}`;

      const shareObj = {
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
    const { isTax, isSocialSecurity, isProvidentFund } = this.state;
    isTax ? formData.is_tax = 1 : formData.is_tax = 0;
    isSocialSecurity ? formData.is_social_security = 1 : formData.is_social_security = 0;
    isProvidentFund ? formData.is_provident_fund = 1 : formData.is_provident_fund = 0;
    return formData;
  }

  getUserDetail() {
    const { user } = this.state;

    api.ajax({ url: api.user.getDetail(user._id) }, data => {
      const user = data.res.user_info;
      const salaryGroups = [];
      if (!!user.user_salary_groups) {
        user.user_salary_groups.map(item => {
          salaryGroups.push(String(item.group_id));
        });
      }
      this.setState({ salaryGroups });
    });
  }

  getSalaryGroups() {
    api.ajax({ url: api.user.getSalaryGroups() }, data => {
      this.setState({ salaryGroups: data.res.salary_groups });
    });
  }

  getSalaryItems(userId) {
    api.ajax({ url: api.user.getSalaryItems(userId) }, data => {
      this.setState({ subItems: data.res.user_salary_item_list });
    });
  }

  getDepartmentRoles(departmentId) {
    api.ajax({ url: api.user.getDepartmentRoles(departmentId) }, data => {
      const { roles } = data.res;
      this.setState({ roles });
      // if (roles.length > 0) {
      //   let firstRoleId = String(roles[0]._id);
      //   this.props.form.setFieldsValue({role: firstRoleId});
      //   this.props.updateState({roleId: firstRoleId});
      // }
    });
  }

  render() {
    const { formItemThree, formItemFour, formNoLabel, selectStyle } = Layout;
    const { getFieldDecorator } = this.props.form;

    const {
      user,
      roles,
      salaryGroups,
    } = this.state;

    const current_department = (api.getLoginUser().companyId === '1') ? super_department : department;

    return (
      <Form className="form-collapse">
        {getFieldDecorator('user_id', { initialValue: user._id })(
          <Input type="hidden" />,
        )}

        <Collapse defaultActiveKey={['1', '2']}>
          <Panel header="岗位及薪资信息" key="1">
            <Row>
              <Col span={12}>
                <FormItem label="入职时间" {...formItemThree} required>
                  {getFieldDecorator('hire_date', {
                    initialValue: String(user.hire_date.split('-')[0]) === '0000'
                      ? ''
                      : formatter.getMomentDate(user.hire_date),
                  })(
                    <DatePicker allowClear={false} />,
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
                    <Input />,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="部门" {...formItemThree} required>
                  {getFieldDecorator('department', {
                    initialValue: Number(user.department) === 0
                      ? ''
                      : String(user.department),
                  })(
                    <Select
                      onSelect={this.handleDepartmentChange}
                      {...selectStyle}
                    >
                      {current_department.map(dept => <Option key={dept.id}>{dept.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="职位" {...formItemThree} required>
                  {getFieldDecorator('role', {
                    initialValue: String(user.role) === '0' ? '' : String(user.role),
                    rules: FormValidator.getRuleNotNull(),
                    validateTrigger: 'onBlur',
                    onChange: this.handleRoleChange,
                  })(
                    <Select {...selectStyle} placeholder="请选择职位">
                      {roles.map(role => <Option key={role._id}>{role.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="固定工资" {...formItemThree} required>
                  {getFieldDecorator('base_salary', {
                    initialValue: user.base_salary,
                    rules: [
                      {
                        required: true,
                        message: validator.required.notNull,
                      },
                      { validator: FormValidator.notNull }],
                    validateTrigger: 'onBlur',
                  })(
                    <Input
                      addonAfter="元"
                      placeholder="请输入固定工资"
                    />,
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="薪资组" {...formItemThree}>
                  {getFieldDecorator('salary_groups', {
                    initialValue: salaryGroups,
                  })(
                    <Select
                      mode="multiple"
                      {...selectStyle}
                      placeholder="请选择薪资组"
                    >
                      <Option value="0">其它组</Option>
                      <Option value="1">洗车组</Option>
                      <Option value="2">维修组</Option>
                      <Option value="3">美容组</Option>
                      <Option value="4">销售组</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <div className="form-action-container">
          <Button size="large" type="primary" className="mr10"
                  onClick={this.handleSubmit}>提交</Button>
          <Button size="large" type="ghost" onClick={this.props.cancelModal}>取消</Button>
        </div>
      </Form>
    );
  }
}

EditPositionAndSalaryForm = Form.create()(EditPositionAndSalaryForm);
export default EditPositionAndSalaryForm;
