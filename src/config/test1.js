'use strict';

import baseConfig from './base';


const config = {
  appEnv: 'test1',  // don't remove the appEnv property here
};

export default Object.freeze(Object.assign({}, baseConfig, config));
