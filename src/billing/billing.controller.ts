import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import {
  ClickCompleteIncomingDto,
  ClickPrepareIncomingDto,
} from './dto/billing.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('click/prepare/:token')
  clickPrepare(@Body() params: ClickPrepareIncomingDto) {
    console.log(params);

    return this.billingService.prepare(params);
  }

  @Post('click/complete/:token')
  clickComplete(@Body() params: ClickCompleteIncomingDto) {
    console.log(params);
    return this.billingService.complete(params);
  }
}
