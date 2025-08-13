import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordHasherMiddleware } from 'src/password-hasher/password-hasher.middleware';
import { AuthenticationMiddleware } from 'src/authentication/authentication.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PasswordHasherMiddleware)
      .forRoutes({ path: 'client', method: RequestMethod.POST });
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes({ path: 'client/login', method: RequestMethod.POST });
  }
}
