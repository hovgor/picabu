import {
  Injectable,
  // ConflictException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
// import { client } from 'src/config/config.service.redis';
import { HashPassword } from 'src/shared/password-hash/hash.password';
// import { UserRoles } from 'src/shared/types/roles';
import { UserValidator } from 'src/shared/validators/user.validator';
// import { UserSignInDto } from 'src/users/dto/user.signin.dto';
// import { UserSignUpDto } from 'src/users/dto/user.signup.dto';
import { PasswordlessDto } from 'src/auth/dto/providers.dto';

import { PasswordlessNameDto } from 'src/auth/dto/providers.params.dto';
import { generateNickname } from '../../shared/utils/utils';

import { UsersEntityBase } from '../../modules/users/entity/users.entity';
import * as securePin from 'secure-pin';
import { Repository } from 'typeorm';
// import { jwtConstants } from './constants/jwt.constants';
// import { IJwtPayload } from './constants/jwt.payload.interface';
// import { TokenForDbDto } from './dto/token.for.db.dto';
import { AuthEntityBase } from '../../auth/entity/auth.entity';
import { AuthService } from '../auth.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const mailer = require('../shared/email/mail.sender');

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @InjectRepository(AuthEntityBase)
    public authRepository: Repository<AuthEntityBase>,
    private readonly jwtService: JwtService,
    private readonly userValidator: UserValidator,
    private readonly passwordHashing: HashPassword,
    private readonly authService: AuthService,
  ) {}

  providerAuth = async (data: PasswordlessDto, params: PasswordlessNameDto) => {
    const provider = params.providerName;
    const { deviceId, providerId, ...profile } = data;
    try {
      const user = await this.usersRepository.findOne({
        where: { provider, providerId },
      });
      let userId = user.id;
      const nickname = generateNickname.generateNickname();
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
