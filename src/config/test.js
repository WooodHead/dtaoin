'use strict';

import baseConfig from './base';


let config = {
  appEnv: 'test',  // don't remove the appEnv property here
  baseHost: 'https://api.daotian.dev1.yunbed.com',
};

export default Object.freeze(Object.assign(baseConfig, config));

