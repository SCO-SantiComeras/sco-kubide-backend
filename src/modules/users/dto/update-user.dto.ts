import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { VALIDATION_ERROR_CONSTANTS } from '../../../constants/validation-error-messages.constants';

export class UpdateUserDto {
  
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.NAME.INVALID_VALUE })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.INVALID_VALUE })
  @MinLength(9, { message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.MATCHES }
  )
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.NEW_PASSWORD.INVALID_VALUE })
  @MinLength(9, { message: VALIDATION_ERROR_CONSTANTS.USERS.NEW_PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: VALIDATION_ERROR_CONSTANTS.USERS.NEW_PASSWORD.MATCHES }
  )
  newPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean({ message: VALIDATION_ERROR_CONSTANTS.USERS.ACTIVE.INVALID_VALUE})
  active?: boolean;
}
