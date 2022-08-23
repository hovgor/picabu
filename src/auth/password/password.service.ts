import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { client } from 'src/config/config.service.redis';
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { UserValidator } from 'src/shared/validators/user.validator';
import { UsersEntityBase } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import * as securePin from 'secure-pin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailer = require('../../shared/email/mail.sender');
import { v4 as uuidv4 } from 'uuid';
import { ChangePasswordDto } from '../dto/reset.password.dto';
import { ForgotPasswordDto } from '../dto/forgot.password.dto';
import { VerifyPinCodeDto } from '../dto/pin.verify.dto';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    private readonly authService: AuthService,
    private readonly userValidator: UserValidator,
    private readonly passwordHashing: HashPassword,
  ) {}

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

  // change password
  async changePassword(data: ChangePasswordDto) {
    try {
      const verifyTicketId = await client.get(data.email.toLowerCase());
      if (verifyTicketId !== data.ticket) {
        Logger.log('Ticket is not verify');
        throw new BadRequestException('tikets is not mutch');
      }

      if (data.newPassword !== data.confirmPassword) {
        Logger.log('passwords do not mutch');
        throw new BadRequestException(
          'New password and confirm password is not mutch. \n Please try again!!!',
        );
      }
      const validPassword = this.userValidator.userPassword(data.newPassword);
      const hashPassword: string = await this.passwordHashing.PasswordHash(
        validPassword,
      );
      const user: UsersEntityBase = await this.usersRepository.findOne({
        where: { email: data.email.toLowerCase() },
      });
      const id: number = user.id;
      await this.usersRepository.update({ id }, { password: hashPassword });
      return {
        data: null,
        error: false,
        message: 'password is updated!!!',
        success: true,
      };
    } catch (error) {
      Logger.log('error=> change password function ', error);
      throw error;
    }
  }

  // forgot password
  async forgotPassword(data: ForgotPasswordDto) {
    try {
      if (!data) {
        Logger.log('Data is not defined!!');
        throw new NotFoundException('Phon or email is not found!!!');
      }
      const verifyEmail = this.userValidator.userEmail(data.email);
      if (!verifyEmail) {
        Logger.log('error => email is not defined!!');
        throw new BadRequestException('email is not defined!!!');
      }
      const pinVerify = await this.emailVerifyWhitMail(verifyEmail);
      return {
        data: { pinVerify },
        error: false,
        message: null,
        success: true,
      };
    } catch (error) {
      Logger.log('error=> forgot password function ', error);
      throw error;
    }
  }

  async verifyPinCode(data: VerifyPinCodeDto) {
    try {
      if (!data) {
        throw new BadRequestException('data for user is not defined !!!');
      }
      const verifyEmail = this.userValidator.userEmail(data.email);
      if (!verifyEmail) {
        Logger.log('error => email is not defined!!');
        throw new BadRequestException('email is not defined!!!');
      }

      const redisPinCode = await client.get(verifyEmail);
      if (data.pinCode !== redisPinCode) {
        Logger.log('pin code not exist!!!');
        throw new BadRequestException('pin is not exist!!!');
      }
      const ticket = uuidv4();
      await client.del(verifyEmail);
      await client.set(verifyEmail, ticket);
      client.expire(verifyEmail, 60 * 60);
      return {
        data: {
          ticket,
        },
        error: false,
        message: `Pin code is true(${data.pinCode}).`,
        success: true,
      };
    } catch (error) {
      Logger.log('error=> pin code verify function ', error);
      throw error;
    }
  }
}
