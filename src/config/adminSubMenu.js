const menus = [
  {
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
    key: 'warehouse',
    icon: 'warehouse',
    name: '配件',
    subMenu: [
      {
        name: '配件分类管理',
        path: '/warehouse/category/index',
      },
    ],
  }, {
    key: 'marketing',
    icon: 'marketing',
    name: '会员',
    subMenu: [
      {
        name: '计次优惠',
        path: '/marketing/times/list',
      }, {
        name: '折扣优惠',
        path: '/marketing/discount/list',
      }, {
        name: '会员卡管理',
        path: '/marketing/membercard/list',
      },
    ],
  }, {
    key: 'finance',
    icon: 'finance',
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
    icon: 'warehouse',
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
    icon: 'aftersales',
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
