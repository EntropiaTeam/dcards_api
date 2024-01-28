import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import MockDate from 'mockdate';
import { Brand } from '../../_common/enums/brand.enum';
import { mockData } from '../mockData';
import { Order } from '../../_common/entities/order.entity';

import { OrdersRepository } from '../../_common/repositories/orders.repository';

const mockOrdersRepositoryDB = () => ({
  findOne: jest.fn(),
  save: jest.fn()
});

describe('OrdersRepository', () => {
  let ordersRepositoryDB: MongoRepository<Order>;
  let instance: OrdersRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: OrdersRepository, useValue: {} },
        { provide: MongoRepository, useFactory: mockOrdersRepositoryDB }
      ]
    }).compile();

    ordersRepositoryDB = module.get<MongoRepository<Order>>(MongoRepository);

    instance = new OrdersRepository(ordersRepositoryDB);
    MockDate.set(1434319925275);
  });

  describe('findOrder', () => {
    it('should invoke ordersRepository.findOne with correct param', async () => {
      const findOneSpy = jest.spyOn(ordersRepositoryDB, 'findOne').mockResolvedValueOnce(mockData.order);
      await instance.findOrder(mockData.printibleId);
      expect(findOneSpy).toHaveBeenCalledWith(mockData.printibleId);
    });

    it('should throw new InternalServerErrorException if error while finding order', async () => {
      jest.spyOn(ordersRepositoryDB, 'findOne').mockImplementationOnce(
        (error) => Promise.reject(error)
      );
      await expect(instance.findOrder('123')).rejects.toEqual(
        new BadRequestException('No such order. Printible_id: 123')
      );
    });

    it('should throw new NotFoundException if _order is undefined', async () => {
      jest.spyOn(ordersRepositoryDB, 'findOne').mockImplementationOnce(() => Promise.resolve(undefined));
      await expect(instance.findOrder('123')).rejects.toEqual(
        new NotFoundException('No such order. Printible_id: 123')
      );
    });
  });

  describe('create', () => {
    it('should invoke ordersRepository.save with correct params', async () => {
      const saveSpy = jest.spyOn(ordersRepositoryDB, 'save').mockResolvedValueOnce(mockData.order);
      await instance.create(
        mockData.orderRequest, mockData.referer,
        mockData.newUiVersion, new Date(), Brand.Edible, mockData.userAgent, undefined
      );
      expect(saveSpy).toHaveBeenCalled();
    });

    it('should return the newOrder', async () => {
      jest.spyOn(ordersRepositoryDB, 'save').mockResolvedValueOnce(mockData.order);
      const response = await instance.create(
        mockData.orderRequest, mockData.referer,
        mockData.newUiVersion, new Date(), Brand.Edible, mockData.userAgent, undefined
      );
      expect(response).toEqual(mockData.newOrderResponse);
    });
  });

  describe('updateWith', () => {
    it('should invoke findOrder with correct params', async () => {
      jest.spyOn(instance, 'findOrder').mockResolvedValueOnce(mockData.order);
      const findOrderSpy = jest.spyOn(instance, 'findOrder');
      await instance.updateWith(mockData.orderUpdateRequest, mockData.printibleId);
      expect(findOrderSpy).toHaveBeenCalledWith(mockData.printibleId);
    });

    it('should invoke ordersRepository.save with the correct params', async () => {
      jest.spyOn(instance, 'findOrder').mockResolvedValueOnce(mockData.order);
      const saveSpy = jest.spyOn(ordersRepositoryDB, 'save').mockResolvedValueOnce(mockData.order);
      await instance.updateWith(mockData.orderUpdateRequest, mockData.printibleId);
      expect(saveSpy).toHaveBeenCalledWith(mockData.orderToSave);
    });

    it('should return the updatedOrder', async () => {
      jest.spyOn(ordersRepositoryDB, 'save').mockResolvedValueOnce(mockData.order);
      jest.spyOn(instance, 'findOrder').mockResolvedValueOnce(mockData.order);
      const response = await instance.updateWith(mockData.orderUpdateRequest, mockData.printibleId);
      expect(response).toEqual(mockData.order);
    });
  });
});
