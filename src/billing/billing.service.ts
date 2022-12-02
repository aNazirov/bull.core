import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from 'src/payment/payment.service';
import { Enums } from 'src/utils';
import {
  ClickComplete,
  ClickCompleteIncomingDto,
  ClickPrepare,
  ClickPrepareIncomingDto,
} from './dto/billing.dto';

@Injectable()
export class BillingService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly payment: PaymentService,
  ) {}

  async prepare(params: ClickPrepareIncomingDto): Promise<ClickPrepare> {
    let payment: any = await this.prisma.payment.findUnique({
      where: { id: +params.merchant_trans_id },
    });

    if (!payment) {
      console.log({
        click_trans_id: params.click_trans_id,
        merchant_trans_id: params.merchant_trans_id,
        error: 400,
        error_note: 'User or payment not found',
      });

      return {
        click_trans_id: params.click_trans_id,
        merchant_trans_id: params.merchant_trans_id,
        error: 400,
        error_note: 'User or payment not found',
      };
    }

    payment = await this.payment.update(+payment.id, {});

    return {
      click_trans_id: params.click_trans_id,
      merchant_trans_id: params.merchant_trans_id,
      merchant_prepare_id: payment.id,
      error: 0,
      error_note: 'Success',
    };
  }

  async complete(params: ClickCompleteIncomingDto): Promise<ClickComplete> {
    let payment: any = await this.prisma.payment.findUnique({
      where: { id: +params.merchant_trans_id },
    });

    if (!payment) {
      console.log({
        click_trans_id: +params.click_trans_id,
        merchant_trans_id: params.merchant_trans_id,
        error: 400,
        error_note: 'User or payment not found',
      });

      return {
        click_trans_id: +params.click_trans_id,
        merchant_trans_id: params.merchant_trans_id,
        error: 400,
        error_note: 'User or payment not found',
      };
    }

    payment = await this.payment.update(payment.id, {
      statusId:
        +params.error >= 0
          ? Enums.PaymentStatusType.Success
          : Enums.PaymentStatusType.Fail,
    });

    return {
      click_trans_id: +params.click_trans_id,
      merchant_trans_id: params.merchant_trans_id,
      merchant_prepare_id: +params.merchant_prepare_id,
      error: 0,
      error_note: 'Success',
    };
  }
}
