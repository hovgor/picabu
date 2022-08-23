import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntityBase } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
  ) {}

  // get user by Id
  async getUserById(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        Logger.log('id is not defined!!');
        throw new NotFoundException('User does not exist!!!');
      }
      return {
        data: {
          id: user.id,
          nicname: user.nicname,
          email: user.email,
        },
      };
    } catch (error) {
      Logger.log('error=> get user by Id', error);
      throw error;
    }
  }
  // get user whit email
  async getUserWhitEmail(email: string) {
    try {
      if (!email) {
        throw new BadRequestException('email is not exist');
      }
      return await this.usersRepository.findOne({ where: { email: email } });
    } catch (error) {
      throw error;
    }
  }

  // delete user whit Id
  async deleteUserWhitId(id: number) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        Logger.log('user does not exist!!');
        throw new BadRequestException('User is not exist!!! ');
      }
      await this.usersRepository.delete(id);
      return {
        data: null,
        message: 'User has been deleted!',
        success: true,
      };
    } catch (error) {
      Logger.log('error=> delete user whit Id function!!', error);
      throw error;
    }
  }
}
