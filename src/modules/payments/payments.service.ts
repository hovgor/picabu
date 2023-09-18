import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { PaymentCreateDto } from './dto/payment.create.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly http: HttpService) {}
  async paymentYooMoney(request: PaymentCreateDto) {
    try {
      return this.http
        .post('https://yoomoney.ru/quickpay/confirm.xml', {
          params: {
            receiver: request.recipientsWalletNumber,
            lon: -87.6472903440513,
            distance: '5mi',
            datetime_ini: '2022-01-01T15:53:00.000Z',
            datetime_end: '2022-10-11T15:53:00.000Z',
            page: 1,
          },
          headers: {
            'x-api-key':
              process.env.TRIAL_API_KEY || process.env.DEFAULT_API_KEY,
          },
        })
        .pipe(map((response: any) => response.data));
    } catch (error) {
      throw error;
    }
  }
}
