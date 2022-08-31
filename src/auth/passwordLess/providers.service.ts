import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordlessDto } from 'src/auth/dto/providers.dto';
import { PasswordlessNameDto } from 'src/auth/dto/providers.params.dto';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
// import { generateNickname } from '../../shared/utils/utils';
import { Repository } from 'typeorm';
import { AuthEntityBase } from '../../auth/entity/auth.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @InjectRepository(AuthEntityBase)
    public authRepository: Repository<AuthEntityBase>,
    private readonly authService: AuthService,
  ) {}

  providerAuth = async (data: PasswordlessDto, params: PasswordlessNameDto) => {
    const provider = params.providerName;
    const { deviceId, providerId } = data;
    try {
      const user = await this.usersRepository.findOne({
        where: { provider, providerId },
      });
      let userId = user.id;
      // const nickname = generateNickname.generateNickname();
      if (!user) {
        const createProviderUser = await this.usersRepository.save(
          this.usersRepository.create(data),
        );
        userId = createProviderUser.id;
      }
      const accToken = await this.authService.createAccessToken(user);
      const refToken = await this.authService.createRefreshToken(user);
      const insertedTokenToDb = await this.authService.insertTokenInDb({
        userId,
        accessToken: accToken,
        refreshToken: refToken,
        deviceId,
      });
      return {
        data: insertedTokenToDb,
        error: false,
        message: 'Signed Up Successfully',
      };
    } catch (error) {
      throw error;
    }
  };
}
