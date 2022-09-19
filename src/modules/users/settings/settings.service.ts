import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntityBase } from '../entity/users.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserValidator } from '../../../shared/validators/user.validator';
import { client } from 'src/config/config.service.redis';
import * as securePin from 'secure-pin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailer = require('../../../shared/email/mail.sender');
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { EditProfileDto } from '../dto/edit.profile.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserValidator))
    private readonly validator: UserValidator,
    @Inject(forwardRef(() => HashPassword))
    private readonly passwordHashing: HashPassword,
    private readonly userValidator: UserValidator,
  ) {}

  // change Profile Photo
  async changeProfilePhoto(req: any, photo: string) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const user = await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ profile_photo_url: photo })
        .where('id = :id', { id: id })
        .execute();
      if (!user) {
        Logger.log("Can't update profile photo");
        throw new NotFoundException("Can't update profile photo");
      }
      return {
        data: {
          user: user,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't update profile photo", error);
      throw error;
    }
  }

  async deleteProfilePhopto(req: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const user = await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ profile_photo_url: null })
        .where('id = :id', { id: id })
        .execute();
      if (!user) {
        Logger.log("Can't delete profile photo");
        throw new NotFoundException("Can't delete profile photo");
      }
      return {
        data: {
          user: user,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't Delete profile photo", error);
      throw error;
    }
  }

  // change UserName
  async changeNickname(body: string, req: any) {
    try {
      const nickname = body;
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const user = await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ nicname: nickname })
        .where('id = :id', { id: id })
        .execute();
      if (!user) {
        Logger.log("Can't update user Nickname");
        throw new NotFoundException("Can't update user Nickname");
      }
      return user.raw;
    } catch (error) {
      Logger.log("error=> Can't update user Nickname", error);
      throw error;
    }
  }

  //change Email verify
  async changeEmailVerify(id: number, email: string, req: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      await this.validator.userEmail(email);
      const existingEmail = await this.usersRepository.findOne({
        where: { email: email },
      });
      if (existingEmail) throw new BadRequestException('Email exists');

      const userExistsInCache = await client.get(email);
      if (userExistsInCache) {
        client.del(email);
      }

      const pin = securePin.generatePinSync(6);
      const userData = {
        email: email,
        pin,
      };
      const message = {
        to: email,
        subject: 'Verify accaunt',
        test: `Your pin code => ${pin}`,
        html: `<h1>Your pin code => ${pin}</h1>`,
      };

      const emailSent = mailer(message);

      await client.set(email, pin, {
        EX: 60 * 60 * 24, //a day in seconds
        NX: true,
      });
      return {
        data: { email: email },
        error: false,
        message: 'Pin Sent To Email',
      };
    } catch (error) {
      Logger.log("error=> Can't update user Email", error);
      throw error;
    }
  }

  async changeEmailConfirm(id: number, email: string, pin: string, req: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      await this.validator.userEmail(email);
      const userType = 'email';
      const existingUser = await this.usersRepository.findOne({
        where: { email: email, userType: userType },
      });
      if (existingUser) throw new BadRequestException('User exists');

      const pinInCache = await client.get(email);
      if (!pinInCache) throw new BadRequestException('No Pin Found or Expired');
      if (pinInCache !== pin) throw new BadRequestException('Wrong Pin');

      const user = await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ email: email })
        .where('id = :id', { id: id })
        .execute();
      if (!user) {
        Logger.log("Can't update user Email");
        throw new NotFoundException("Can't update user Email");
      }
      return {
        data: {
          user: user,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't update user Email", error);
      throw error;
    }
  }

  async changePassword(
    id: number,
    password: string,
    newPassword: string,
    req: any,
  ) {
    try {
      if (password == newPassword)
        throw new Error(
          "Creat a new password that isn't your previous password",
        );

      const user = await this.usersRepository.findOne({
        where: { id: id },
      });
      if (!user) throw new Error('No user with such Id');
      if (password === newPassword)
        throw new Error(
          "Creat a new password that isn't your previous password",
        );

      const isMatch = await this.passwordHashing.IsMutchPassword(
        password,
        user.password,
      );
      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }

      const newPasswordHash = await this.passwordHashing.PasswordHash(
        newPassword,
      );

      const updatePassword = await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ password: newPasswordHash })
        .where('id = :id', { id: id })
        .execute();
      if (!updatePassword) throw new Error('No Such User to update password');
      return {
        data: null,
        error: false,
        message: 'Password Successfully Changed',
      };
    } catch (error) {
      throw error;
    }
  }

  // edit profile
  async editProfile(data: EditProfileDto, request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const nicname = this.userValidator.userNicname(data.nicname);
      if (!nicname) {
        Logger.log('error=> nicname is not defined!!!');
        throw new BadRequestException('Nicname not exist!!!');
      }
      const validNicname = await this.usersRepository.findOne({
        where: { nicname: nicname },
      });
      if (validNicname && validNicname.nicname !== user.nicname) {
        throw new BadRequestException('this nicname already exist!!!');
      }
      if (!validNicname) {
        await this.usersRepository.update({ id: user.id }, { nicname });
      }
      return { data: nicname, error: false, message: 'Nicname updated.' };
    } catch (error) {
      Logger.log('error=> edit profile function ', error);
      throw error;
    }
  }

  // help center
  async usersHelpCenter(message: string, request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const messageing = {
        to: process.env.HELP_CENTER_EMAIL,
        subject: 'help-center',
        test: `help center`,
        html: `<h1>Message => ${message}</h1>
          <h2>users email => ${user.email}</h2>
        `,
      };

      mailer(messageing);
      return { data: null, error: false, message: 'Messages sent.' };
    } catch (error) {
      Logger.log('error=> users help center function ', error);
      throw error;
    }
  }
}
