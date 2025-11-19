"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const messages_1 = require("./constants/messages");
async function bootstrap() {
    const port = parseInt(process.env.SERVER_PORT || '5000', 10);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('메키스 API')
        .setDescription('메키스 시스템 API')
        .setVersion('1.0')
        .addTag(messages_1.API_TAGS.USERS, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.USERS])
        .addTag(messages_1.API_TAGS.COUPONS, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.COUPONS])
        .addTag(messages_1.API_TAGS.AUTO, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.AUTO])
        .addTag(messages_1.API_TAGS.ADMIN, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.ADMIN])
        .addTag(messages_1.API_TAGS.AUTH, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.AUTH])
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.enableCors({
        origin: [
            'http://localhost:4000',
            'http://localhost:3000',
            'http://127.0.0.1:4000',
            'http://127.0.0.1:3000',
            'https://makis.cdd.co.kr',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
        exposedHeaders: ['x-access-token', 'x-refresh-token'],
    });
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableShutdownHooks();
    await app.listen(port);
    console.log(`🚀 서버가 포트 ${port}에서 실행 중입니다.`);
    process.on('SIGTERM', async () => {
        console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
        await app.close();
        process.exit(0);
    });
    process.on('SIGINT', async () => {
        console.log('SIGINT 신호를 받았습니다. 서버를 종료합니다...');
        await app.close();
        process.exit(0);
    });
}
void bootstrap();
//# sourceMappingURL=main.js.map