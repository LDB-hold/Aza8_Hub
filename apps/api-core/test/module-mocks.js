const Module = require('module');

const originalRequire = Module.prototype.require;

Module.prototype.require = function mockNestImports(id) {
  if (id === '@nestjs/common') {
    return {
      Injectable: () => (target) => target,
      Scope: { REQUEST: 'REQUEST' },
      Inject: () => () => undefined
    };
  }

  if (id === '@nestjs/core') {
    return { REQUEST: 'REQUEST' };
  }

  return originalRequire.apply(this, arguments);
};
