import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateDraftProjectDto } from './dto/create-project.dto';

import { Request } from 'express-serve-static-core';
import { VerificationRequestDto } from './dto/verification-request.dto';
import { VerifyProjectDto } from './dto/verify-project.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/createDraft')
  @Public()
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
  @Public()
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
  @Public()
  verifyProject(@Body() verifyProjctDto: VerifyProjectDto) {
    return this.projectService.verifyProject(verifyProjctDto.verificationToken);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
  //   return this.projectService.update(+id, updateProjectDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
