import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('root')
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return ''
  }
}
