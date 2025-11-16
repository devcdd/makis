import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { API_TAGS, API_TAG_DESCRIPTIONS } from './constants/messages';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killProcessOnPort(port: number): Promise<void> {
  try {
    // macOS/Linux에서 포트를 사용하는 프로세스 찾기 및 종료
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pids = stdout.trim().split('\n').filter(Boolean);
    
    if (pids.length > 0) {
      console.log(`포트 ${port}를 사용 중인 프로세스 발견: ${pids.join(', ')}`);
      for (const pid of pids) {
        try {
          await execAsync(`kill -9 ${pid}`);
          console.log(`프로세스 ${pid} 종료 완료`);
        } catch (error) {
          console.warn(`프로세스 ${pid} 종료 실패:`, error);
        }
      }
      // 프로세스 종료 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error: any) {
    // 포트를 사용하는 프로세스가 없으면 정상
    if (!error.message?.includes('No such process')) {
      console.log(`포트 ${port}는 사용 가능합니다.`);
    }
  }
}

async function bootstrap() {
  // 환경변수에서 포트 읽기 (ConfigService는 NestFactory.create 후에 사용)
  const port = parseInt(process.env.SERVER_PORT || '5000', 10);
  
  // 포트를 사용 중인 프로세스 종료
  await killProcessOnPort(port);
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('마키스 API')
    .setDescription('마키스 시스템 API')
    .setVersion('1.0')
    .addTag(API_TAGS.USERS, API_TAG_DESCRIPTIONS[API_TAGS.USERS])
    .addTag(API_TAGS.COUPONS, API_TAG_DESCRIPTIONS[API_TAGS.COUPONS])
    .addTag(API_TAGS.AUTO, API_TAG_DESCRIPTIONS[API_TAGS.AUTO])
    .addTag(API_TAGS.ADMIN, API_TAG_DESCRIPTIONS[API_TAGS.ADMIN])
    .addTag(API_TAGS.AUTH, API_TAG_DESCRIPTIONS[API_TAGS.AUTH])
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:4000', // 클라이언트 개발 서버
      'http://localhost:3000', // 대체 포트
      'http://127.0.0.1:4000', // IPv4 localhost
      'http://127.0.0.1:3000', // IPv4 localhost 대체
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
  });

  // Cookie Parser 설정
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  // Graceful shutdown 설정
  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`🚀 서버가 포트 ${port}에서 실행 중입니다.`);

  // 프로세스 종료 시 graceful shutdown
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
