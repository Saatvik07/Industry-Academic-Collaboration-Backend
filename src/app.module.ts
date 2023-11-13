import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './auth/guards/role.guard';
import { AreaOfInterestModule } from './area-of-interest/area-of-interest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
    OrganisationsModule,
    UsersModule,
    AuthModule,
    MailerModule,
    JwtModule,
    AreaOfInterestModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
