import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AutheticationController } from './authentication/authetication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
// import { RolesGuard } from './authorization/guards/roles.guard';
import { PermissionsGuard } from './authorization/guards/permissions.guard';
import { PolicyHandlerStorage } from './authorization/policies/policy-handler.storage';
import { FrameworkContributorPolicyHandler } from './authorization/policies/framework-contributor.policy';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { ApiKeysService } from './authentication/api-keys.service';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity';
import { ApiKeyGuard } from './authentication/guards/api-key/api-key.guard';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';
import { SessionAuthenticationService } from './authentication/session-authentication.service';
import { SessionAuthenticationController } from './authentication/session-authentication.controller';
import * as session from 'express-session';
import * as passport from 'passport';
import { UserSerializer } from './authentication/serializers/user.serializer';
import * as createRedisStor from 'connect-redis';
import { Redis } from 'ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard, //RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    RefreshTokenIdsStorage,
    AccessTokenGuard,
    ApiKeyGuard,
    AuthenticationService,
    PolicyHandlerStorage,
    FrameworkContributorPolicyHandler,
    ApiKeysService,
    OtpAuthenticationService,
    SessionAuthenticationService,
    UserSerializer,
  ],
  controllers: [AutheticationController, SessionAuthenticationController],
})
export class IamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const RedisStore = createRedisStor(session);
    consumer
      .apply(
        session({
          store: new RedisStore({ client: new Redis(6379, 'localhost') }),
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
            sameSite: true,
            httpOnly: true,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
