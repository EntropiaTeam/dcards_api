import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { mockData } from '../../test/mockData';

export class PdfAttemptResponseDto {
  @ApiProperty({ example: mockData.pdfAttemptResponse.data })
  data!:{
    pdf_id: string;
    pdf_url: string;
  };
}
