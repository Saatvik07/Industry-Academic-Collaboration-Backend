import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [PrismaModule, MailerModule, JwtModule, UsersModule, ConfigModule],
})
export class ProjectModule {}
