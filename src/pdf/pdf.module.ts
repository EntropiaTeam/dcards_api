import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CommonModule } from '../_common/common.module';
import { PdfController } from './pdf.controller';
@Module({
  imports: [CommonModule],
  controllers: [PdfController],
  providers: [PdfService]
})
export class PdfModule {}
