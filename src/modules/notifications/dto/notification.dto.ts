import { VALIDATION_ERROR_CONSTANTS } from '../../../constants/validation-error-messages.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { MessageDto } from 'src/modules/messages/dto/message.dto';

export class NotificationDto {
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.NOTIFICATION.ID.INVALID_VALUE })
  _id?: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.NOTIFICATION.USER.NOT_EMPTY })
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.NOTIFICATION.USER.INVALID_VALUE})
  user: UserDto;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.NOTIFICATION.MESSAGE.NOT_EMPTY })
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.NOTIFICATION.MESSAGE.INVALID_VALUE})
  message: MessageDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.NOTIFICATION.OPENED.INVALID_VALUE})
  opened?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.NOTIFICATION.CREATED_AT.INVALID_VALUE })
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.NOTIFICATION.UPDATED_AT.INVALID_VALUE })
  updatedAt?: Date;
}
