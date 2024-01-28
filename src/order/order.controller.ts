import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import {
  Body, Controller, Post, UploadedFile, Headers, Put, Param, UsePipes
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { SwaggerCreateOrder } from './decorators/swagger.create-order.decorator';
import { SwaggerUpdateOrder } from './decorators/swagger.update-order.decorator';
import { OrderUpdateResponseDto } from './dto/order-update-response.dto';
import { OrderUpdateRequestDto } from './dto/order-update-request.dto';
import { OrderRequestDto } from './dto/order-request.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { File } from '../_common/types/file.type';
import { OrderService } from './order.service';
import { IpAddress } from '../_common/decorators/client-ip.decorator';

@ApiTags('Orders')
@Controller('api/order')
export class OrderController {
  constructor(
    private orderService: OrderService
  ) {}

  @SwaggerCreateOrder()
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('file')
  )
  async create(
    @UploadedFile() file: File,
      @Body() orderRequestDto: OrderRequestDto,
      @Headers('Custom-Referer') referrer: string,
      @Headers('X-Service-Version') uiVersion: string,
      @Headers('User-Agent') userAgent?: string,
      @IpAddress() clientIp?: string
  ):Promise<OrderResponseDto> {
    return this.orderService.create(
      orderRequestDto, referrer, uiVersion, userAgent, file, clientIp
    );
  }

  @SwaggerUpdateOrder()
  @Put('/:printible_id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Body() orderUpdateRequestDto: OrderUpdateRequestDto,
      @Param('printible_id') printibleId: string
  ): Promise<OrderUpdateResponseDto> {
    return this.orderService.update(orderUpdateRequestDto, printibleId);
  }
}
