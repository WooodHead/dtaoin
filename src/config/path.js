const path = {
  aftersales: {
    project: {
      destroy: 'aftersales/project/destroy',
    },
    consumptiveMaterial: {
      examine: 'aftersales/consumptive-material/examine',
    },
  },

  warehouse: {
    purchase: {
      import: 'warehouse/purchase/import',
      pay: 'warehouse/purchase/pay',
    },
    purchaseReject: {
      export: 'warehouse/purchase-reject/export',
      pay: 'warehouse/purchase-reject/pay',
    },
    stocktaking: {
      auth: 'warehouse/stocktaking/auth',
      authorize: 'warehouse/stocktaking/authorize',
      import: 'warehouse/stocktaking/import',
    },
    supplier: {
      pay: 'warehouse/supplier/pay',
    },
  },

  customer: {
    information: 'customer/customer-information',
    auto: 'customer/auto-information',
    insurance: 'customer/insurance-information',
    deal: 'customer/deal-information',
    maintenance: 'customer/maintenance-information',
    intention: 'customer/intention-information',
    reminder: 'customer/reminder',
  },

  deal: {
    calculatedReturn: 'presales/deal-auto/calculation-income',
  },

  maintainItem: {
    commission: 'maintain-item/commission',
  },
  marketing: {
    commission: '	marketing/membercard/commission',
  },
};

export default path;
