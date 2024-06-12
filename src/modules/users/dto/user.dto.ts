import { VALIDATION_ERROR_CONSTANTS } from '../../../constants/validation-error-messages.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.ID.INVALID_VALUE })
  _id?: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.INVALID_VALUE })
  @Matches(
    /.+@.+\..+/,
    { message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.MATCHES }
  )
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.USERS.NAME.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.NAME.INVALID_VALUE })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.INVALID_VALUE })
  @MinLength(9, { message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.MATCHES }
  )
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: VALIDATION_ERROR_CONSTANTS.USERS.ACTIVE.INVALID_VALUE})
  active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.USERS.CREATED_AT.INVALID_VALUE })
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.USERS.UPDATED_AT.INVALID_VALUE })
  updatedAt?: Date;
}
