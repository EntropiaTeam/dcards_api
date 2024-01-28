import { Test } from '@nestjs/testing';
import { Brand } from '../../_common/enums/brand.enum';
import { InitialDataService } from '../../initial-data/initial-data.service';
import { InitialDataController } from '../../initial-data/initial-data.controller';
import { mockData } from '../mockData';

const mockInitialDataService = () => ({
  getInitialData: jest.fn().mockImplementation(
    () => Promise.resolve(mockData.initialDataResponceDto)
  )
});

describe('InitialDataController', () => {
  let initialDataService: InitialDataService;
  let instance: InitialDataController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InitialDataController,
        { provide: InitialDataService, useFactory: mockInitialDataService }
      ]
    }).compile();

    initialDataService = module.get<InitialDataService>(InitialDataService);
    instance = new InitialDataController(initialDataService);
  });

  describe('get', () => {
    it('should invoke initialDataService with the correct params', async () => {
      const getInitialDataSpy = jest.spyOn(initialDataService, 'getInitialData');
      await instance.get(mockData.headersDto, JSON.parse(mockData.headersDto.hidephotocards));
      expect(getInitialDataSpy).toHaveBeenCalledWith(
        mockData.headersDto.invalidate_cache,
        Brand.Edible,
        mockData.headersDto.locale,
        JSON.parse(mockData.headersDto.hidephotocards)
      );
    });

    it('should return the InitialDataResponceDto', async () => {
      const response = await instance.get(
        mockData.headersDto,
        JSON.parse(mockData.headersDto.hidephotocards)
      );
      expect(response).toEqual(mockData.initialDataResponceDto);
    });
  });
});
