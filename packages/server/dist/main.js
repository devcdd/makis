"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
const messages_1 = require("./constants/messages");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function killProcessOnPort(port) {
    try {
        const { stdout } = await execAsync(`lsof -ti:${port}`);
        const pids = stdout.trim().split('\n').filter(Boolean);
        if (pids.length > 0) {
            console.log(`포트 ${port}를 사용 중인 프로세스 발견: ${pids.join(', ')}`);
            for (const pid of pids) {
                try {
                    await execAsync(`kill -9 ${pid}`);
                    console.log(`프로세스 ${pid} 종료 완료`);
                }
                catch (error) {
                    console.warn(`프로세스 ${pid} 종료 실패:`, error);
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    catch (error) {
        if (!error.message?.includes('No such process')) {
            console.log(`포트 ${port}는 사용 가능합니다.`);
        }
    }
}
async function bootstrap() {
    const port = parseInt(process.env.SERVER_PORT || '5000', 10);
    await killProcessOnPort(port);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('마키스 API')
        .setDescription('마키스 시스템 API')
        .setVersion('1.0')
        .addTag(messages_1.API_TAGS.USERS, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.USERS])
        .addTag(messages_1.API_TAGS.COUPONS, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.COUPONS])
        .addTag(messages_1.API_TAGS.AUTO, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.AUTO])
        .addTag(messages_1.API_TAGS.ADMIN, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.ADMIN])
        .addTag(messages_1.API_TAGS.AUTH, messages_1.API_TAG_DESCRIPTIONS[messages_1.API_TAGS.AUTH])
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors({
        origin: [
            'http://localhost:4000',
            'http://localhost:3000',
            'http://127.0.0.1:4000',
            'http://127.0.0.1:3000',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
    });
    app.use(cookieParser());
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