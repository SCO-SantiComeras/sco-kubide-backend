import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import { VALIDATION_ERROR_CONSTANTS } from '../../../constants/validation-error-messages.constants';

export class MessageDto {
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.ID.INVALID_VALUE })
  _id?: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.FROM.NOT_EMPTY })
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.FROM.INVALID_VALUE})
  from: UserDto;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.TO.NOT_EMPTY })
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.TO.INVALID_VALUE})
  to: UserDto;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.TEXT.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.TEXT.INVALID_VALUE })
  text: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.CREATED_AT.INVALID_VALUE })
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.MESSAGE.UPDATED_AT.INVALID_VALUE })
  updatedAt?: Date;
}
