import { IUser } from "../../users/interface/iuser.interface";

export interface IMessage {
  _id?: string;
  from: IUser;
  to: IUser;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}
