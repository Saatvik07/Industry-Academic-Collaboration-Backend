import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AreaOfInterestService } from './area-of-interest.service';
import { CreateAreaOfInterestDto } from './dto/create-area-of-interest.dto';
import { UpdateAreaOfInterestDto } from './dto/update-area-of-interest.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Request } from 'express-serve-static-core';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('area-of-interest')
@ApiTags('areas-of-interest')
export class AreaOfInterestController {
  constructor(private readonly areaOfInterestService: AreaOfInterestService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(['ADMIN', 'ACADEMIC_REP', 'INDUSTRY_REP'])
  create(
    @Body() createAreaOfInterestDto: CreateAreaOfInterestDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user;
    return this.areaOfInterestService.create(createAreaOfInterestDto, userId);
  }

  @Get()
  @Public()
  findAll() {
    return this.areaOfInterestService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.areaOfInterestService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(['ADMIN', 'ACADEMIC_REP', 'INDUSTRY_REP'])
  update(
    @Param('id') id: string,
    @Body() updateAreaOfInterestDto: UpdateAreaOfInterestDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user;
    return this.areaOfInterestService.update(
      +id,
      updateAreaOfInterestDto,
      userId,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(['ADMIN', 'ACADEMIC_REP', 'INDUSTRY_REP'])
  remove(@Param('id') id: string, @Req() req: Request) {
    const { userId } = req.user;
    return this.areaOfInterestService.remove(+id, userId);
  }
}
