import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Model } from "mongoose";
import { INotification } from "./interface/inotification.interface";
import { UsersService } from "../users/users.service";
import { MessagesService } from "../messages/messages.service";
import { NotificationDto } from "./dto/notification.dto";

@Injectable()
export class NotificationsService {

    constructor(
        @Inject('MODEL') private readonly NotificationModel: Model<INotification>,
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => MessagesService)) private readonly messagesService: MessagesService,
    ) {}

    async addNotification(notification: NotificationDto): Promise<INotification> {
        try {
            const notificationModel = new this.NotificationModel({
               user: notification.user,
               message: notification.message,
               opened: false,
            });
    
            const savedNotification: INotification = await notificationModel.save();
            if (!savedNotification) {
                console.log(`[addNotification] Notification unnable to create`);
                return undefined;
            }
    
            console.log(`[addNotification] Notification: ${savedNotification._id} created successfully`);
            return savedNotification;
        } catch (error) {
            console.log(`[addNotification] Error: ${JSON.stringify(error)}`);
            throw new Error(error);
        }
    }

    async findNotification(_id: string): Promise<INotification> {
        try {
            return await this.NotificationModel.findOne({ _id: _id }).populate('user').populate({
                path: 'message',
                populate: [
                    {
                        path: 'from',
                        model: 'User',
                    },
                    {
                        path: 'to',
                        model: 'User',
                    }
                ],
            });
        } catch (error) {
            console.log(`[findNotification] Error: ${JSON.stringify(error)}`);
            return undefined;
        }
    }
    
    async findNotificationsByUser(_id: string): Promise<INotification[]> {
        try {
            return await this.NotificationModel.find({ user: _id, opened: false }).populate('user').populate({
                path: 'message',
                populate: [
                    {
                        path: 'from',
                        model: 'User',
                    },
                    {
                        path: 'to',
                        model: 'User',
                    }
                ],
            });
        } catch (error) {
            console.log(`[findNotificationsByUser] Error: ${JSON.stringify(error)}`);
            return undefined;
        }
    }

    async setNotificationOpen(_id: string): Promise<INotification> {
        try {
            const result = await this.NotificationModel.updateOne(
                {
                    _id: _id,
                },
                { 
                    $set: {
                        opened: true,
                    }
                }
            );
        
            if (!result || (result && result.matchedCount != 1)) {
                console.log(`[setNotificationOpen] Notification: ${_id} unnable to set opened`);
                return undefined;
            }
    
            console.log(`[setNotificationOpen] Notification: ${_id} set opened successfully`);
            return await this.findNotification(_id);
        } catch (error) {
            console.log(`[setNotificationOpen] Error: ${JSON.stringify(error)}`);
            throw new Error(error);
        }
    }

    modelToDto(notification: INotification): NotificationDto {
        return {
            _id: notification._id ? notification._id : undefined, 
            user: this.usersService.modelToDto(notification.user),
            message: this.messagesService.modelToDto(notification.message),
            createdAt: notification.createdAt ? notification.createdAt : undefined,
            updatedAt: notification.updatedAt ? notification.updatedAt : undefined,
        };
    }
}
