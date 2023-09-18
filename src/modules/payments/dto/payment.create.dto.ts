import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaymentCreateDto {
  @ApiProperty()
  @IsString()
  recipientsWalletNumber: string;

  @ApiProperty()
  @IsString()
  quickpayForm: string;

  @ApiProperty()
  @IsString()
  paymentType?: string;

  @ApiProperty()
  @IsString()
  sumCurrencyAmount?: string;

  @ApiPropertyOptional({ default: null, maxLength: 64 })
  @IsString()
  label?: string;

  @ApiPropertyOptional({ default: null })
  @IsString()
  successURL?: string;
}
