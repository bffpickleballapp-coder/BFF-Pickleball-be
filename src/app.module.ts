import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { WebhookModule } from './webhook/webhook.module';
import { VenuesModule } from './modules/venues/venues.module';
import { ClubModule } from './modules/club/club.module';
import { PrismaModule } from './shared/services/prisma.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RequestLoggerMiddleware } from './middleware/logger.middleware';
import { QueryParserMiddleware } from './middleware/query-parser.middleware';
import { SessionModule } from './modules/session/session.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MembershipPlanModule } from './modules/membership-plan/membership-plan.module';
import { NotificationModule } from './modules/notification/notification.module';
import { MatchModule } from './modules/match/match.module';
import { KpiModule } from './modules/kpi/kpi.module';
import { UsersModule } from './modules/User/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env'],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 30,
        },
      ],
    }),
    AuthenticationModule,
    WebhookModule,
    ClubModule,
    PrismaModule,
    SessionModule,
    PaymentModule,
    MembershipPlanModule,
    NotificationModule,
    MatchModule,
    KpiModule,
    VenuesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(QueryParserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
