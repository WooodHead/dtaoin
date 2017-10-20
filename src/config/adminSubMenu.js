const menus = [
  {
    key: 'new-car',
    icon: 'car',
    name: '新车',
    subMenu: [
      {
        name: '产品管理',
        path: '/new-car/product/index',
      }, {
        name: '方案管理',
        path: '/new-car/programme/list',
      }, {
        name: '订单管理',
        path: '/new-car/order/index',
      }, {
        name: '材料配置',
        path: '/new-car/material/list',
      }, {
        name: '问答管理',
        path: '/new-car/qa/list',
      }, {
        name: 'banner管理',
        path: '/new-car/banner/list',
      }, {
        name: '资源方管理',
        path: '/new-car/resource/list',
      }, {
        name: '收益记录',
        path: '/new-car/earnings-record/list',
      },
    ],
  },
  {
    key: 'maintain_item',
    icon: 'book',
    name: '项目',
    subMenu: [
      {
        name: '项目管理',
        path: '/maintain-item/index',
      },
    ],
  }, {
    key: 'warehouse',
    icon: 'appstore-o',
    name: '配件',
    subMenu: [
      {
        name: '配件分类管理',
        path: '/warehouse/category/index',
      },
    ],
  }, {
    key: 'marketing',
    icon: 'notification',
    name: '营销',
    subMenu: [
      {
        name: '计次券',
        path: '/marketing/times/list',
      }, {
        name: '折扣券',
        path: '/marketing/discount/list',
      }, {
        name: '套餐卡管理',
        path: '/marketing/membercard/list',
      }, {
        name: '优惠券统计',
        path: '/marketing/statistics/coupon',
      },
    ],
  }, {
    key: 'finance',
    icon: 'pay-circle-o',
    name: '财务',
    super: true,
    subMenu: [
      {
        name: '售后收入结算',
        path: '/finance/aftersales-income-transfer/list',
      },
    ],
  }, {
    key: 'product',
    icon: 'appstore-o',
    name: '产品',
    super: true,
    subMenu: [
      {
        name: '技术问答',
        path: '/product/question/index',
      }, {
        name: '技师管理',
        path: '/product/artificer/index',
      }, {
        name: '头条管理',
        path: '/headlines',
      }, {
        name: '广告管理',
        path: '/advert',
      }, {
        name: '活动管理',
        path: '/activity',
      }, {
        name: '评价管理',
        path: '/comment',
      },
    ],
  }, {
    key: 'settings',
    icon: 'setting',
    name: '设置',
    super: true,
    subMenu: [
      {
        name: '功能设置',
        path: '/settings/index',
      }, {
        name: '账号管理',
        path: '/settings/account/index',
      }, {
        name: '角色权限',
        path: '/settings/permission/role',
      }, {
        name: '系统管理',
        path: '/settings/permission/system',
      },
    ],
  },
];

export default menus;
