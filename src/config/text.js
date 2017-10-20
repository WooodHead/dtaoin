const CommonText = {
  // 全局通用
  routeType: {
    0: '路由',
    1: '模态框',
    2: '授权',
  },
  autoLogin: {
    0: '未注册',
    1: '已注册',
  },
  memberCardStatus: {
    0: '启用中',
    1: '未启用',
  },
  memberCardSale: {
    0: '未结算',
    1: '已结算',
  },
  companyType: {
    0: '未知',
    1: '社区店',
    2: '综合售后店',
    3: '销售服务店',
    4: '综合服务店',
  },
  systemType: {
    0: '未知',
    1: '基础版',
    2: '标准版',
    3: '高级版',
    4: 'MC版',
    5: '销售版',
    6: '基础版+销售版',
    7: '标准版+销售版',
    8: '高级版+销售版',
    9: 'MC版+销售版',
  },
  cooperationType: {
    0: '未知',
    1: 'FC友情合作店',
    2: 'MC重要合作店',
    3: 'AP高级合伙店',
    4: 'TP顶级合伙店',
  },
  technicianStatus: {
    '-1': '已封禁',
    0: '待认证',
    1: '已认证',
    2: '已驳回',
    3: '审核中',
  },

  // 提醒
  task: {
    dueDateMin: {
      '-1': '0-30',
      0: '0-15',
      1: '16-30',
    },
    dueDate: {
      '-1': '0-45',
      0: '0-30',
      1: '30-45',
    },
    action: {
      0: '开始',
      1: '跟进',
      2: '详情',
    },
  },

  department: {
    0: '--',
    1: '总经办',
    2: '售前',
    3: '售后',
  },

  balancePayments: {
    0: '收入',
    1: '支出',
  },
  payType: {
    1: '银行转账',
    2: '现金支付',
    3: '微信支付',
    4: '支付宝支付',
  },
  taskState: {
    0: '未跟进',
    1: '进行中',
    2: '已完成',
  },
  couponType: {
    1: '计次',
    2: '折扣',
    3: '立减',
  },
  couponActivityStatus: {
    0: '待开始',
    1: '活动中',
    2: '已结束',
  },
  useStatus: {
    0: '启用',
    1: '停用',
  },
  prizeStatus: {
    0: '未兑奖',
    1: '已兑奖',
  },
  partStatus: {
    '-1': '停用',
    0: '启用',
  },
  week: {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
  },
  maintenanceCar: {
    '-1': '已作废',
    0: '服务中',
    1: '已完工',
  },
  gender: {
    1: '男',
    0: '女',
    '-1': '未知',
  },
  gender_o: {
    1: '先生',
    0: '女士',
    '-1': '未知',
  },
  budgetLevel: {
    0: '10万以下',
    1: '10-15万',
    2: '15-20万',
    3: '20-25万',
    4: '25-30万',
    5: '30万以上',
  },
  carType: {
    0: '现车',
    1: '订车',
  },
  autoPayType: {
    0: '全款',
    1: '按揭',
  },
  inColorName: {
    '-1': '不限',
    0: '米',
    1: '棕',
    2: '黑',
    3: '灰',
    4: '红',
    5: '蓝',
    6: '白',
  },
  soldPlaceType: {
    0: '本店销售',
    1: '他店销售',
  },
  isMortgage: {
    0: '否',
    1: '是',
  },
  isOrNot: {
    0: '否',
    1: '是',
  },
  sourceDeal: {
    1: '新车交易',
    2: '二手车交易',
    3: '保险交易',
    4: '装潢交易',
    5: '维保交易',
  },

  // 提成类型
  commissionType: {
    1: '项目销售',
    2: '项目施工',
    3: '套餐卡销售',
    4: '领券活动阅读',
    5: '领券活动核销',
    6: '助力砍价阅读',
    7: '助力砍价核销',
  },

  energyType: {
    0: '汽油',
    1: '柴油',
    2: '新能源',
  },
  project: {
    status: {
      '-1': '已作废',
      0: '服务中',
      1: '已完工',
    },
    payStatus: {
      0: '待付款',
      1: '挂账',
      2: '已结算',
      3: '坏账',
    },
  },

  greetings: {
    1: '早上好，一天的工作要开始了！',
    2: '上午好，今天也要元气满满哦。',
    3: '中午好，吃饭的时候最好不要盯着电脑哟。',
    4: '下午好，忙碌的你有着最迷人的剪影！',
    5: '在忙吗，还有水稻汽车陪着你。',
    6: '晚安，愿你今夜好梦。',
  },

  smsStatus: {
    0: '发送中',
    1: '发送成功',
    2: '失败',
  },

  // 2C客户端下载地址
  clientVersion: {
    // 应用宝地址
    downloadAddress: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.shuidao.daotiantoc',
  },

  label: {
    registry_form_pic: '个人信息登记表',
    id_photo_pic: '一寸证件照',
    health_form_pic: '体检表',
    labor_contract_pic: '劳动合同',
    leaving_certificate_pic: '原单位离职证明',
    pay_card_pic: '工资卡',
  },

  imageLabel: {
    id_card_pic_front: '正面',
    id_card_pic_back: '反面',
    driver_license_front: '正本',
    driver_license_back: '副本',
    vehicle_license_pic_front: '行驶证',
    vehicle_license_pic_back: '副本',
    operation_record_pic: '工单',
    godown_entry_pic: '进货单',
    registry_form_pic: '个人信息登记表',
    health_form_pic: '体检表',
    leaving_certificate_pic: '离职证明',
    id_photo_pic: '证件照',
    labor_contract_pic: '劳动合同',
    pay_card_pic: '工资卡',
    user_certificate_pic: '资格证书',
  },
  // pay_type支付类型：0(默认):挂账；1:现金
  partPayType: {
    0: '挂账',
    1: '现金',
  },

  e2cPosition: {
    sa: 'SA',
    financial: '收银员',

  },
  /* 前端写死部分,集结于此，方便管理*/
  /*  formType: {
   1: '维修保养',
   2: '会员购买',
   0: '全部'
   },
   IncomeStatus: {
   1: '未结算',
   2: '已结算',
   0: '全部'
   },*/

  IncomeFromType: [
    { id: 1, name: '维修保养' },
    { id: 2, name: '套餐卡购买' }, /*,
     {id: 0, name: '全部'}*/
  ],

  IncomeStatus: [
    { id: 1, name: '未结算' },
    { id: 2, name: '已结算' }, /*,
     {id: 0, name: '全部'}*/
  ],

  IncomeAccountType: [
    { id: 0, name: '门店收款' },
    { id: 10, name: '总公司收款' },
  ],

  insuranceName: {
    ci_damage: '车辆损失险',
    ci_damage_nod: '不计免赔',
    ci_third: '第三责任险',
    ci_third_nod: '不计免赔',
    ci_driver: '车上人员责任险(驾驶员)',
    ci_driver_nod: '不计免赔',
    ci_passenger: '车上人员责任险(乘客)',
    ci_passenger_nod: '不计免赔',
    ci_stolen: '全车盗抢险',
    ci_stolen_nod: '不计免赔',
    ci_car_goods_drop: '车载货物掉落责任险',
    ci_car_goods_drop_nod: '不计免赔',
    ci_windscreen: '风挡玻璃单独破碎险',
    ci_windscreen_nod: '不计免赔',
    ci_traffic_free_loss_danger: '车辆停驶损失险',
    ci_traffic_free_loss_danger_nod: '不计免赔',
    ci_combust: '自燃损失险',
    ci_combust_nod: '不计免赔',
    ci_new_equipment_loss_danger: '新增加设备损失险',
    ci_new_equipment_loss_danger_nod: '不计免赔',
    ci_scratch: '划痕险',
    ci_scratch_nod: '不计免赔',
    ci_no_fault_liability: '无过错责任险',
    ci_no_fault_liability_nod: '不计免赔',
    ci_wade: '涉水行驶险',
    ci_wade_nod: '不计免赔',
    ci_spec: '不计免赔特约险',
  },
  insuranceValue: {
    车辆损失险: 'ci_damage',
    第三责任险: 'ci_third',
    '车上人员责任险(驾驶员)': 'ci_driver',
    '车上人员责任险(乘客)': 'ci_passenger',
    全车盗抢险: 'ci_stolen',
    车载货物掉落责任险: 'ci_car_goods_drop',
    风挡玻璃单独破碎险: 'ci_windscreen',
    车辆停驶损失险: 'ci_traffic_free_loss_danger',
    自燃损失险: 'ci_combust',
    新增加设备损失险: 'ci_new_equipment_loss_danger',
    划痕险: 'ci_scratch',
    无过错责任险: 'ci_no_fault_liability',
    涉水行驶险: 'ci_wade',
    不计免赔特约险: 'ci_spec',
  },

  question: {
    '-1': '已屏蔽',
    0: '正常',
  },

  settings: {
    account: {
      userType: {
        1: '连锁店管理员',
        2: '区域管理员',
        3: '总公司管理员',
      },
    },
  },

};

export default CommonText;

