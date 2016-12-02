const router = {
  getHash(){
    return location.hash.replace(/#\//, '').replace(/[&]*_k=[\w]*/, '');
  },
  presales: {
    potential: {
      list: 'presales/potential/list?page=1',
    },
    customer: {
      list: 'presales/customer/list?page=1',
    },
  },
  aftersales: {
    project: {
      list: 'aftersales/project/list?page=1',
    },
    potential: {
      list: 'aftersales/potential/list?page=1',
    },
    customer: {
      list: 'aftersales/customer/list?page=1',
    },
  },
  finance: {
    expense: {
      list: 'finance/expense/list?page=1',
    },
    income: {
      list: 'finance/income/list?page=1',
    },
  },
  personnel: {
    user: {
      list: 'personal/user/list?page=1',
    },
    salary: {
      list: 'personal/salary/list?page=1',
    },
  },
  company: {
    list: 'company/list?page=1',
    board: 'company/board',
  }
};

export default router