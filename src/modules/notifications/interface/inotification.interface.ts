import { IMessage } from "../../messages/interface/imessage.interface";
import { IUser } from "../../users/interface/iuser.interface";

export interface INotification {
  _id?: string;
  user: IUser;
  message: IMessage;
  opened?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
