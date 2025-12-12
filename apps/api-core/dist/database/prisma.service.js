"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const app_config_service_js_1 = require("../config/app-config.service.js");
const tenant_context_store_js_1 = require("../tenancy/tenant-context.store.js");
const tenant_scoped_models_js_1 = require("../tenancy/tenant-scoped-models.js");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor(appConfig, tenantContextStore) {
        super();
        this.tenantContextStore = tenantContextStore;
        this.logger = new common_1.Logger('PrismaTenancy');
        this.readActions = new Set([
            'findUnique',
            'findUniqueOrThrow',
            'findMany',
            'findFirst',
            'findFirstOrThrow',
            'count',
            'aggregate',
            'groupBy'
        ]);
        this.uniqueActions = new Set([
            'findUnique',
            'findUniqueOrThrow',
            'update',
            'delete',
            'upsert'
        ]);
        this.writeActions = new Set([
            'create',
            'createMany',
            'update',
            'updateMany',
            'delete',
            'deleteMany',
            'upsert'
        ]);
        this.enforcementMode = appConfig.apiConfig.tenancyEnforcementMode;
    }
    async onModuleInit() {
        this.$use(this.tenancyMiddleware.bind(this));
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async tenancyMiddleware(params, next) {
        if (!this.isTenantScopedModel(params.model)) {
            return next(params);
        }
        const tenantContext = this.tenantContextStore.getContext();
        if (!tenantContext) {
            const message = `Tenant context missing for model ${params.model} action ${params.action}`;
            if (this.enforcementMode === 'strict') {
                throw new Error(`${message}; enforcement mode is strict`);
            }
            this.logger.warn(`${message}; skipping enforcement`);
            return next(params);
        }
        if (tenantContext.isHubRequest) {
            this.logHubAccess(params, tenantContext);
            return next(params);
        }
        if (!tenantContext.tenantId) {
            const message = `Tenant ID missing in portal context for model ${params.model}`;
            if (this.enforcementMode === 'strict') {
                throw new Error(message);
            }
            this.logger.warn(message);
            return next(params);
        }
        if (this.readActions.has(params.action)) {
            if (this.uniqueActions.has(params.action)) {
                params.args = this.applyScopedUniqueWhere(params.args, tenantContext, params.model, params.action);
            }
            else {
                const scopedArgs = params.args ? { ...params.args } : {};
                scopedArgs.where = this.applyScopedWhere(scopedArgs.where, tenantContext, params.model, params.action);
                params.args = scopedArgs;
            }
        }
        else if (this.writeActions.has(params.action)) {
            params.args = this.applyScopedWrite(params.args, tenantContext, params.model, params.action);
        }
        return next(params);
    }
    isTenantScopedModel(model) {
        return Boolean(model && tenant_scoped_models_js_1.TENANT_SCOPED_MODELS.includes(model));
    }
    applyScopedWrite(args, tenantContext, model, action) {
        const tenantId = tenantContext.tenantId;
        const scopedArgs = args ? { ...args } : {};
        if (action === 'createMany') {
            scopedArgs.data = this.applyTenantIdToData(scopedArgs.data, tenantId, model, action);
            return scopedArgs;
        }
        if (action === 'upsert') {
            scopedArgs.where = this.applyScopedUniqueWhere(scopedArgs.where, tenantContext, model, action);
            scopedArgs.create = this.applyTenantIdToData(scopedArgs.create, tenantId, model, action);
            scopedArgs.update = this.applyTenantIdToData(scopedArgs.update, tenantId, model, action);
            return scopedArgs;
        }
        if (action === 'update' || action === 'delete') {
            scopedArgs.where = this.applyScopedUniqueWhere(scopedArgs.where, tenantContext, model, action);
        }
        if (action === 'updateMany' || action === 'deleteMany') {
            scopedArgs.where = this.applyScopedWhere(scopedArgs.where, tenantContext, model, action);
        }
        if (scopedArgs.data !== undefined) {
            scopedArgs.data = this.applyTenantIdToData(scopedArgs.data, tenantId, model, action);
        }
        return scopedArgs;
    }
    applyScopedWhere(where, tenantContext, model, action) {
        const tenantId = tenantContext.tenantId;
        const provided = this.extractTenantId(where);
        if (provided && provided !== tenantId) {
            const message = `Cross-tenant where detected for ${model}.${action}; expected ${tenantId}, received ${provided}`;
            if (this.enforcementMode === 'strict') {
                throw new Error(message);
            }
            this.logger.warn(message);
        }
        return {
            ...(where ?? {}),
            tenantId
        };
    }
    applyScopedUniqueWhere(args, tenantContext, model, action) {
        const tenantId = tenantContext.tenantId;
        const scopedArgs = args ? { ...args } : {};
        const provided = this.extractTenantId(scopedArgs.where);
        if (provided && provided !== tenantId) {
            const message = `Cross-tenant unique where detected for ${model}.${action}; expected ${tenantId}, received ${provided}`;
            if (this.enforcementMode === 'strict') {
                throw new Error(message);
            }
            this.logger.warn(message);
        }
        if (!provided) {
            const message = `Missing tenant qualifier in unique where for ${model}.${action}; cannot auto-inject for unique operations`;
            if (this.enforcementMode === 'strict') {
                throw new Error(message);
            }
            this.logger.warn(message);
        }
        return scopedArgs;
    }
    applyTenantIdToData(data, tenantId, model, action) {
        if (data === undefined || data === null) {
            throw new Error(`Cannot apply tenantId: data payload is missing for tenant-scoped write on ${model}.${action}`);
        }
        if (Array.isArray(data)) {
            return data.map((row) => ({ ...row, tenantId }));
        }
        return {
            ...data,
            tenantId
        };
    }
    extractTenantId(where) {
        if (!where || typeof where !== 'object') {
            return undefined;
        }
        const rawTenantId = where.tenantId;
        if (!rawTenantId) {
            const compositeKey = Object.keys(where).find((key) => key.toLowerCase().includes('tenantid'));
            if (compositeKey) {
                const composite = where[compositeKey];
                if (composite && typeof composite === 'object') {
                    if (typeof composite.tenantId === 'string') {
                        return composite.tenantId;
                    }
                    if (composite.tenantId && typeof composite.tenantId.equals === 'string') {
                        return composite.tenantId.equals;
                    }
                }
            }
            return undefined;
        }
        if (typeof rawTenantId === 'string') {
            return rawTenantId;
        }
        if (typeof rawTenantId === 'object' && typeof rawTenantId.equals === 'string') {
            return rawTenantId.equals;
        }
        return undefined;
    }
    logHubAccess(params, tenantContext) {
        const whereTenant = this.extractTenantId(params.args?.where);
        if (!whereTenant) {
            this.logger.debug(`Hub context query without explicit tenantId on ${params.model}.${params.action}`, tenantContext);
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_config_service_js_1.AppConfigService,
        tenant_context_store_js_1.TenantContextStore])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map