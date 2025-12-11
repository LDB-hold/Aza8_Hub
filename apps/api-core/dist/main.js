"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_js_1 = require("./app.module.js");
const http_exception_filter_js_1 = require("./common/filters/http-exception.filter.js");
const logging_interceptor_js_1 = require("./common/interceptors/logging.interceptor.js");
const app_config_service_js_1 = require("./config/app-config.service.js");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule, {
        bufferLogs: true
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true
    }));
    app.useGlobalFilters(new http_exception_filter_js_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_js_1.LoggingInterceptor());
    const configService = app.get(app_config_service_js_1.AppConfigService);
    const { port } = configService.apiConfig;
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map