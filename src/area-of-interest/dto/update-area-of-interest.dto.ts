import { PartialType } from '@nestjs/swagger';
import { CreateAreaOfInterestDto } from './create-area-of-interest.dto';

export class UpdateAreaOfInterestDto extends PartialType(CreateAreaOfInterestDto) {}
