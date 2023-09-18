import { Injectable, NestInterceptor } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestInterceptor {
  constructor(private readonly authService: AuthService) { }
  async intercept(context: any, next: any) {
    const request = context.switchToHttp().getRequest();
    const user = await this.authService.verifyToken(request);
    request.body.userId = user.id;
    return next.handle();
  }
}

@Injectable()
export class MultiAuthMiddleware implements NestInterceptor {
  constructor(private readonly authService: AuthService) { }
  async intercept(context: any, next: any) {
    const request = context.switchToHttp().getRequest();
    const userId = await this.authService.verifyMultiToken(request);
    request.body.userId = userId;
    return next.handle();
  }
}

