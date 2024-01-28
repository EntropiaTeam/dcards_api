import {
  Controller,
  Get,
  Headers
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { InitialDataService } from './initial-data.service';
import { HeaderDto } from './dto/header.dto';
import { InitialDataResponseDto } from './dto/initial-data-response.dto';
import { SwaggerGetInitialData } from './decorators/swagger.get-initial-data.decorator';
import { HidePhotoCards } from './decorators/hide-photo-cards.decorator';
import { Brand } from '../_common/enums/brand.enum';

@ApiTags('Initial Data')
@Controller('api/init')
export class InitialDataController {
  constructor(private initialDataService: InitialDataService) {}

  @Get()
  @SwaggerGetInitialData()
  async get(
    @Headers() headers: HeaderDto, @HidePhotoCards() hidePhotoCards: boolean
  ): Promise<InitialDataResponseDto> {
    const brand = Brand.Dcards;
    return this.initialDataService.getInitialData(
      headers.invalidate_cache,
      brand,
      headers.locale,
      hidePhotoCards
    );
  }
}
