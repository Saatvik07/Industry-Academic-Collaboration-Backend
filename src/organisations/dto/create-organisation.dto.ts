import { ApiProperty } from '@nestjs/swagger';
import { OrgType } from '@prisma/client';
export class CreateOrganisationDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ default: OrgType.ACADEMIC })
  type: OrgType;

  @ApiProperty()
  location: string;
}
