"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api/v1');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Carbon Foodprint Estimator API is running on: http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
    console.log(`🔍 Estimate endpoint: http://localhost:${port}/api/v1/estimate`);
    console.log(`📸 Image estimate endpoint: http://localhost:${port}/api/v1/estimate/image`);
}
bootstrap();
//# sourceMappingURL=main.js.map