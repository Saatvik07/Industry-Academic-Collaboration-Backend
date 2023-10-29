import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OrganisationsController],
  providers: [OrganisationsService],
  imports: [PrismaModule],
})
export class OrganisationsModule {}
