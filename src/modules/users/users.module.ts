
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongoDbService } from '../mongo-db/mongo-db.service';
import { IUser } from './interface/iuser.interface';
import { USERS_SCHEMA } from './schema/user.schema';
import { MONGODB_CONSTANTS } from '../mongo-db/mongo-db.constants';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SharedModule,
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    UsersService,
    {
      provide: 'MODEL',
      useFactory: (db: MongoDbService) =>
        db.getConnection().model<IUser>(MONGODB_CONSTANTS.USERS.MODEL, USERS_SCHEMA, MONGODB_CONSTANTS.USERS.TABLE),
      inject: [MongoDbService],
    },
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule { }
