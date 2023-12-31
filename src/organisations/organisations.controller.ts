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
  Query,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import {
  CreateOrganisationDto,
  GetOrgQueryParams,
} from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  OrganisationEntity,
  SearchResponseOrg,
} from './entities/organisation.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role, User } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';
import { Public } from 'src/auth/decorators/public.decorator';
@Controller('organisations')
@ApiTags('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  private mapResponseToUserEntity(users: Array<User>) {
    return users.map((user) => new UserEntity(user));
  }

  @Post()
  @ApiBearerAuth()
  @Public()
  @ApiCreatedResponse({ type: OrganisationEntity })
  create(@Body() createOrganisationDto: CreateOrganisationDto) {
    return this.organisationsService.create(createOrganisationDto);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: OrganisationEntity, isArray: true })
  async findAll(@Query() query: GetOrgQueryParams) {
    const { searchQuery, type } = query;

    const users = await this.organisationsService.searchOrganisation(
      searchQuery,
      type,
    );
    return users.map((user) => new SearchResponseOrg(user));
  }

  @Get('academic')
  @Public()
  @ApiOkResponse({ type: OrganisationEntity, isArray: true })
  findAcademicOrganisations() {
    return this.organisationsService.findAcademicOrganisations();
  }

  @Get('industry')
  @Public()
  @ApiOkResponse({ type: OrganisationEntity, isArray: true })
  findIndustryOrganisations() {
    return this.organisationsService.findIndustryOrganisations();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: OrganisationEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const org = await this.organisationsService.findOne(id);
    if (!org) {
      throw new NotFoundException(`Organisation with id ${id} not found`);
    }
    return org;
  }

  @Get('members/unverified/:id')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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

  @Patch(':id')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: OrganisationEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganisationDto: UpdateOrganisationDto,
  ) {
    return this.organisationsService.update(id, updateOrganisationDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: OrganisationEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organisationsService.remove(id);
  }
}
