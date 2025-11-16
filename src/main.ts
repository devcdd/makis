import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { API_TAGS, API_TAG_DESCRIPTIONS } from './constants/messages';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Maple Idle Coupon Auto Bot API')
    .setDescription('메이플 아이들 쿠폰 자동 배포 시스템 API')
    .setVersion('1.0')
    .addTag(API_TAGS.USERS, API_TAG_DESCRIPTIONS[API_TAGS.USERS])
    .addTag(API_TAGS.COUPONS, API_TAG_DESCRIPTIONS[API_TAGS.COUPONS])
    .addTag(API_TAGS.AUTO, API_TAG_DESCRIPTIONS[API_TAGS.AUTO])
    .addTag(API_TAGS.ADMIN, API_TAG_DESCRIPTIONS[API_TAGS.ADMIN])
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
