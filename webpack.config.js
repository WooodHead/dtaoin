'use strict';
function buildConfig(env) {
  return require('./cfg/' + env + '.js')(env)
}

module.exports = buildConfig;