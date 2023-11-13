import { Test, TestingModule } from '@nestjs/testing';
import { AreaOfInterestService } from './area-of-interest.service';

describe('AreaOfInterestService', () => {
  let service: AreaOfInterestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaOfInterestService],
    }).compile();

    service = module.get<AreaOfInterestService>(AreaOfInterestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
