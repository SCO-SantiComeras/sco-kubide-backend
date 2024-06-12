import { IMessage } from "src/modules/messages/interface/imessage.interface";
import { IUser } from "src/modules/users/interface/iuser.interface";

export interface INotification {
  _id?: string;
  user: IUser;
  message: IMessage;
  opened?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
