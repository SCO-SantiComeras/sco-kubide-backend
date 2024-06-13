import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { VALIDATION_ERROR_CONSTANTS } from '../../../constants/validation-error-messages.constants';

export class SendMessageDto {

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.SEND_MESSAGE.TO.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.SEND_MESSAGE.TO.INVALID_VALUE })
  @Matches(
    /.+@.+\..+/,
    { message: VALIDATION_ERROR_CONSTANTS.SEND_MESSAGE.TO.MATCHES }
  )
  to: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.SEND_MESSAGE.TEXT.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.SEND_MESSAGE.TEXT.INVALID_VALUE })
  text: string;
}
