import {
  BadRequestException,
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
import { UserSignInDto } from 'src/users/dto/user.signin.dto';
import { UserSignUpDto } from 'src/users/dto/user.signup.dto';
import { UsersEntityBase } from 'src/users/entity/users.entity';
import * as securePin from 'secure-pin';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants/jwt.constants';
import { IJwtPayload } from './constants/jwt.payload.interface';
import { TokenForDbDto } from './dto/token.for.db.dto';
import { AuthEntityBase } from './entity/auth.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailer = require('../shared/email/mail.sender');

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
  async createAccessToken(user: UsersEntityBase, ip: string) {
    try {
      const hashId = await this.hashIdUser(user.id);
      const payload: IJwtPayload = {
        email: user.email,
        sub: hashId,
        role: user.role,
        ip: ip,
        deviceId: user.deviceId,
      };

      return this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresInAccessToken,
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        'error: create jwt token=> access ',
        error,
      );
    }
  }

  // create refresh token
  async createRefreshToken(user: UsersEntityBase | any, ip = '127.0.0.2') {
    try {
      const hashId = await this.hashIdUser(user.id);
      const payload: IJwtPayload = {
        email: user.email,
        sub: hashId,
        role: user.role,
        ip: ip,
        deviceId: user.deviceId,
      };

      return this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresInRefreshToken,
      });
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
      return await this.authRepository.save(this.authRepository.create(data));
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
      const nicname = this.userValidator.userNicname(data.nicname);
      if (!nicname) {
        Logger.log('error=> nicname is not defined!!!');
        throw new BadRequestException('Nicname not exist!!!');
      }
      const verifyEmail = this.userValidator.userEmail(data.email);
      if (!verifyEmail) {
        Logger.log('error => email is not defined!!');
        throw new BadRequestException('email is not defined!!!');
      }
      const isExist = await this.usersRepository.findOne({
        where: { email: verifyEmail },
      });
      if (isExist) {
        Logger.log(`user whit this email(${verifyEmail}) olredy exist`);
        throw new BadRequestException('email already exists!!');
      }
      if (data.password !== data.passwordConfirm) {
        Logger.log('Passwords do not match');
        throw new BadRequestException('Passwords do not match');
      }
      const redisPinCode = await client.get(verifyEmail);

      if (data.pinCode !== redisPinCode) {
        Logger.log('pin code not exist!!!');
        throw new BadRequestException('pin is not exist!!!');
      }

      const verifyPassword = this.userValidator.userPassword(data.password);
      const passwordHash = await this.passwordHashing.PasswordHash(
        verifyPassword,
      );
      const user: UsersEntityBase = await this.usersRepository.save(
        this.usersRepository.create({
          nicname: data.nicname,
          email: verifyEmail,
          password: passwordHash,
          role: UserRoles.User,
          deviceId: data.deviceId,
        }),
      );
      const accessToken = await this.createAccessToken(user, '');
      const refreshToken = await this.createRefreshToken(user, '');
      if (!accessToken || !refreshToken) {
        Logger.log('tokens are undefined');
        throw new UnprocessableEntityException('tokens are undefined');
      }
      await this.insertTokenInDb({
        userId: user.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      return {
        data: { accessToken, refreshToken, verifyEmail },
        error: false,
        success: true,
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
      const message = {
        to: verifyEmail,
        subject: 'Verify accaunt',
        test: `Your pin code => ${pin}`,
        html: `<h1>Your pin code => ${pin}</h1>`,
      };
      client.set(verifyEmail, pin);
      client.expire(verifyEmail, 60 * 60);
      const sendEmail = mailer(message);
      if (sendEmail) {
        return {
          // data: null,
          // error: false,
          message: `email sent to mail ${email}`,
          // success: true,
          // pin: pin,
        };
      } else {
        return {
          // data: null,
          // error: true,
          message: `email don't sent to mail ${email}`,
          success: false,
        };
      }
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
      const accessToken = await this.createAccessToken(user, '');
      const refreshToken = await this.createRefreshToken(user, '');
      if (!accessToken || !refreshToken) {
        Logger.log('tokens are undefined');
        throw new UnprocessableEntityException('tokens are undefined');
      }
      await this.insertTokenInDb({
        userId: user.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        deviceId: data.deviceId,
      });
      return {
        data: {
          accessToken,
          refreshToken,
          verifyEmail,
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
  async verifyToken(data: string) {
    try {
      const token = await this.decodeToken(data);
      if (!token) {
        throw new UnauthorizedException('User is not authorized!!!');
      }
      const id: number = await this.afterDecode(data);
      return id;
    } catch (error) {
      Logger.log('error=> token verify function ', error);
      throw error;
    }
  }
}
