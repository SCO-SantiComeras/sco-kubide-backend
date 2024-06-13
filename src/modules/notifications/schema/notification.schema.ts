import { Schema, Types } from 'mongoose';
import { MONGODB_CONSTANTS } from '../../mongo-db/mongo-db.constants';
import { INotification } from '../interface/inotification.interface';

export const NOTIFICATIONS_SCHEMA = new Schema<INotification>(
  {
    user: { 
      type: Types.ObjectId, 
      ref: MONGODB_CONSTANTS.USERS.MODEL, 
      required: true
    },
    message: {
      type: Types.ObjectId, 
      ref: MONGODB_CONSTANTS.MESSAGES.MODEL, 
      required: true,
    },
    opened: {
      type: Boolean, 
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);