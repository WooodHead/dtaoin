import api from '../middleware/api';

const cooperationTypeShort = api.getLoginUser().cooperationTypeShort;

// TP FC 等 设置为true为不显示.
const menus = [
  {
    key: 'presales',
    icon: 'shopping-cart',
    name: '销售',
    subMenu: [
      {
        name: '意向客户',
        path: '/presales/potential/index',
      },
      {
        name: '成交车辆',
        path: '/presales/deal/index',
      },
    ],
  }, {
    key: 'aftersales',
    icon: 'setting',
    name: '售后',
    subMenu: [
      {
        name: '开单',
        path: 'group',
        items: [
          {
            name: '创建工单',
            path: '/aftersales/project/new',
            target: '_blank',
          }, {
            name: '配件销售',
            path: '/aftersales/part-sale/new',
            target: '_blank',
          }, {
            name: '耗材领用',
            path: '/aftersales/consumptive-material/index',
          },
        ],
      }, {
        name: '单据管理',
        path: 'group',
        items: [
          {
            name: '工单管理',
            path: '/aftersales/project/index',
          }, {
            name: '销售单管理',
            path: '/aftersales/part-sale/index',
          },
        ],
      }, {
        name: '客户',
        path: 'group',
        items: [
          {
            name: '客户管理',
            path: '/aftersales/customer/index',
          }, {
            name: '客户评价',
            path: '/aftersales/customer/score',
          },
        ],
      }, {
        name: '项目',
        path: 'group',
        items: [
          {
            name: '项目管理',
            path: '/maintain-item/index',
          }],
      }, {
        name: '周报',
        path: 'group',
        items: [
          {
            name: '周报',
            path: '/weekly/new',
          },
        ],
      }],
  }, {
    key: 'warehouse',
    icon: 'appstore-o',
    name: '仓库',
    subMenu: [
      {
        name: '开单',
        path: 'group',
        items: [
          {
            name: '采购开单',
            path: '/warehouse/purchase/new',
            target: '_blank',
          }, {
            name: '退货开单',
            path: '/warehouse/purchase-reject/new',
            target: '_blank',
          }, {
            name: '盘点开单',
            path: '/warehouse/stocktaking/new',
            target: '_blank',
          },
        ],
      }, {
        name: '单据',
        path: 'group',
        items: [
          {
            name: '采购单管理',
            path: '/warehouse/purchase/index',
          }, {
            name: '退货单管理',
            path: '/warehouse/purchase-reject/index',
          }, {
            name: '盘点单管理',
            path: '/warehouse/stocktaking/index',
          },
        ],
      }, {
        name: '配件及其他',
        path: 'group',
        items: [
          {
            name: '配件管理',
            path: '/warehouse/part/index',
          }, {
            name: '库存预警',
            path: '/aftersales/inventory-warn/index',
          }, {
            name: '供应商管理',
            path: '/warehouse/supplier/index',
          }, {
            name: '出入库管理',
            path: '/warehouse/logs/index',
          }, {
            name: '分类及加价率',
            path: '/warehouse/markup-rate/index',
          }, {
            name: '配件商城',
            path: '/warehouse/part/store',
          },
        ],
      }],
  }, {
    key: 'dashboard',
    icon: 'line-chart',
    name: '报表',
    subMenu: [
      {
        name: '销售业务',
        path: '/dashboard/presales',
      }, {
        name: '售后业务',
        path: '/dashboard/aftersales',
      }],
  }, {
    key: 'finance',
    icon: 'pay-circle-o',
    name: '财务',
    subMenu: [
      {
        name: '业务收支',
        path: 'group',
        items: [
          {
            name: '收支管理',
            path: '/finance/expense/list',
          }, {
            name: '新车收入',
            path: '/finance/presales-income/list',
          }, {
            name: '财务月报',
            path: '/finance/monthly_report',
          },
        ],
      }, {
        name: '资产管理',
        path: 'group',
        items: [
          {
            name: '固定资产',
            path: '/finance/fixed-assets/index',
          },
        ],
      }],
  }, {
    key: 'personnel',
    icon: 'team',
    name: '人事',
    subMenu: [
      {
        name: '员工管理',
        path: '/personnel/user/list',
      }, {
        name: '提成管理',
        path: '/personnel/commission/list',
      }],
  }, {
    key: 'marketing',
    icon: 'bulb',
    name: '营销',
    subMenu: [
      {
        name: '优惠券',
        path: 'group',
        items: [
          {
            name: '计次券',
            path: '/marketing/times/list',
          }, {
            name: '折扣券',
            path: '/marketing/discount/list',
          }, {
            name: '优惠券核销',
            path: '/marketing/coupon/verification/index',
          }, {
            name: '优惠券统计',
            path: '/marketing/statistics/coupon',
          },
        ],
      }, {
        name: '套餐卡',
        path: 'group',
        items: [
          {
            name: '套餐卡开卡',
            path: '/marketing/membercard/sale',
          }, {
            name: '套餐卡管理',
            path: '/marketing/membercard/list',
            TP: true,
            AP: true,
          }, {
            name: '购买记录',
            path: '/marketing/membercard/salelog',
          },
        ],
      }, {
        name: '工具',
        path: 'group',
        items: [
          {
            name: '领券活动',
            path: '/marketing/coupon-activity/list',
          },
          {
            name: '助力砍价',
            path: '/marketing/bargain/index',
          }, {
            name: '短信推送',
            path: '/marketing/sms-manage',
          },
        ],
      }],
  }, {
    key: 'remind',
    icon: 'notification',
    name: '提醒',
    subMenu: [
      {
        name: '续保提醒',
        key: 'remind_renewal',
        path: '/remind/renewal',
      }, {
        name: '保养提醒',
        key: 'remind_maintain',
        path: '/remind/maintain',
      }, {
        name: '年检提醒',
        key: 'remind_yearly_inspection',
        path: '/remind/yearly-inspection',
      }, {
        name: '催收提醒',
        key: 'remind_debt',
        path: '/remind/debt',
      }, {
        name: '套餐卡到期',
        key: 'remind_coupon_card',
        path: '/remind/coupon-card',
      }, {
        name: '生日提醒',
        key: 'remind_birthday',
        path: '/remind/birthday',
      }, {
        name: '其他回访',
        key: 'remind_common',
        path: '/remind/common',
      }],
  }];

