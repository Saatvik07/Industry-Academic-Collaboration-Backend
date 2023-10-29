import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrganisationEntity } from './entities/organisation.entity';

@Controller('organisations')
@ApiTags('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

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
  findOne(@Param('id') id: string) {
    return this.organisationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: OrganisationEntity })
  update(
    @Param('id') id: string,
    @Body() updateOrganisationDto: UpdateOrganisationDto,
  ) {
    return this.organisationsService.update(+id, updateOrganisationDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: OrganisationEntity })
  remove(@Param('id') id: string) {
    return this.organisationsService.remove(+id);
  }
}
