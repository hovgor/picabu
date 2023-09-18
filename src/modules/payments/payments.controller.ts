import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentCreateDto } from './dto/payment.create.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('payment-YooMoney')
  async yooMoneyQuickPay(@Body() body: PaymentCreateDto, @Res() res: Response) {
    try {
      const paymentYooMoney = await this.paymentsService.paymentYooMoney(body);
      return res.status(HttpStatus.CREATED).json(paymentYooMoney);
    } catch (error) {
      throw error;
    }
  }
}
