import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProvidersService } from './providers.service';
import { PasswordlessDto } from 'src/auth/dto/providers.dto';
import { PasswordlessNameDto } from 'src/auth/dto/providers.params.dto';

@Controller('provider')
@ApiTags('Provider')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('/:name')
  async signUp(
    @Body() body: PasswordlessDto,
    @Param() params: PasswordlessNameDto,
    @Res() res: Response,
  ) {
    try {
      const newUser = await this.providersService.providerAuth(body, params);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (error) {
      throw error;
    }
  }
}
