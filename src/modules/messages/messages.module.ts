import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { MongoDbService } from "../mongo-db/mongo-db.service";
import { IMessage } from "./interface/imessage.interface";
import { MONGODB_CONSTANTS } from "../mongo-db/mongo-db.constants";
import { messageSchema } from "./schema/message.schema";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    forwardRef(() => MessagesModule),
  ],
  controllers: [
    MessagesController,
  ],
  providers: [
    MessagesService,
    {
      provide: 'MODEL',
      useFactory: (db: MongoDbService) =>
        db.getConnection().model<IMessage>(MONGODB_CONSTANTS.MESSAGES.MODEL, messageSchema, MONGODB_CONSTANTS.MESSAGES.TABLE),
      inject: [MongoDbService],
    },
  ],
  exports: [
    MessagesService,
  ],
})
export class MessagesModule { }
