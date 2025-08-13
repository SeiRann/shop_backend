import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CreateClientRequestInterface } from 'src/client/dto/create-client.dto';

@Injectable()
export class PasswordHasherMiddleware implements NestMiddleware {
  async use(req: CreateClientRequestInterface, res: any, next: () => void) {
    //TODO: make this hash the password received whenever it is making a new client account
    const saltRounds = 10;
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
    }

    next();
  }
}
