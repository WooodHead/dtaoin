import api from '../middleware/api';
const cooperationTypeShort = api.getLoginUser().cooperationTypeShort;

let menus = [
  {
    key: 'presales',
    icon: 'presales',
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
    icon: 'aftersales',
    name: '售后',
    subMenu: [
      {
        name: '创建工单',
        path: '/aftersales/project/new',
        target: '_blank',
      }, {
        name: '工单管理',
        path: '/aftersales/project/index',
      }, {
        name: '配件销售',
        path: '/aftersales/part-sale/new',
        target: '_blank',
      }, {
        name: '配件销售管理',
        path: '/aftersales/part-sale/index',
      }, {
        name: '客户管理',
        path: '/aftersales/customer/index',
      }, {
        name: '耗材领用',
        path: '/aftersales/consumptive-material/index',
      },
    ],
  }, {
    key: 'warehouse',
    icon: 'warehouse',
    name: '仓库',
    subMenu: [
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
      }, {
        path: 'divider',
      }, {
        name: '采购单管理',
        path: '/warehouse/purchase/index',
      }, {
        name: '退货单管理',
        path: '/warehouse/purchase-reject/index',
      }, {
        name: '盘点管理',
        path: '/warehouse/stocktaking/index',
      }, {
        name: '配件商城',
        path: '/warehouse/part/store',
      }, {
        path: 'divider',
      }, {
        name: '配件管理',
        path: '/warehouse/part/index',
      }, {
        name: '供应商管理',
        path: '/warehouse/supplier/index',
      }, {
        name: '出入库管理',
        path: '/warehouse/logs/index',
      }, {
        name: '配件分类管理',
        path: '/warehouse/category/index',
      },
    ],
  }, {
    key: 'maintain_item',
    icon: 'maintain_item',
    name: '项目',
    subMenu: [
      {
        name: '项目管理',
        path: '/maintain-item/index',
      },
    ],
  }, {
    key: 'dashboard',
    icon: 'dashboard',
    name: '报表',
    subMenu: [
      {
        name: '销售业务',
        path: '/dashboard/presales',
      }, {
        name: '售后业务',
        path: '/dashboard/aftersales',
      },
    ],
  }, {
    key: 'finance',
    icon: 'finance',
    name: '财务',
    subMenu: [
      {
        name: '新车收入',
        path: '/finance/presales-income/list',
      }, {
        name: '收支管理',
        path: '/finance/expense/list',
      }, {
        name: '固定资产管理',
        path: '/finance/fixed-assets/index',
      }, {
        name: '月报汇总',
        path: '/finance/monthly_report',
      },
    ],
  }, {
    key: 'personnel',
    icon: 'personnel',
    name: '人事',
    subMenu: [
      {
        name: '员工管理',
        path: '/personnel/user/list',
      },
    ],
  }, {
    key: 'marketing',
    icon: 'marketing',
    name: '营销',
    subMenu: [
      {
        name: '计次优惠',
        path: '/marketing/times/list',
        TP: true,
      }, {
        name: '折扣优惠',
        path: '/marketing/discount/list',
        TP: true,
      }, {
        name: '会员卡管理',
        path: '/marketing/membercard/list',
        TP: true,
      }, {
        name: '会员开卡',
        path: '/marketing/membercard/sale',
      }, {
        name: '会员购买记录',
        path: '/marketing/membercard/salelog',
      },
    ],
  }, {
    key: 'task',
    icon: 'task',
    name: '任务',
    subMenu: [
      {
        name: '客户任务',
        path: '/task/list-customer',
      }, {
        name: '续保任务',
        path: '/task/list-renewal',
      }, {
        name: '年检任务',
        path: '/task/list-yearlyinspection',
      }, {
        name: '保养任务',
        path: '/task/list-maintenance',
      },
    ],
  },
];

let menuFinal = null;

//todo TP门店会员部分功能不存在
function removeTPMarketing(menus) {
  if (cooperationTypeShort == 'TP') {
    menuFinal = menus.map(item => {
      //todo 如果需要添加TP不显示项目可以直接在if里面添加判断条件或者去掉if判断进行整体判断
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
  } else {
    menuFinal = menus;
  }
}
removeTPMarketing(menus);

export default menuFinal;
