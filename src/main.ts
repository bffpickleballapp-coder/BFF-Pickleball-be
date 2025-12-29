import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ScalarTheme } from './shared/helpers/scalar.theme';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';
import { AllExceptionsFilter } from './shared/interceptors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // <--- THÊM DÒNG QUAN TRỌNG NÀY
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Cho phép inline script (Scalar cần cái này)
            'https://cdn.jsdelivr.net', // Cho phép tải script từ CDN của Scalar
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'", // Cho phép inline css
            'https://cdn.jsdelivr.net',
            'https://fonts.googleapis.com', // Nếu có dùng font
          ],
          fontSrc: [
            "'self'",
            'https://fonts.gstatic.com',
            'https://cdn.jsdelivr.net',
          ],
          imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'], // Cho phép ảnh từ CDN và base64
        },
      },
    }),
  );

  app.use(json({ limit: '1mb' }));

  app.use(urlencoded({ extended: true, limit: '1mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: false },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api', {
    exclude: ['webhook', 'webhook/(.*)', 'hub', 'hub/(.*)'],
  });
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  const eviroment = process.env.ENVIROMENT ?? 'Development';
  const port = process.env.PORT ?? 3000;
  if (eviroment === 'Development') {
    const config = new DocumentBuilder()
      .setTitle('Pickleball API')
      .setDescription('The Pickleball API description')
      .setVersion('1.0')
      .addTag('cats')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const pathScalar = process.env.DOC_SCALAR_PATH ?? 'scalar';
    const theme = (process.env.DOC_THEME as ScalarTheme) ?? 'purple';
    const pathSwagger = process.env.DOC_SWAGGER_PATH ?? 'swagger';
    SwaggerModule.setup(pathSwagger, app, document);

    app.use(
      `/${pathScalar}`,
      apiReference({
        theme: theme,
        content: document,
      }),
    );
    console.table({
      '🚀 Application is running on:': `http://localhost:${port}/api`,
      '📑 Swagger Documentation:': `http://localhost:${port}/${pathSwagger}`,
      '⚡ Scalar Documentation:': `http://localhost:${port}/${pathScalar}`,
      ENVIRONMENT: eviroment,
    });
  } else {
    console.table({
      '🚀 Application is running on:': `http://localhost:${port}/api`,
      ENVIRONMENT: eviroment,
    });
  }

  await app.listen(port);
}
bootstrap();