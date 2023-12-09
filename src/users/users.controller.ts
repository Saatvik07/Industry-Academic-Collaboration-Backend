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
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AddSuperviseesDto,
  CreateStudentUserDto,
  CreateUserDto,
  GetUserQueryParams,
  GetUserSearchBody,
  InviteUserDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SearchResponseUser, UserEntity } from './entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role, User } from '@prisma/client';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request } from 'express-serve-static-core';
import {
  AddAreaofInterestDto,
  BulkAreaofInterestDto,
} from './dto/add-area-of-interest.dto';
import { VerifyUserDto } from 'src/organisations/dto/verify-member.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private mapResponseToUserEntity(users: Array<User>) {
    return users.map((user) => new UserEntity(user));
  }

  @Post()
  @Public()
  @ApiCreatedResponse({ type: UserEntity })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.createUser(createUserDto));
  }

  @Post('create_supervisee')
  @ApiBearerAuth()
  @Roles([Role.ADMIN, Role.ACADEMIC_REP, Role.ACADEMIC_USER])
  async createStudentUser(
    @Req() req: Request,
    @Body() createStudentUserDto: CreateStudentUserDto,
  ) {
    const { userId } = req.user;
    const supervisor = await this.usersService.findOne(userId);
    const supervisee = await this.usersService.createSupervisee(
      createStudentUserDto,
      supervisor.orgId,
    );
    const result = await this.usersService.addSuperviseeSupervisorRelation(
      userId,
      [supervisee.userId],
    );
    return result;
  }

  @Post('add_supervisees')
  @ApiBearerAuth()
  @Roles([Role.ADMIN, Role.ACADEMIC_REP, Role.ACADEMIC_USER])
  async addSupervisees(
    @Req() req: Request,
    @Body() addSuperviseesDto: AddSuperviseesDto,
  ) {
    const { userId } = req.user;
    const supervisor = await this.usersService.findOne(userId);
    const { supervisees } = addSuperviseesDto;
    const result = await this.usersService.addSuperviseeSupervisorRelation(
      supervisor.userId,
      supervisees,
    );
    return result;
  }

  @Post('/search_users')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_REP,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
  ])
  @ApiOkResponse({ type: SearchResponseUser, isArray: true })
  async findAll(
    @Query() query: GetUserQueryParams,
    @Body() getUserSearchBody: GetUserSearchBody,
  ) {
    const { searchQuery, orgId, role } = query;
    const { areasOfInterest } = getUserSearchBody;
    const users = await this.usersService.searchUser(
      searchQuery,
      parseInt(orgId, 10),
      role,
      areasOfInterest,
    );
    return users.map((user) => new SearchResponseUser(user));
  }

  @Get('/areasOfInterest')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_REP,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
    Role.ACADEMIC_STUDENT,
  ])
  async findUserAreasOfInterest(@Req() req: Request) {
    const { userId } = req.user;
    return new UserEntity(await this.usersService.findAreasOfInterest(userId));
  }

  @Post('/areasOfInterest')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_REP,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
    Role.ACADEMIC_STUDENT,
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

  @Post('/bulk_addAOI')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  async bulkAddAreasOfInterest(
    @Body() bulkAreaofInterestDto: BulkAreaofInterestDto,
  ) {
    const { userId, areaOfInterestIds } = bulkAreaofInterestDto;
    return this.usersService.addAreasOfInterest(userId, areaOfInterestIds);
  }

  @Get('/supervisees')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_REP,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
  ])
  async getSupervisees(@Req() req: Request) {
    const { userId } = req.user;
    return this.usersService.getSupervisees(userId);
  }

  @Get('/unverified')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  async getUnverified() {
    return this.usersService.getUnverifiedUsers();
  }

  @Get('/details')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_REP,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
    Role.ACADEMIC_STUDENT,
  ])
  @ApiOkResponse({ type: UserEntity })
  async getUserDetails(@Req() req: Request) {
    const { userId } = req.user;
    return new UserEntity(await this.usersService.findOne(userId));
  }

  @Post('verify_user')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: Boolean })
  async verifyOrganizationMembers(@Body() verifyUserDto: VerifyUserDto) {
    const users = await this.usersService.verifyUser(verifyUserDto.memberIds);
    if (users.length === verifyUserDto.memberIds.length) {
      return this.mapResponseToUserEntity(users);
    }
    throw new InternalServerErrorException('Error in verifying member IDs');
  }

  @Post('make_representative')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: Boolean })
  async makeUserRepresentative(@Body() verifyUserDto: VerifyUserDto) {
    const users = await this.usersService.makeUserPOC(verifyUserDto.memberIds);
    if (users.length === verifyUserDto.memberIds.length) {
      return this.mapResponseToUserEntity(users);
    }
    throw new InternalServerErrorException(
      'Error in making users representative',
    );
  }

  @Post('/invite')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_REP,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
  ])
  @ApiOkResponse({ type: UserEntity })
  async inviteUser(@Body() inviteUserDto: InviteUserDto) {
    return new UserEntity(await this.usersService.inviteUser(inviteUserDto));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne(id));
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
