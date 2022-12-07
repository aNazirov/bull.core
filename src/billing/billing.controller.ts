import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import { ClickCompleteIncomingDto } from './dto/billing.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('complete')
  complete(@Body() params: ClickCompleteIncomingDto) {
    return this.billingService.complete(params);
  }
}
