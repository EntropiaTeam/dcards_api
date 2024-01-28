/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable jest/no-done-callback */
import { Test } from '@nestjs/testing';
import { AzureService } from '../../_common/services/azure.service';
import { OrderController } from '../../order/order.controller';
import { mockData } from '../mockData';
import { OrderService } from '../../order/order.service';

const mockOrderService = () => ({
  update: jest.fn().mockResolvedValueOnce(mockData.orderUpdateResponseDto),
  create: jest.fn().mockResolvedValueOnce(mockData.orderResponseDto)
});

describe('OrderController', () => {
  afterAll(async (done) => {
    if (!process.stdout.write('')) {
      process.stdout.once('drain', () => { done(); });
    }
  });

  let orderService: OrderService;
  let instance: OrderController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderController,
        { provide: OrderService, useFactory: mockOrderService },
        { provide: AzureService, useValue: {} }
      ]
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    instance = new OrderController(orderService);
  });

  describe('create', () => {
    it('should invoke orderService.create with correct params', async () => {
      const orderServiceSpy = jest.spyOn(orderService, 'create');
      await instance.create(
        mockData.file, mockData.orderRequestDto, mockData.referer,
        mockData.newUiVersion, mockData.userAgent
      );
      expect(orderServiceSpy).toHaveBeenCalledWith(
        mockData.orderRequestDto, mockData.referer,
        mockData.newUiVersion, mockData.userAgent, mockData.file, undefined
      );
    });

    it('should return OrderResponseDto', async () => {
      const response = await instance.create(
        mockData.file, mockData.orderRequestDto, mockData.referer,
        mockData.newUiVersion, mockData.userAgent
      );
      expect(response).toEqual(mockData.orderResponseDto);
    });
  });

  describe('update', () => {
    it('should invoke orderService.update with correct params', async () => {
      const updateSpy = jest.spyOn(orderService, 'update');
      await instance.update(mockData.orderUpdateRequest, mockData.printibleId);
      expect(updateSpy).toHaveBeenCalledWith(
        mockData.orderUpdateRequest, mockData.printibleId
      );
    });

    it('should return OrderUpdateResponseDto', async () => {
      const response = await instance.update(mockData.orderUpdateRequest, mockData.printibleId);
      expect(response).toEqual(mockData.orderUpdateResponseDto);
    });
  });
});
