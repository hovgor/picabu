import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordlessDto } from 'src/auth/dto/providers.dto';
import { PasswordlessNameDto } from 'src/auth/dto/providers.params.dto';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import { Repository } from 'typeorm';
import { Utils } from 'src/shared/utils/utils';
import { AuthService } from '../auth.service';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,

    private readonly authService: AuthService,
  ) {}

  providerAuth = async (data: PasswordlessDto, params: PasswordlessNameDto) => {
    const provider = params.providerName;
    const { deviceId, providerId } = data;
    try {
      let registrationStatus = 'in';
      let user = await this.usersRepository.findOne({
        where: { provider, providerId },
      });

      if (!user) {
        let nickname = Utils.generateNickname(data.email);
        let userExists = await this.usersRepository.findOne({
          where: { nickname },
        });

        while (userExists) {
          nickname = Utils.generateNickname(data.email);
          userExists = await this.usersRepository.findOne({
            where: { nickname },
          });
        }

        data.nickname = nickname;
        user = await this.usersRepository.save(
          this.usersRepository.create(data),
        );

        registrationStatus = 'up';
      }

      const accToken = await this.authService.createAccessToken(user);
      const refToken = await this.authService.createRefreshToken(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const insertedTokenToDb = await this.authService.insertTokenInDb({
        user: user.id,
        accessToken: accToken,
        refreshToken: refToken,
        deviceId,
      });

      return {
        data: {
          userId: user.id,
          nickname: user.nickname,
          accessToken: accToken,
          refreshToken: refToken,
        },
        error: false,
        message: `Signed ${registrationStatus} Successfully`,
      };
    } catch (error) {
      throw error;
    }
  };
}
