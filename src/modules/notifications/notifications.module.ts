import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SharedModule } from "../shared/shared.module";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { MongoDbService } from "../mongo-db/mongo-db.service";
import { MONGODB_CONSTANTS } from "../mongo-db/mongo-db.constants";
import { INotification } from "./interface/inotification.interface";
import { NOTIFICATIONS_SCHEMA } from "./schema/notification.schema";
import { MessagesModule } from "../messages/messages.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SharedModule,
    forwardRef(() => MessagesModule),
    UsersModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: 'MODEL',
      useFactory: (db: MongoDbService) =>
        db.getConnection().model<INotification>(MONGODB_CONSTANTS.NOTIFICATIONS.MODEL, NOTIFICATIONS_SCHEMA, MONGODB_CONSTANTS.NOTIFICATIONS.TABLE),
      inject: [MongoDbService],
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule { }
