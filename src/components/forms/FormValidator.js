import validator from '../../middleware/validator'

export default class FormValidator {
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

}
