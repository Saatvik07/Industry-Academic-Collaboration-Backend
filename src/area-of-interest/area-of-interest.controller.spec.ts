import { Test, TestingModule } from '@nestjs/testing';
import { AreaOfInterestController } from './area-of-interest.controller';
import { AreaOfInterestService } from './area-of-interest.service';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('AreaOfInterestController', () => {
  let controller: AreaOfInterestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaOfInterestController],
      providers: [AreaOfInterestService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<AreaOfInterestController>(AreaOfInterestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
