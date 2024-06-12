import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { VALIDATION_ERROR_CONSTANTS } from 'src/constants/validation-error-messages.constants';

export class TokenDto {

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.ACCESS_TOKEN.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.ACCESS_TOKEN.INVALID_VALUE })
  accessToken: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.USER.NOT_EMPTY })
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.USER.INVALID_VALUE })
  user: UserDto;
}
