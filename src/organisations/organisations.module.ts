import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [OrganisationsController],
  providers: [OrganisationsService],
  imports: [PrismaModule, UsersModule],
})
export class OrganisationsModule {}
