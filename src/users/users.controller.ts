import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatePOCUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from '@prisma/client';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express-serve-static-core';
import { AddAreaofInterestDto } from './dto/add-area-of-interest.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @ApiCreatedResponse({ type: UserEntity })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.createUser(createUserDto));
  }

  @Post('org_rep')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiCreatedResponse({ type: UserEntity })
  async createPOCUser(@Body() createPOCUserDto: CreatePOCUserDto) {
    return new UserEntity(
      await this.usersService.createPOCUser(createPOCUserDto),
    );
  }

  @Get()
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Get('/details')
  @ApiBearerAuth()
  @Roles([
    'ADMIN',
    'ACADEMIC_REP',
    'INDUSTRY_REP',
    'ACADEMIC_USER',
    'INDUSTRY_USER',
    'ACADEMIC_STUDENT',
  ])
  @ApiOkResponse({ type: UserEntity })
  async getUserDetails(@Req() req: Request) {
    const { userId } = req.user;
    return new UserEntity(await this.usersService.findOne(userId));
  }

  @Get('/areasOfInterest')
  @ApiBearerAuth()
  @Roles([
    'ADMIN',
    'ACADEMIC_REP',
    'INDUSTRY_REP',
    'ACADEMIC_USER',
    'INDUSTRY_USER',
    'ACADEMIC_STUDENT',
  ])
  async findUserAreasOfInterest(@Req() req: Request) {
    const { userId } = req.user;
    return new UserEntity(await this.usersService.findAreasOfInterest(userId));
  }

  @Post('/areasOfInterest')
  @ApiBearerAuth()
  @Roles([
    'ADMIN',
    'ACADEMIC_REP',
    'INDUSTRY_REP',
    'ACADEMIC_USER',
    'INDUSTRY_USER',
    'ACADEMIC_STUDENT',
  ])
  async addAreasOfInterest(
    @Body() addAreaofInterestDto: AddAreaofInterestDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user;
    return new UserEntity(
      await this.usersService.addAreasOfInterest(
        userId,
        addAreaofInterestDto.areaOfInterestIds,
      ),
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }
}
