import { EMAIL_VALIDATION } from 'src/shared/constants/email';

export class UserLoginValidationPipe {
  public static isEmail(email: string): boolean {
    const regex = new RegExp(EMAIL_VALIDATION);
    return regex.test(email);
  }
}
