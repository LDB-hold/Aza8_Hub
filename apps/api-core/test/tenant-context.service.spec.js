const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

require('./module-mocks');

const { TenantContextService } = require('../dist/tenancy/tenant-context.service.js');

describe('TenantContextService', () => {
  it('retorna o contexto padrão como requisição do hub quando não há tenant', () => {
    const request = {};
    const service = new TenantContextService(request);

    const context = service.getContext();

    assert.deepStrictEqual(context, {
      tenantId: null,
      tenantSlug: null,
      isHubRequest: true
    });
  });
});
