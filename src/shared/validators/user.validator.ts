import { BadRequestException, Logger } from '@nestjs/common';

export class UserValidator {
  public userEmail(email: string) {
    try {
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (email.match(validRegex)) {
        return email.toLowerCase();
      } else {
        throw new BadRequestException('Invalid email address!!!');
      }
    } catch (error) {
      throw error;
    }
  }

  public userPassword(password: string) {
    try {
      const validRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&]{8,}$/;
      if (password.match(validRegex)) {
        return true;
      } else {
        Logger.log(`'Invalid password(${password})!!!' `);
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
  public userNickname(nickname: string) {
    try {
      const validRegex = /^[A-Za-z0-9]+([A-Za-z0-9]*|[._]?[A-Za-z0-9]+)*$/;
      if (nickname.match(validRegex)) {
        return nickname;
      } else {
        Logger.log(`'Invalid nickname(${nickname})!!!' `);
        throw new BadRequestException('Invalid nickname!!!');
      }
    } catch (error) {
      throw error;
    }
  }
}
