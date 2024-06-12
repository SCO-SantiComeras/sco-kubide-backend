import { HTTP_ERROR_CONSTANTS } from '../../constants/http-error-messages.constants';
import { Body, Controller, Get, HttpException, HttpStatus, Res, UseGuards, Post, Req, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { MessagesService } from './messages.service';
import { IMessage } from './interface/imessage.interface';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/interface/iuser.interface';
import { MessageDto } from './dto/message.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('api/v1/messages')
@ApiTags('Mensajes')
export class MessagesController {

  constructor(
    private readonly messagesService: MessagesService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('getUserMessages')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Fetch user messages`,
    description: 'Devuelve los mensajes del usuario logeado. Necesaria autorización',
  })
  @ApiResponse({
    status: 200,
    description: 'Mensajes recuperado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserMessages(@Req() req: Request, @Res() res: Response): Promise<Response<MessageDto[], Record<string, MessageDto[]>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[fetchUserData] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    /* Get All User Messages In From Or To Value */
    const userMessages: IMessage[] = await this.messagesService.findMessagesByUser(loggedUser._id);

    /* Convert User Messages To Dto Class */
    let userMessagesDto: MessageDto[] = [];
    if (userMessages && userMessages.length > 0) {
      userMessagesDto = userMessages.map(message => this.messagesService.modelToDto(message));
    }
    
    return res.status(200).json(userMessagesDto);
  }

  @Post('sendMessage')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Send message`,
    description: 'Envía un mensaje del usuario logeado a otro usuario activo. Necesaria autorización',
  })
  @ApiBody({
    description: 'Ejemplo de envio de mensaje utilizando la clase SendMessageDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          to: "user2@email.com",
          text: 'Mensaje de prueba'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mensaje enviado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible envíar el mensaje',
  })
  async sendMessage(@Req() req: Request, @Res() res: Response, @Body() message: SendMessageDto): Promise<Response<MessageDto, Record<string, MessageDto>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[sendMessage] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    /* Check If To User Value Exists */
    const existToUser: IUser = await this.usersService.findUserByEmail(message.to);
    if (!existToUser) {
      console.log(`[sendMessage] User not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    /* Check If To User State Is Active */
    if (!existToUser.active) {
      console.log(`[sendMessage] User '${existToUser.email}' state is inactive`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.MESSAGES.USER_MESSAGES_NOT_ACTIVED, HttpStatus.CONFLICT);
    }

    /* Create Message */
    const newMessage: MessageDto = {
      from: loggedUser,
      to: existToUser,
      text: message.text,
    }

    /* Send Message */
    const messageSended: IMessage = await this.messagesService.addMessage(newMessage);
    if (!messageSended) {
      console.log('[sendMessage] Unnable to send message');
      throw new HttpException(HTTP_ERROR_CONSTANTS.MESSAGES.SEND_MESSAGE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return res.status(200).json(this.messagesService.modelToDto(messageSended));
  }

  @Get('findChatByUsers/:email')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Fetch user messages`,
    description: 'Devuelve los mensajes del una conversación entre el usuario logeado y otro usuario de la aplicación. Necesaria autorización',
  })
  @ApiResponse({
    status: 200,
    description: 'Mensajes recuperado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findChatByUsers(@Req() req: Request, @Res() res: Response, @Param('email') email: string): Promise<Response<MessageDto[], Record<string, MessageDto[]>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[fetchUserData] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    /* Check If Exists To User */
    const existToUser: IUser = await this.usersService.findUserByEmail(email);
    if (!existToUser) {
      console.log(`[fetchUserData] User not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    /* Get All Messages Between Both Users */
    const userMessages: IMessage[] = await this.messagesService.findChatByUsers(loggedUser._id, existToUser._id);

    /* Convert Messages To Dto Class */
    let userMessagesDto: MessageDto[] = [];
    if (userMessages && userMessages.length > 0) {
      userMessagesDto = userMessages.map(message => this.messagesService.modelToDto(message));
    }

    return res.status(200).json(userMessagesDto);
  }
}
