"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContextStore = void 0;
const async_hooks_1 = require("async_hooks");
const common_1 = require("@nestjs/common");
let TenantContextStore = class TenantContextStore {
    constructor() {
        this.storage = new async_hooks_1.AsyncLocalStorage();
    }
    runWithContext(context, cb) {
        return this.storage.run(context, cb);
    }
    getContext() {
        return this.storage.getStore();
    }
};
exports.TenantContextStore = TenantContextStore;
exports.TenantContextStore = TenantContextStore = __decorate([
    (0, common_1.Injectable)()
], TenantContextStore);
//# sourceMappingURL=tenant-context.store.js.map