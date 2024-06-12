import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { VALIDATION_ERROR_CONSTANTS } from '../../../constants/validation-error-messages.constants';

export class LoginDto {
  
  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.INVALID_VALUE })
  @Matches(
    /.+@.+\..+/,
    { message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.MATCHES }
  )
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.LOGIN.PASSWORD.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.LOGIN.PASSWORD.INVALID_VALUE })
  @MinLength(9, { message: VALIDATION_ERROR_CONSTANTS.LOGIN.PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: VALIDATION_ERROR_CONSTANTS.LOGIN.PASSWORD.MATCHES }
  )
  password: string;
}
