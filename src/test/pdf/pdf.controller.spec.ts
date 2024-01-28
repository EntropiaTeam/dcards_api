import { Test } from '@nestjs/testing';
import { AppConfigService } from '../../_common/services/app-config.service';
import { AzureService } from '../../_common/services/azure.service';
import { PdfService } from '../../pdf/pdf.service';
import { PdfController } from '../../pdf/pdf.controller';
import { mockData } from '../mockData';

const mockPdfService = () => ({
  create: jest.fn().mockResolvedValueOnce(mockData.pdfAttemptResponseDto),
  update: jest.fn().mockResolvedValueOnce(mockData.PdfSuccessResponseDto)
});

describe('PdfController', () => {
  let pdfService: PdfService;
  let instance: PdfController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PdfController,
        { provide: PdfService, useFactory: mockPdfService },
        { provide: AzureService, useValue: {} },
        { provide: AppConfigService, useValue: {} }
      ]
    }).compile();

    pdfService = module.get<PdfService>(PdfService);
    instance = new PdfController(pdfService);
  });

  describe('printAttempt', () => {
    it('should invoke pdfService.create with correct params', async () => {
      const createSpy = jest.spyOn(pdfService, 'create');
      await instance.printAttempt(mockData.pdfRequestDto, mockData.printAttemptId);
      expect(createSpy).toHaveBeenCalledWith(
        mockData.pdfRequestDto, mockData.printAttemptId, undefined
      );
    });

    it('should return the PdfAttemptResponseDto', async () => {
      const result = await instance.printAttempt(mockData.pdfRequestDto, mockData.printAttemptId);
      expect(result).toEqual(mockData.pdfAttemptResponseDto);
    });
  });

  describe('printSuccessful', () => {
    it('should invoke pdfService.create with correct params', async () => {
      const updateSpy = jest.spyOn(pdfService, 'update');
      await instance.printSuccessful(mockData.pdfRequestDto, mockData.printAttemptId);
      expect(updateSpy).toHaveBeenCalledWith(
        mockData.pdfRequestDto, mockData.printAttemptId, undefined
      );
    });

    it('should return the PdfSuccessResponseDto', async () => {
      const result = await instance.printSuccessful(
        mockData.pdfRequestDto, mockData.printAttemptId
      );
      expect(result).toEqual(mockData.PdfSuccessResponseDto);
    });
  });
});
