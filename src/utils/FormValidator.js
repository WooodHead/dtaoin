import validator from './validator';

export default class FormValidator {

  /**
   * 表单非空校验规则
   * @param isRequired 是否必填
   * @return {[{
      required: isRequired,
      message: validator.required.notNull,
    }, {
      validator: FormValidator.notNull,
    }]}
   */
  static getRuleNotNull(isRequired = true) {
    return [{
      required: isRequired,
      message: validator.required.notNull,
    }, {
      validator: FormValidator.notNull,
    }];
  }

  /**
   * 表单非空校验规则
   * @param isRequired 是否必填
   * @return {[{
      required: isRequired,
      message: validator.required.phone,
    }, {
      validator: FormValidator.validatePhone,
    }]}
   */
  static getRulePhoneNumber(isRequired = true) {
    return [{
      required: isRequired,
      message: validator.required.phone,
    }, {
      validator: FormValidator.validatePhone,
    }];
  }

  /**
   * 表单非空校验规则
   * @param isRequired 是否必填
   * @return {[{
      required: isRequired,
      message: validator.required.phoneAndTel,
    }, {
      validator: FormValidator.validatePhoneOrTel(),
    }]}
   */
  static getRulePhoneOrTelNumber(isRequired = true) {
    return [{
      required: isRequired,
      message: validator.required.phoneAndTel,
    }, {
      validator: FormValidator.validatePhoneOrTel,
    }];
  }

  /**
   * 表单URL校验规则
   * @param isRequired 是否必填
   * @return {[{
      required: isRequired,
      message: validator.required.url,
    }, {
      validator: FormValidator.validateUrl,
    }]}
   */
  static getRuleUrl(isRequired = false) {
    return [{
      required: isRequired,
      message: validator.required.url,
    }, {
      validator: FormValidator.validateUrl,
    }];
  }

  /**
   * 表单项目名称校验规则
   * @param isRequired 是否必填
   * @return {[{
      required: isRequired,
      message: validator.required.itemName,
    }, {
      validator: FormValidator.validateItemName,
    }]}
   */
  static getRuleItemName(isRequired = true) {
    return [{
      required: isRequired,
      message: validator.required.itemName,
    }, {
      validator: FormValidator.validateItemName,
    }];
  }

  /**
   * 表单配件类型名称校验规则
   * @param isRequired 是否必填
   * @return {[{
      required: isRequired,
      message: validator.required.partTypeName
    }, {
      validator: FormValidator.validatePartTypeName
    }]}
   */
  static getRulePartTypeName(isRequired = true) {
    return [{
      required: isRequired,
      message: validator.required.partTypeName,
    }, {
      validator: FormValidator.validatePartTypeName,
    }];
  }

  /**
   * 表单配件名称校验规则
   * @param isRequired 是否必填
   * @return {[{
      required: isRequired,
      message: validator.required.partName
    }, {
      validator: FormValidator.validatePartName
    }]}
   */
  static getRulePartName(isRequired = true) {
    return [{
      required: isRequired,
      message: validator.required.partName,
    }, {
      validator: FormValidator.validatePartName,
    }];
  }

  /**
   * 表单配件类型名称校验规则
   * @param isRequired 是否必填
   * @return {[{
      required: isRequired,
      message: validator.required.partNo
    }, {
      validator: FormValidator.validatePartNo
    }]}
   */
  static getRulePartNo(isRequired = false) {
    return [{
      required: isRequired,
      message: validator.required.partNo,
    }, {
      validator: FormValidator.validatePartNo,
    }];
  }


  /**
   * 非空校验
   * @param rule
   * @param value 任意值
   * @param callback
   */
  static notNull(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.notNull(value)) {
        callback([new Error(validator.text.notNull)]);
      } else {
        callback();
      }
    }
  }

  /**
   * 手机号校验
   * @param rule
   * @param value 手机号
   * @param callback
   */
  static validatePhone(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.phone(value)) {
        callback([new Error(validator.text.phone)]);
      } else {
        callback();
      }
    }
  }

  /**
   * 手机号或电话号码校验
   * @param rule
   * @param value
   * @param callback
   */
  static validatePhoneOrTel(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (value.indexOf('-') > -1) {
        if (!validator.telephone(value)) {
          callback([new Error(validator.text.phoneOrTel)]);
        } else {
          callback();
        }
      } else {
        if (!validator.phone(value)) {
          callback([new Error(validator.text.phoneOrTel)]);
        } else {
          callback();
        }
      }
    }
  }

  /**
   * 身份证号码校验
   * @param rule
   * @param value
   * @param callback
   */
  static validateIdCard(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.idCard(value)) {
        callback([new Error(validator.text.idCard)]);
      } else {
        callback();
      }
    }
  }

  /**
   * 车牌号校验
   * @param rule
   * @param value
   * @param callback
   */
  static validatePlateNumber(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.plateNumber(value)) {
        callback([new Error(validator.text.plateNumber)]);
      } else {
        callback();
      }
    }
  }

  /**
   * URL地址
   * @param rule
   * @param value
   * @param callback
   */
  static validateUrl(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.url(value)) {
        callback([new Error(validator.text.url)]);
      } else {
        callback();
      }
    }
  }

  /**
   * 姓名校验
   * @param rule 长度为1-5之间，非数字
   * @param value
   * @param callback
   */
  static validateName(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.name(value)) {
        callback([new Error(validator.text.name)]);
      } else {
        callback();
      }
    }
  }

  static validateItemName(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.itemName(value)) {
        callback([new Error(validator.text.itemName)]);
      } else {
        callback();
      }
    }
  }

  static validatePartTypeName(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.partTypeName(value)) {
        callback([new Error(validator.text.partTypeName)]);
      } else {
        callback();
      }
    }
  }

  static validatePartName(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.partName(value)) {
        callback([new Error(validator.text.partName)]);
      } else {
        callback();
      }
    }
  }

  static validatePartNo(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!validator.partNo(value)) {
        callback([new Error(validator.text.partNo)]);
      } else {
        callback();
      }
    }
  }


}
