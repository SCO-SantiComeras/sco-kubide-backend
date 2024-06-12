import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { IMessage } from "./interface/imessage.interface";
import { UsersService } from "../users/users.service";
import { MessageDto } from "./dto/message.dto";

@Injectable()
export class MessagesService {

    constructor(
        @Inject('MODEL') private readonly MessageModel: Model<IMessage>,
        private readonly usersService: UsersService,
    ) {}
    
    async addMessage(message: MessageDto): Promise<IMessage> {
        try {
            const messageModel = new this.MessageModel({
                from: message.from,
                to: message.to,
                text: message.text,
            });
    
            const savedMessage: IMessage = await messageModel.save();
            if (!savedMessage) {
                console.log(`[addMessage] Message unnable to create`);
                return undefined;
            }
    
            console.log(`[addMessage] Message: ${savedMessage._id} created successfully`);
            return savedMessage;
        } catch (error) {
            console.log(`[addMessage] Error: ${JSON.stringify(error)}`);
            throw new Error(error);
        }
    }

    async findMessage(_id: string): Promise<IMessage> {
        try {
            return await this.MessageModel.findOne({ _id: _id }).populate('from').populate('to');
        } catch (error) {
            console.log(`[findMessage] Error: ${JSON.stringify(error)}`);
            return undefined;
        }
    }
    
    async findMessagesByUser(_id: string): Promise<IMessage[]> {
        try {
            return await this.MessageModel.find({ $or: [{ to: _id }, { from: _id }] }).populate('from').populate('to');
        } catch (error) {
            console.log(`[findMessageByFrom] Error: ${JSON.stringify(error)}`);
            return undefined;
        }
    }

    async findChatByUsers(fromId: string, toId: string): Promise<IMessage[]> {
        try {
            return await this.MessageModel.find({ $or: [{ from: fromId, to: toId }, { from: toId, to: fromId }] }).populate('from').populate('to');
        } catch (error) {
            console.log(`[findMessageByFrom] Error: ${JSON.stringify(error)}`);
            return undefined;
        }
    }
    
    modelToDto(message: IMessage): MessageDto {
        return {
            _id: message._id ? message._id : undefined, 
            from: this.usersService.modelToDto(message.from),
            to: this.usersService.modelToDto(message.to),
            text: message.text,
            createdAt: message.createdAt ? message.createdAt : undefined,
            updatedAt: message.updatedAt ? message.updatedAt : undefined,
        };
    }
}
