import { ApiProperty } from '@nestjs/swagger';

export class AuthBaseEntity {
  @ApiProperty()
  accessToken: string;
}

export class AuthEntity extends AuthBaseEntity {
  @ApiProperty()
  refreshToken: string;
}