let menuFinal = null;

// todo TP门店会员部分功能不存在
function removeTPMarketing(menus) {
  if (cooperationTypeShort == 'TP') {
    menuFinal = menus.map(item => {
      // todo 如果需要添加TP不显示项目可以直接在if里面添加判断条件或者去掉if判断进行整体判断
      if (item.key == 'marketing') {
        item.subMenu = item.subMenu.filter(value => {
          if (!value.TP) {
            return value;
          }
        });
        return item;
      } else {
        return item;
      }
    });
  } else if (cooperationTypeShort == 'AP') {
    menuFinal = menus.map(item => {
      if (item.key == 'marketing') {
        item.subMenu = item.subMenu.filter(value => {
          if (!value.AP) {
            return value;
          }
        });
        return item;
      } else {
        return item;
      }
    });
  } else if (cooperationTypeShort == 'MC') {
    menuFinal = menus.map(item => {
      if (item.key == 'marketing') {
        item.subMenu = item.subMenu.filter(value => {
          if (!value.MC) {
            return value;
          }
        });
        return item;
      } else {
        return item;
      }
    });
  } else if (cooperationTypeShort == 'FC') {
    menuFinal = menus.map(item => {
      if (item.key == 'marketing') {
        item.subMenu = item.subMenu.filter(value => {
          if (!value.FC) {
            return value;
          }
        });
        return item;
      } else {
        return item;
      }
    });
  } else {
    menuFinal = menus;
  }
}

removeTPMarketing(menus);

export default menuFinal;
