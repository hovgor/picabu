import {
  BadRequestException,
  ConflictException,
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
import { pinMailSender, formMailSender } from 'src/shared/email/mail.sender';
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { EditProfileDto } from '../dto/edit.profile.dto';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import {
  ChangeNicknameDto,
  ChangePasswordDto,
  ChangePhotoDto,
  VerifyEmailDto,
  VerifyPhoneDto,
} from '../dto/settings.dto';
import { sendSms } from 'src/config/sms.config';

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

    @InjectRepository(PostsEntityBase)
    private readonly postsRepository: Repository<PostsEntityBase>,
  ) {}

  // change Profile Photo
  async changeProfilePhoto(body: ChangePhotoDto) {
    try {
      const { profilePhoto, userId } = body;
      await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ profilePhotoUrl: profilePhoto })
        .where('id = :id', { id: userId })
        .execute();

      return {
        data: null,
        error: false,
        message: 'Your Profile Photo has been updated.',
      };
    } catch (error) {
      Logger.log("error=> Can't update profile photo", error);
      throw error;
    }
  }

  async deleteProfilePhoto(body: any) {
    try {
      const { userId } = body;
      await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ profilePhotoUrl: null })
        .where('id = :id', { id: userId })
        .execute();

      return {
        data: null,
        error: false,
        message: 'Your Profile Photo has been Deleted.',
      };
    } catch (error) {
      Logger.log("error=> Can't Delete profile photo", error);
      throw error;
    }
  }

  // change UserName
  async changeNickname(body: ChangeNicknameDto, req: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const isMatch = await this.passwordHashing.IsMutchPassword(
        body.password,
        userAuth.password,
      );
      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }
      if (userAuth.nickname === body.nickname) {
        throw new ConflictException(
          `This nickname(${body.nickname}) is exist!`,
          'Try another name!!!',
        );
      }

      const validUserNickname = await this.usersRepository.findOne({
        where: { nickname: body.nickname },
      });

      if (validUserNickname) {
        throw new BadRequestException(
          `This nickname(${body.nickname}) is exist!`,
          'Try another name!!!',
        );
      }

      const user = await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ nickname: body.nickname })
        .where('id = :id', { id: id })
        .execute();
      if (!user) {
        Logger.log("Can't update user Nickname");
        throw new NotFoundException("Can't update user Nickname");
      }
      return {
        data: body.nickname,
        error: false,
        message: 'Your username has been updated.',
      };
    } catch (error) {
      Logger.log("error=> Can't update user Nickname", error);
      throw error;
    }
  }

  //change Email verify
  async changeEmailVerify(data: VerifyEmailDto, req: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const isMatch = await this.passwordHashing.IsMutchPassword(
        data.password,
        userAuth.password,
      );
      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }
      const validEmail = this.validator.userEmail(data.email);
      const existingEmail = await this.usersRepository.findOne({
        where: { email: validEmail },
      });
      if (existingEmail) throw new BadRequestException('Email exists');

      const userExistsInCache = await client.get(validEmail);
      if (userExistsInCache) {
        client.del(validEmail);
      }

      const pin = securePin.generatePinSync(6);

      await pinMailSender(validEmail, pin);

      await client.set(validEmail, pin, {
        EX: 60 * 60 * 24,
        NX: true,
      });
      return {
        data: { email: data.email },
        error: false,
        message: 'Pin Sent To Email',
      };
    } catch (error) {
      Logger.log("error=> Can't update user Email", error);
      throw error;
    }
  }

  async changeEmailConfirm(email: string, pin: string, req: any) {
    try {
      const { userId } = req.body;

      const validEmail = this.validator.userEmail(email);
      const existingUser = await this.usersRepository.findOne({
        where: { email: validEmail },
      });
      if (existingUser) throw new BadRequestException('User exists');

      const pinInCache = await client.get(validEmail);
      if (!pinInCache) throw new BadRequestException('No Pin Found or Expired');
      if (pinInCache !== pin) throw new BadRequestException('Wrong Pin');

      const user = await this.usersRepository
        .createQueryBuilder()
        .update(this.usersRepository)
        .set({ email: validEmail })
        .where('id = :id', { id: userId })
        .execute();
      if (!user) {
        Logger.log("Can't update user Email");
        throw new NotFoundException("Can't update user Email");
      }
      return { data: null, error: false, message: 'email is changed!' };
    } catch (error) {
      Logger.log("error=> Can't update user Email", error);
      throw error;
    }
  }

  async changePassword(data: ChangePasswordDto) {
    try {
      const { id } = data;
      const passwordValidator = this.userValidator.userPassword(
        data.newPassword,
      );
      if (!passwordValidator) {
        throw new BadRequestException('Password is not valid!!!');
      }
      const user = await this.usersRepository.findOne({
        where: { id: id },
      });
      if (!user) throw new Error('No user with such Id');

      const isMatch = await this.passwordHashing.IsMutchPassword(
        data.password,
        user.password,
      );
      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }

      const newPasswordHash = await this.passwordHashing.PasswordHash(
        data.newPassword,
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
      const nickname = this.userValidator.userNickname(data.nickname);
      if (!nickname) {
        Logger.log('error=> nickname is not defined!!!');
        throw new BadRequestException('nickname not exist!!!');
      }
      const validNickname = await this.usersRepository.findOne({
        where: { nickname: nickname },
      });
      if (validNickname && validNickname.nickname !== user.nickname) {
        throw new BadRequestException('this nickname already exist!!!');
      }
      if (!validNickname) {
        await this.usersRepository.update({ id: user.id }, { nickname });
      }
      return { data: nickname, error: false, message: 'nickname updated.' };
    } catch (error) {
      Logger.log('error=> edit profile function ', error);
      throw error;
    }
  }

  async changePhoneVerify(data: VerifyPhoneDto) {
    try {
      const phoneNumberExistsInDb = await this.usersRepository.findOne({
        where: { phone: data.newPhoneNumber },
      });
      if (phoneNumberExistsInDb)
        throw new BadRequestException('this phone number already exist!!!');

      const userExistsInCache = await client.get(data.newPhoneNumber);
      if (userExistsInCache) {
        client.del(data.newPhoneNumber);
      }

      const pin = securePin.generatePinSync(6);

      await client.set(data.newPhoneNumber, pin);
      await client.expire(data.newPhoneNumber, 60 * 10);

      const userData = {
        phone: data.newPhoneNumber,
        pin,
      };

      sendSms(
        userData.phone,
        `Hello from Scelto ! Here is your verification pin - ${pin}`,
      );
      await client.set(data.newPhoneNumber, pin, {
        EX: 60 * 60 * 24,
        NX: true,
      });

      return { data: sendSms, error: false, message: 'nickname updated.' };
    } catch (error) {
      Logger.log('error=> edit profile function ', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async changePhoneConfirm(data: any, request: any) {
    try {
      const { userId, newPhone, pin } = data;
      const phoneNumberExistsInDb = await this.usersRepository.findOne({
        where: { phone: newPhone },
      });
      if (phoneNumberExistsInDb)
        throw new BadRequestException('this phone number already exist!!!');

      //check if user exists that means it has pin in cache
      const pinInCache = await client.get(newPhone);
      if (!pinInCache)
        throw new BadRequestException('No Pin Found or Expired Pin');
      if (pinInCache !== pin) throw new BadRequestException('Wrong Pin');
      await this.usersRepository.update({ id: userId }, { phone: newPhone });
      return {
        data: null,
        error: false,
        message: 'Phone Changed Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async changePrivacy(body: any) {
    try {
      const { userId } = body;
      await this.usersRepository.query(
        ` UPDATE users SET privacy = NOT privacy WHERE id = $1`,
        [userId],
      );
      return {
        data: null,
        error: false,
        message: 'Privacy Changed Successfully !',
      };
    } catch (error) {
      Logger.log('Error Changing Privacy', error);
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
      const messageForm = {
        to: process.env.HELP_CENTER_EMAIL,
        subject: 'help-center',
        html: `<h1>Message => ${message}</h1>
          <h2>users email => ${user.email}</h2>
        `,
      };
      await formMailSender(messageForm);
      return { data: null, error: false, message: 'Messages sent.' };
    } catch (error) {
      Logger.log('error=> users help center function ', error);
      throw error;
    }
  }

  async getMyReatingCount(request: any) {
    try {
      const { userId } = request.body;
      const posts: PostsEntityBase[] = await this.postsRepository.find({
        where: { user: userId },
      });
      let count = 0;
      posts.forEach((element) => {
        count += element.rating;
      });
      return { data: count, error: false, message: 'reating count' };
    } catch (error) {
      Logger.log('error=> get my reating count function ', error);
      throw error;
    }
  }

  async editPageProfileData(request: any) {
    try {
      const { userId } = request;
      const userData = await this.usersRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.nickname',
          'user.email',
          'user.privacy',
          'user.phone',
        ])
        .where({ id: userId })
        .getOne();
      if (!userId) {
        throw new BadRequestException('user id not existe!');
      }
      return {
        data: userData,
        error: false,
        message: 'edit page profile data',
      };
    } catch (error) {
      Logger.log('error=> edit page profile data function ', error);
      throw error;
    }
  }
}
