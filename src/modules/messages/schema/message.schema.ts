import { Schema, Types } from 'mongoose';
import { IMessage } from '../interface/imessage.interface';
import { MONGODB_CONSTANTS } from 'src/modules/mongo-db/mongo-db.constants';

export const messageSchema = new Schema<IMessage>(
  {
    from: { 
      type: Types.ObjectId, 
      ref: MONGODB_CONSTANTS.USERS.MODEL, 
      required: true
    },
    to: {
      type: Types.ObjectId, 
      ref: MONGODB_CONSTANTS.USERS.MODEL, 
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);