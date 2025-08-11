import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class PasswordHasherMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    //TODO: make this hash the password received whenever it is making a new client account
    next();
  }
}
