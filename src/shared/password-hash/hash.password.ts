import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'src/config/config.service';
@Injectable()
export class HashPassword {
  constructor(private readonly configService: ConfigService) {}
  async PasswordHash(password: string) {
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      return hash;
    } catch (error) {
      throw new ForbiddenException('Password heshing is wrong!!!');
    }
  }
  async IsMutchPassword(password: string, passwordHash: string) {
    try {
      await bcrypt.genSalt();
      const isMatch = await bcrypt.compare(password, passwordHash);
      return isMatch;
    } catch (error) {
      throw new ForbiddenException('Password heshing is not match!!!');
    }
  }
}
