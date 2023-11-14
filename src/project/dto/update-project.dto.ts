import { PartialType } from '@nestjs/swagger';
import { CreateDraftProjectDto } from './create-project.dto';

export class UpdateDraftProjectDto extends PartialType(CreateDraftProjectDto) {}
