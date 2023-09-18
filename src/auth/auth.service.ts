import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { client } from 'src/config/config.service.redis';
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { UserRoles } from 'src/shared/types/roles';
import { UserValidator } from 'src/shared/validators/user.validator';
import { UserSignInDto } from 'src/modules/users/dto/user.signin.dto';
import { UserSignUpDto } from 'src/modules/users/dto/user.signup.dto';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import * as securePin from 'secure-pin';
import { Repository } from 'typeorm';
import { IJwtPayload } from './strategies/jwt.payload.interface';
import { TokenForDbDto } from './dto/token.for.db.dto';
import { AuthEntityBase } from './entity/auth.entity';
import { LogoutDto } from './dto/logout.dto';
import { EmailVerifyDto } from 'src/modules/users/dto/email.verify.dto';
import { pinMailSender } from '../shared/email/mail.sender';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @InjectRepository(AuthEntityBase)
    public authRepository: Repository<AuthEntityBase>,
    private readonly jwtService: JwtService,
    private readonly userValidator: UserValidator,
    private readonly passwordHashing: HashPassword,
  ) {}

  async verifyUser(data: EmailVerifyDto) {
    try {
      const existEmail = await this.usersRepository.findOne({
        where: { email: data.email },
      });
      if (existEmail) {
        throw new ConflictException(
          `User with this email(${data.email}) already exists!!!`,
        );
      }
      const existNickname = await this.usersRepository.findOne({
        where: { nickname: data.nickname },
      });
      if (existNickname) {
        throw new ConflictException(
          `User with this nickname(${data.nickname}) already exists!!!`,
        );
      }
      const isValidPass: boolean = this.userValidator.userPassword(
        data.password,
      );
      if (!isValidPass) {
        throw new BadRequestException(
          'Invalid password!!!',
          'Password must be at least 8 letters, of which at least one large letter and at least one digit.',
        );
      }
      const sender = await this.emailVerifyWhitMail(data.email);
      return { data: sender, error: false, message: 'Pin code sent to email.' };
    } catch (error) {
      throw error;
    }
  }

  // decode token
  async decodeToken(token: string) {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // after decode token
  async afterDecode(token: string | any) {
    try {
      const user = await this.decodeToken(token);
      const id = await this.decodeHashIdUser(user.sub);
      return id;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // create access token
  async createAccessToken(user: UsersEntityBase) {
    try {
      const hashId = await this.hashIdUser(user.id);
      const payload: IJwtPayload = {
        email: user.email,
        sub: hashId,
        role: user.role,
        deviceId: user.deviceId,
      };
      const token = await this.jwtService.signAsync(payload);
      return token;
    } catch (error) {
      throw new UnprocessableEntityException(
        'error: create jwt token=> access ',
        error,
      );
    }
  }

  // create refresh token
  async createRefreshToken(user: UsersEntityBase | any) {
    try {
      const hashId = await this.hashIdUser(user.id);
      const payload: IJwtPayload = {
        email: user.email,
        sub: hashId,
        role: user.role,
        deviceId: user.deviceId,
      };
      const token = await this.jwtService.signAsync(payload);
      return token;
    } catch (error) {
      throw new UnprocessableEntityException(
        'error: create jwt token => refresh ',
        error,
      );
    }
  }

  // hash id user
  async hashIdUser(id: number) {
    try {
      const status418 = 418;
      const statusName = "I'm_a_teapot";
      const binary = id.toString(2);
      const str = status418 + binary + status418 + statusName;
      return str;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // incode hash id user
  async decodeHashIdUser(str: string) {
    try {
      const re = /\s*418\s*/;
      const nameList = str.split(re);
      const str2: any = nameList[1];
      let dec = 0;
      for (let i = 0; i < str2.length; ++i) {
        dec = dec + str2[i] * 2 ** (str2.length - i);
      }
      dec /= 2;
      return dec;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // insert tokens in db
  async insertTokenInDb(data: TokenForDbDto) {
    try {
      if (!data) {
        throw new NotFoundException('tokens data is not defined!!!');
      }
      const queryBuilder = this.authRepository
        .createQueryBuilder()
        .insert()
        .into(AuthEntityBase)
        .values(data)
        .orUpdate(['access_token', 'refresh_token'], ['device_id', 'user_id']);
      return queryBuilder.execute();
    } catch (error) {
      Logger.log('error: tokens not defined!!!');
      throw error;
    }
  }

  // delete tokens in db
  async deleteTokensInDb(id: number) {
    try {
      await this.authRepository.delete(id);
    } catch (error) {
      Logger.log('error => ', error);
      throw error;
    }
  }

  async createNewUser(data: UserSignUpDto) {
    try {
      if (!data) {
        throw new BadRequestException('data for user is not defined !!!');
      }
      const nickname = this.userValidator.userNickname(data.nickname);
      if (!nickname) {
        Logger.log('error=> nickname is not defined!!!');
        throw new BadRequestException('Nickname not Allowed !');
      }

      const verifyEmail = this.userValidator.userEmail(data.email);
      if (!verifyEmail) {
        Logger.log('error => email is not defined!!');
        throw new BadRequestException('Email Nickname not Allowed!');
      }
      const emailExists = await this.usersRepository.findOne({
        where: { email: verifyEmail },
      });

      const nicknameExists = await this.usersRepository.findOne({
        where: { nickname },
      });

      if (emailExists) {
        Logger.log(`User with email (${verifyEmail}) alredy exists`);
        throw new BadRequestException('Email already exists !');
      }

      if (nicknameExists) {
        Logger.log(`User with nickname (${nickname}) alredy exists`);
        throw new BadRequestException('Nickname already exists !');
      }

      const redisPinCode = await client.get(verifyEmail);

      if (data.pinCode !== redisPinCode) {
        Logger.log('pin code not exist!!!');
        throw new BadRequestException('pin is not exist!!!');
      }

      const verifyPassword = this.userValidator.userPassword(data.password);
      if (!verifyPassword) {
        throw new BadRequestException('Invalid password');
      }
      const passwordHash = await this.passwordHashing.PasswordHash(
        data.password,
      );
      const user: UsersEntityBase = await this.usersRepository.save(
        this.usersRepository.create({
          nickname: data.nickname,
          email: verifyEmail,
          password: passwordHash,
          role: UserRoles.User,
          deviceId: data.deviceId,
        }),
      );
      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user);
      if (!accessToken || !refreshToken) {
        Logger.log('tokens are undefined');
        throw new UnprocessableEntityException('tokens are undefined');
      }
      await this.insertTokenInDb({
        user: user.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        deviceId: data.deviceId,
      });

      return {
        data: { accessToken, refreshToken, id: user.id },
        error: false,
        message: `Tokens for user ${verifyEmail}.`,
      };
    } catch (error) {
      Logger.log('error: create user don`t work ', error);
      throw error;
    }
  }

  // email verify
  async emailVerifyWhitMail(email: string) {
    try {
      const pin = securePin.generatePinSync(6);

      const verifyEmail = this.userValidator.userEmail(email);

      if (!verifyEmail) {
        Logger.log('error => email is not defined!!');
        throw new BadRequestException('email is not defined!!!');
      }

      client.set(verifyEmail, pin);
      client.expire(verifyEmail, 60 * 10);

      const sendEmail = await pinMailSender(verifyEmail, pin);
      return sendEmail;
    } catch (error) {
      Logger.log('error=> email not exist!!!');
      throw error;
    }
  }

  // sign in user
  async signInUser(data: UserSignInDto) {
    try {
      if (!data) {
        throw new BadRequestException('data for user is not defined !!!');
      }
      const verifyEmail = this.userValidator.userEmail(data.email);
      if (!verifyEmail) {
        Logger.log('error => email is not defined!!');
        throw new BadRequestException('email is not defined!!!');
      }

      const user: UsersEntityBase = await this.usersRepository.findOne({
        where: { email: verifyEmail },
      });
      if (!user) {
        Logger.log('User is not exist!!!');
        throw new BadRequestException(
          'Please enter correct email or password!!!',
        );
      }
      const isMatch = await this.passwordHashing.IsMutchPassword(
        data.password,
        user.password,
      );
      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }

      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user);
      if (!accessToken || !refreshToken) {
        Logger.log('tokens are undefined');
        throw new UnprocessableEntityException('tokens are undefined');
      }
      await this.insertTokenInDb({
        user: user.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        deviceId: data.deviceId,
      });
      return {
        data: {
          id: user.id,
          accessToken,
          refreshToken,
        },
        error: false,
        message: null,
      };
    } catch (error) {
      Logger.log('error=> sign in user function error!!! ');
      throw error;
    }
  }

  // token verify
  async verifyToken(request: any) {
    try {
      const token = (request.headers['authorization'] + '').split(' ')[1];

      const decToken = await this.decodeToken(token);

      if (!decToken) {
        Logger.log('User is not authorized!!!');
        throw new UnauthorizedException('User is not authorized!!!');
      }
      const id: number = await this.afterDecode(token);

      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user?.id) {
        Logger.log('Wrong authorization token provided !!!');
        throw new UnauthorizedException(
          'Wrong authorization token provided !!!',
        );
      }

      return user;
    } catch (error) {
      Logger.log('error=> token verify function ', error);
      throw error;
    }
  }

  async verifyMultiToken(request: any) {
    try {
      const token = (request.headers['authorization'] + '').split(' ')[1];
      const decToken = await this.decodeToken(token);
      if (!decToken) return null;
      const id: number = await this.afterDecode(token);
      const user = await this.usersRepository.findOne({ where: { id } });
      return user.id || null;
    } catch (error) {
      Logger.log('error=> token verify function ', error);
      throw error;
    }
  }

  // logout
  async logout(data: LogoutDto, request: any) {
    try {
      const user: UsersEntityBase = await this.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User is not authorized!!!');
      }

      const isValidToken = await this.authRepository.findOne({
        where: { user: user.id, deviceId: data.deviceId },
      });

      if (!isValidToken) {
        throw new BadRequestException('No Such Device registered !');
      }
      const token = (request.headers['authorization'] + '').split(' ')[1];

      if (isValidToken.accessToken !== token) {
        throw new UnauthorizedException({
          data: null,
          error: true,
          message: 'vaffanculo!!! ',
        });
      }
      await this.authRepository.delete({
        deviceId: data.deviceId,
        user: user.id,
      });

      return { data: null, error: false, message: 'Logged Out Successfully.' };
    } catch (error) {
      Logger.log('error=> logout user function ', error);
      throw error;
    }
  }

  // logout all devices
  async logoutAllDevices(request: any) {
    try {
      const user: UsersEntityBase = await this.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User is not authorized!!!');
      }
      await this.authRepository;
      await this.authRepository.delete({
        user: user.id,
      });

      return {
        data: null,
        error: false,
        message: 'User is logout all devices!!!',
      };
    } catch (error) {
      Logger.log('error=> logout user function ', error);
      throw error;
    }
  }

  async revokeTokens(headers: any) {
    try {
      let reqRefreshToken = headers['refresh_token'];
      if (reqRefreshToken.includes('Bearer')) {
        reqRefreshToken = (reqRefreshToken + '').split(' ')[1];
      }

      if (!reqRefreshToken)
        throw new BadRequestException('Wrong Type of refresh_token !');

      const decodeToken: any = await this.decodeToken(reqRefreshToken);
      const now = Math.floor(Date.now() / 1000);
      if (decodeToken.exp < now)
        throw new BadRequestException('Expired refresh_token !');

      const userId = await this.afterDecode(reqRefreshToken);
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user);

      await this.authRepository.update(
        { user: userId },
        { accessToken: accessToken, refreshToken: refreshToken },
      );

      return {
        data: { accessToken, refreshToken },
        error: false,
        message: 'You have refreshed your tokens successfully !',
      };
    } catch (error) {
      throw error;
    }
  }
}
