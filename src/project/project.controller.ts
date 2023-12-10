import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Patch,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  AddAcademicUserDto,
  AddIndustryUserDto,
  CreateDraftProjectDto,
} from './dto/create-project.dto';

import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express-serve-static-core';
import { VerificationRequestDto } from './dto/verification-request.dto';
import { VerifyProjectDto } from './dto/verify-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateDraftProjectDto } from './dto/update-project.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/createDraft')
  @ApiBearerAuth()
  @Roles([Role.ADMIN, Role.ACADEMIC_REP, Role.ACADEMIC_USER])
  create(
    @Body() createDraftProjectDto: CreateDraftProjectDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user;
    return this.projectService.createDraftProject(
      createDraftProjectDto,
      userId,
    );
  }

  @Post('/sendVerificationRequest')
  @ApiBearerAuth()
  @Roles([Role.ADMIN, Role.ACADEMIC_REP, Role.ACADEMIC_USER])
  sendVerificationRequest(
    @Body() verificationRequestDto: VerificationRequestDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user;
    return this.projectService.sendVerificationProjectRequest(
      verificationRequestDto.industryUserId,
      userId,
      verificationRequestDto.industryOrgId,
      verificationRequestDto.projectId,
    );
  }

  @Post('/verify')
  @ApiBearerAuth()
  @Roles([Role.ADMIN, Role.INDUSTRY_USER, Role.INDUSTRY_REP])
  verifyProject(@Body() verifyProjctDto: VerifyProjectDto) {
    return this.projectService.verifyProject(verifyProjctDto.verificationToken);
  }

  @Get()
  @Public()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Post('/add_academic_users/:id')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
    Role.ACADEMIC_REP,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_STUDENT,
  ])
  addAcademicUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body() addAcademicUserDto: AddAcademicUserDto,
  ) {
    return this.projectService.addAcademicUsers(
      id,
      addAcademicUserDto.academicUsersId,
    );
  }

  @Post('/add_industry_users/:id')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
    Role.ACADEMIC_REP,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_STUDENT,
  ])
  addIndustryUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body() addIndustryUserDto: AddIndustryUserDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user;
    if (this.projectService.checkPermission(userId, id)) {
      return this.projectService.addIndustryUsers(
        id,
        addIndustryUserDto.industryUsersId,
      );
    }
    throw new UnauthorizedException(
      'User does not have access to update the project',
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles([
    Role.ADMIN,
    Role.INDUSTRY_USER,
    Role.INDUSTRY_REP,
    Role.ACADEMIC_REP,
    Role.ACADEMIC_USER,
    Role.ACADEMIC_STUDENT,
  ])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateDraftProjectDto,
  ) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(+id);
  }
}
