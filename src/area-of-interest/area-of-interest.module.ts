import { Module } from '@nestjs/common';
import { AreaOfInterestService } from './area-of-interest.service';
import { AreaOfInterestController } from './area-of-interest.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AreaOfInterestController],
  providers: [AreaOfInterestService],
  imports: [PrismaModule],
})
export class AreaOfInterestModule {}
