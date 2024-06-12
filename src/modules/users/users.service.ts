import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IUser } from './interface/iuser.interface';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    
    constructor(@Inject('MODEL') private readonly UserModel: Model<IUser>) {}

    async fetchUsers(where?: any): Promise<IUser[]> {
        try {
            return await this.UserModel.find(where, { password: 0 });
        } catch (error) {
            console.log(`[fetchUsers] Error: ${JSON.stringify(error)}`);
            return [];
        }
    }

    async addUser(user: UserDto): Promise<IUser> {
        try {
            const userModel = new this.UserModel({
                email: user.email,
                name: user.name,
                password: user.password,
                active: user.active != undefined ? user.active : false,
            });

            const savedUser: IUser = await userModel.save();
            if (!savedUser) {
                console.log(`[addUser] User: ${savedUser.email} unnable to create`);
                return undefined;
            }

            console.log(`[addUser] User: ${savedUser.email} created successfully`);
            savedUser.password = undefined;
            return savedUser;
        } catch (error) {
            console.log(`[addUser] Error: ${JSON.stringify(error)}`);
            throw new Error(error);
        }
    }

    async updateUser(_id: string, user: UpdateUserDto, updatePassword: boolean = false): Promise<IUser> {
        const dataSet: UpdateUserDto = {
            email: user.email,
            name: user.name,
        }

        if (updatePassword) dataSet.password = user.password;

        try {
            const result = await this.UserModel.updateOne(
                {
                    _id: _id,
                },
                { 
                    $set: dataSet
                }
            );

            if (!result || (result && result.matchedCount != 1)) {
                console.log(`[updateUser] User: ${_id} unnable to update`);
                return undefined;
            }

            console.log(`[updateUser] User: ${_id} updated successfully`);
            return await this.findUser(_id);
        } catch (error) {
            console.log(`[updateUser] Error: ${JSON.stringify(error)}`);
            throw new Error(error);
        }
    }

    async changeUserActiveState(_id: string, active: boolean) {
        try {
            const result = await this.UserModel.updateOne(
                {
                    _id: _id,
                },
                { 
                    $set: { active: active }
                }
            );

            if (!result || (result && result.matchedCount != 1)) {
                console.log(`[setUserActiveState] User: ${_id} unnable to update active state`);
                return undefined;
            }

            console.log(`[setUserActiveState] User: ${_id} active state updated successfully`);
            return await this.findUser(_id);
        } catch (error) {
            console.log(`[setUserActiveState] Error: ${JSON.stringify(error)}`);
            throw new Error(error);
        }
    }

    async findUser(_id: string): Promise<IUser> {
        try {
            return await this.UserModel.findOne({ _id: _id });
        } catch (error) {
            console.log(`[findUser] Error: ${JSON.stringify(error)}`);
            return undefined;
        }
    }

    async findUserByEmail(email: string): Promise<IUser> {
        try {
            return await this.UserModel.findOne({ email: email });
        } catch (error) {
            console.log(`[findUserByEmail] Error: ${JSON.stringify(error)}`);
            return undefined;
        }
    }

    modelToDto(user: IUser): UserDto {
        return {
            _id: user._id ? user._id : undefined, 
            email: user.email,
            name: user.name,
            password: user.password ? user.password : undefined,
            active: user.active,
            createdAt: user.createdAt ? user.createdAt : undefined,
            updatedAt: user.updatedAt ? user.updatedAt : undefined,
        };
    }
}
