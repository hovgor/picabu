import { Test, TestingModule } from '@nestjs/testing';
import { GatewaysGateway } from './gateways.gateway';
import { GatewaysService } from './gateways.service';

describe('GatewaysGateway', () => {
  let gateway: GatewaysGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatewaysGateway, GatewaysService],
    }).compile();

    gateway = module.get<GatewaysGateway>(GatewaysGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
