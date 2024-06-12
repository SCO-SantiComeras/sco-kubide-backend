export interface IUser {
  _id?: string;
  email: string;
  name: string;
  password: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
