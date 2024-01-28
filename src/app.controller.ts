import {
  Controller, Get
} from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  get():string {
    return 'OK';
  }

  @Get('/api')
  get_api():string {
    return 'OK';
  }
}
