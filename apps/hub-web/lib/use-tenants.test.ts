import assert from 'node:assert/strict';
import test from 'node:test';

import { fetchTenantsData, type TenantSummary } from './tenants-service.ts';

type MutableState = {
  tenants: TenantSummary[];
  loading: boolean;
  error: Error | null;
};

type LoadingLog = boolean[];

type Setters = {
  setTenants: (value: TenantSummary[] | ((prev: TenantSummary[]) => TenantSummary[])) => void;
  setLoading: (value: boolean | ((prev: boolean) => boolean)) => void;
  setError: (value: Error | null | ((prev: Error | null) => Error | null)) => void;
};

const applyUpdate = <T>(current: T, update: T | ((prev: T) => T)) =>
  typeof update === 'function' ? (update as (prev: T) => T)(current) : update;

const createState = (initialState?: Partial<MutableState>) => ({
  tenants: [],
  loading: false,
  error: null,
  ...initialState
});

const createSetters = (state: MutableState, loadingLog: LoadingLog = []): Setters => ({
  setTenants: (update) => {
    state.tenants = applyUpdate(state.tenants, update);
  },
  setLoading: (update) => {
    state.loading = applyUpdate(state.loading, update);
    loadingLog.push(state.loading);
  },
  setError: (update) => {
    state.error = applyUpdate(state.error, update);
  }
});

test('define tenants após chamada bem sucedida', async () => {
  const tenants: TenantSummary[] = [
    { id: '1', name: 'Tenant 1', slug: 'tenant-1', plan: 'pro', status: 'active' }
  ];

  const state = createState({ error: new Error('existente') });
  const loadingUpdates: LoadingLog = [];
  const api = { get: async () => tenants };
  const setters = createSetters(state, loadingUpdates);

  await fetchTenantsData(api, setters.setTenants, setters.setLoading, setters.setError);

  assert.deepEqual(state.tenants, tenants);
  assert.equal(state.error, null);
  assert.deepEqual(loadingUpdates, [true, false]);
});

test('define erro e limpa tenants quando a chamada falha', async () => {
  const expectedError = new Error('Falhou');
  const state = createState({ tenants: [{ id: '1', name: 'Old', slug: 'old', plan: 'free', status: 'inactive' }] });
  const loadingUpdates: LoadingLog = [];
  const api = { get: async () => Promise.reject(expectedError) };
  const setters = createSetters(state, loadingUpdates);

  await fetchTenantsData(api, setters.setTenants, setters.setLoading, setters.setError);

  assert.deepEqual(state.tenants, []);
  assert.equal(state.error, expectedError);
  assert.deepEqual(loadingUpdates, [true, false]);
});

test('refresh volta a carregar e atualiza tenants', async () => {
  const firstTenants: TenantSummary[] = [
    { id: '1', name: 'Primeiro', slug: 'primeiro', plan: 'starter', status: 'active' }
  ];
  const updatedTenants: TenantSummary[] = [
    { id: '2', name: 'Atualizado', slug: 'atualizado', plan: 'enterprise', status: 'pending' }
  ];

  let call = 0;
  const api = {
    get: async () => {
      call += 1;
      return call === 1 ? firstTenants : updatedTenants;
    }
  };

  const state = createState({ error: new Error('precisa atualizar') });
  const loadingUpdates: LoadingLog = [];
  const setters = createSetters(state, loadingUpdates);

  await fetchTenantsData(api, setters.setTenants, setters.setLoading, setters.setError);
  assert.deepEqual(state.tenants, firstTenants);
  assert.equal(state.error, null);

  await fetchTenantsData(api, setters.setTenants, setters.setLoading, setters.setError);

  assert.deepEqual(state.tenants, updatedTenants);
  assert.equal(state.error, null);
  assert.deepEqual(loadingUpdates, [true, false, true, false]);
});
