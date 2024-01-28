import { Test } from '@nestjs/testing';
import { mockData } from '../mockData';
import { PdfGenerationService } from '../../_common/services/pdf-generation.service';
import { StorageService } from '../../_common/services/storage.service';
import { OrdersRepository } from '../../_common/repositories/orders.repository';
import { PdfService } from '../../pdf/pdf.service';

const mockPdfGenerationService = () => ({
  generateBasePDFLayout: jest.fn(),
  generateUpdateDelta: jest.fn(),
  preparePdfData: jest.fn(),
  generatePdf: jest.fn()
});

const mockStorageService = () => ({
  uploadFileToStorageService: jest.fn(),
  generateSecuredUri: jest.fn().mockResolvedValueOnce(mockData.tokenResponse),
  getPdfBlobUrl: jest.fn()
});

const mockOrdersRepository = () => ({
  findOrder: jest.fn(),
  updateWith: jest.fn()
});

describe('PdfService', () => {
  let pdfGenerationService: PdfGenerationService;
  let storageService: StorageService;
  let ordersRepository: OrdersRepository;
  let instance: PdfService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: PdfService, useValue: {} },
        { provide: OrdersRepository, useFactory: mockOrdersRepository },
        { provide: StorageService, useFactory: mockStorageService },
        { provide: PdfGenerationService, useFactory: mockPdfGenerationService }
      ]
    }).compile();

    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    storageService = module.get<StorageService>(StorageService);
    pdfGenerationService = module.get<PdfGenerationService>(PdfGenerationService);
    instance = new PdfService(
      ordersRepository, storageService, pdfGenerationService
    );
  });

  describe('create', () => {
    it('should return PdfAttemptResponseDto', async () => {
      jest.spyOn(ordersRepository, 'findOrder').mockResolvedValueOnce(mockData.order);
      jest.spyOn(instance, 'getPdfUrl').mockResolvedValueOnce(mockData.urlToken);
      const results = await instance.create(
        mockData.existingPdfRequestDto, mockData.existingPrintibleId
      );
      expect(results).toEqual(mockData.pdfAttemptResponse);
    });
  });

  describe('update', () => {
    it('should return PdfSuccessResponseDto', async () => {
      jest.spyOn(ordersRepository, 'findOrder').mockResolvedValueOnce(mockData.order);
      jest.spyOn(ordersRepository, 'updateWith').mockResolvedValueOnce(mockData.updatedOrder);
      const result = await instance.update(mockData.pdfRequestDto, mockData.printAttemptId);
      expect(result).toEqual(mockData.PdfSuccessResponseDto);
    });
  });

  describe('getPdfUrl', () => {
    it('invoke storageService.getPdfBlobUrl with correct param when order exists', async () => {
      const blobSpy = jest.spyOn(storageService, 'getPdfBlobUrl').mockResolvedValueOnce(mockData.tokenUri);
      jest.spyOn(ordersRepository, 'findOrder').mockResolvedValueOnce(mockData.existingOrder);
      await instance.getPdfUrl(mockData.existingPdfRequestDto, mockData.existingPrintibleId);
      expect(blobSpy).toHaveBeenCalledWith(mockData.existingPrintibleId);
    });

    it('invoke pdfGenerationService.preparePdfData with correct param when order doesnt exists', async () => {
      jest.spyOn(ordersRepository, 'findOrder').mockResolvedValueOnce(mockData.order);
      const preparePdfDataSpy = jest.spyOn(pdfGenerationService, 'preparePdfData');
      await instance.getPdfUrl(
        mockData.existingPdfRequestDto, mockData.printibleId
      );
      expect(preparePdfDataSpy).toHaveBeenCalled();
    });
  });
});
