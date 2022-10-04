import { Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { GatewaysGateway } from './gateways.gateway';

@Module({
  providers: [GatewaysGateway, GatewaysService],
})
export class GatewaysModule {}
