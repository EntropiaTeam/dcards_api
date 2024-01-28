import {
  Controller,
  Param,
  Put,
  Body,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { PdfRequestDto } from './dto/pdf-request.dto';
import { PdfService } from './pdf.service';
import { SwaggerPrintAttempt } from './decorators/swagger.print-attempt.decorator';
import { SwaggerPrintSuccess } from './decorators/swagger.print-success.decorator';
import { PdfAttemptResponseDto } from './dto/pdf-attempt-response.dto';
import { PdfSuccessResponseDto } from './dto/pdf-success-response.dto';
import { IpAddress } from '../_common/decorators/client-ip.decorator';

@ApiTags('PDFs')
@Controller('api/pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @SwaggerPrintAttempt()
  @Put(':printible_id')
  @UsePipes(new ValidationPipe())
  async printAttempt(
    @Body() pdfRequestDto: PdfRequestDto,
      @Param('printible_id') printibleId: string,
      @IpAddress() clientIp?: string
  ): Promise<PdfAttemptResponseDto> {
    return this.pdfService.create(pdfRequestDto, printibleId, clientIp);
  }

  @SwaggerPrintSuccess()
  @Put(':printible_id/success')
  @UsePipes(new ValidationPipe())
  async printSuccessful(
    @Body() pdfRequestDto: PdfRequestDto,
      @Param('printible_id') printibleId: string,
      @IpAddress() clientIp?: string
  ): Promise<PdfSuccessResponseDto> {
    return this.pdfService.update(pdfRequestDto, printibleId, clientIp);
  }
}
