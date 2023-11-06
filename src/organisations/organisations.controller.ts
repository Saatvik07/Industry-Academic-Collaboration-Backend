import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrganisationEntity } from './entities/organisation.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role, User } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';
import _map from 'lodash/map';
import { VerifyMemberDto } from './dto/verify-member.dto';
@Controller('organisations')
@ApiTags('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  private mapResponseToUserEntity(users: Array<User>) {
    return _map(users, (user) => new UserEntity(user));
  }

  @Post()
  @ApiCreatedResponse({ type: OrganisationEntity })
  create(@Body() createOrganisationDto: CreateOrganisationDto) {
    return this.organisationsService.create(createOrganisationDto);
  }

  @Get()
  @ApiOkResponse({ type: OrganisationEntity, isArray: true })
  findAll() {
    return this.organisationsService.findAll();
  }

  @Get('academic')
  @ApiOkResponse({ type: OrganisationEntity, isArray: true })
  findAcademicOrganisations() {
    return this.organisationsService.findAcademicOrganisations();
  }

  @Get('industry')
  @ApiOkResponse({ type: OrganisationEntity, isArray: true })
  findIndustryOrganisations() {
    return this.organisationsService.findIndustryOrganisations();
  }

  @Get(':id')
  @ApiOkResponse({ type: OrganisationEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const org = await this.organisationsService.findOne(id);
    if (!org) {
      throw new NotFoundException(`Organisation with id ${id} not found`);
    }
    return org;
  }

  @Get('members/unverified/:id')
  @Roles([Role.ADMIN, Role.ACADEMIC_REP, Role.INDUSTRY_REP])
  @ApiOkResponse({ type: OrganisationEntity })
  async findUnverifiedOrganizationMembers(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const org =
      await this.organisationsService.findUnverifiedOrganizationMembers(id);
    if (!org) {
      throw new NotFoundException(`Organisation with id ${id} not found`);
    }
    if (org._count) {
      org.users = this.mapResponseToUserEntity(org.users);
    }
    return org;
  }

  @Get('members/verified/:id')
  @Roles([
    Role.ADMIN,
    Role.ACADEMIC_REP,
    Role.INDUSTRY_REP,
    Role.ACADEMIC_USER,
    Role.INDUSTRY_USER,
  ])
  @ApiOkResponse({ type: OrganisationEntity })
  async findVerifiedOrganizationMembers(@Param('id', ParseIntPipe) id: number) {
    const org =
      await this.organisationsService.findVerifiedOrganizationMembers(id);
    if (!org) {
      throw new NotFoundException(`Organisation with id ${id} not found`);
    }
    if (org._count) {
      org.users = this.mapResponseToUserEntity(org.users);
    }
    return org;
  }

  @Get('members/representative/:id')
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: OrganisationEntity })
  async findOrganizationPOC(@Param('id', ParseIntPipe) id: number) {
    const org = await this.organisationsService.findOrganizationPOC(id);
    if (!org) {
      throw new NotFoundException(`Organisation with id ${id} not found`);
    }
    if (org._count) {
      org.users = this.mapResponseToUserEntity(org.users);
    }
    return org;
  }

  @Post()
  @ApiOkResponse({ type: Array<UserEntity> })
  async verifyOrganizationMembers(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyMemberDto: VerifyMemberDto,
  ) {
    const users = await this.organisationsService.verifyOrganizationMembers(
      verifyMemberDto.memberIds,
    );
    if (users.length) {
      return this.mapResponseToUserEntity(users);
    }
    throw new InternalServerErrorException('Error in verifying member IDs');
  }

  @Patch(':id')
  @ApiOkResponse({ type: OrganisationEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganisationDto: UpdateOrganisationDto,
  ) {
    return this.organisationsService.update(id, updateOrganisationDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: OrganisationEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organisationsService.remove(id);
  }
}
