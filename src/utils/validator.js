const validator = {
  pattern: {
    // phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
    phone: /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/,
    telephone: /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,8}/,
    phoneAndTel: /((0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}) | (\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/,
    // idCard: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
    idCard: /(^\d{17}([0-9]|X)$)/,
    number: /^\d*$/,       // 匹配正整数
    int: /^[1-9]\d*$/,　　 // 匹配正整数
    float: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/, // 匹配正浮点数
    positiveNumber: /^([1-9]\d*\.\d*|0\.\d+|[1-9]\d*|0)$/,   // 匹配正数
    enString: /^[a-zA-Z\']*$/,
    enStringNum: /^[a-zA-Z0-9\']*$/,
    url: /^https:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=!#]*)?$/,
    plateNumber: /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[A-Za-z0-9]{5}$/,
    partName: /^[\u4e00-\u9fa5a-zA-Z0-9-()]*$/,
    partTypeName: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
    partNo: /^[a-zA-Z0-9-/()=]*$/,
    itemName: /^[^+\/、,，]*$/,
    base64: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
  },
  text: {
    notNull: '请输入必填项目',
    notNullGreateZero: '请输入大于0数字项',
    name: '请输入正确的姓名',
    phone: '手机号码错误',
    phoneOrTel: '电话号码错误',
    idCard: '身份证号码错误',
    email: '邮箱格式错误',
    url: '请输入正确的网址, 例如: https://www.shuidao.com',
    plateNumber: '请输入正确的车牌号',
    itemName: '项目名称不能包含/+、等符号',
    partTypeName: '配件分类只能包含数字、字母和中文',
    partName: '配件名称只能包含数字、字母、中文、-、()',
    partNo: '配件号只能包含数字、字母、-、/、()、=',
    hasError: '填写的表单内容有误,请检查必填信息或数据格式',
  },
  required: {
    notNull: '必填项',
    notNullGreateZero: '请输入大于0数字项',
    name: '请输入姓名',
    phone: '请填写手机号码',
    phoneAndTel: '请填写手机或固话号码',
    idCard: '请填写身份证号码',
    email: '请填写邮箱地址',
    plateNumber: '请填写正确车牌号',
    partTypeName: '请填写配件分类名称',
    partName: '请填写配件名称',
    itemName: '请输入项目名称',
    url: '请填写正确链接',
  },
  validate(val, reg) {
    if (!reg) {
      return true;
    }
    return !!val && !!val.match(reg);
  },

  notNull (val) {
    return val.length > 0;
  },
  notNullGreateZero(val) {
    return val.length > 0 && Number(val) > 0;
  },
  name (val) {
    return val.length > 1 && val.length < 5 && !this.validate(val, this.pattern.number);
  },
  phone (val) {
    return this.validate(val, this.pattern.phone);
  },
  telephone (val) {
    return this.validate(val, this.pattern.telephone);
  },
  phoneOrTel (val) {
    return this.validate(val, this.pattern.phoneAndTel);
  },
  idCard (val) {
    return this.validate(val, this.pattern.idCard);
  },
  number (val) {
    return this.validate(val, this.pattern.number);
  },
  enNum (val) {
    return this.validate(val, this.pattern.enStringNum);
  },
  cnString(val) {
    return !this.validate(val, this.pattern.enString);
  },
  url (val) {
    return this.validate(val, this.pattern.url);
  },
  itemName (val) {
    return this.validate(val, this.pattern.itemName);
  },
  partTypeName (val) {
    return this.validate(val, this.pattern.partTypeName);
  },
  partName (val) {
    return this.validate(val, this.pattern.partName);
  },
  partNo (val) {
    return this.validate(val, this.pattern.partNo);
  },
  plateNumber (val) {
    return this.validate(val, this.pattern.plateNumber);
  },
};

export default validator;
