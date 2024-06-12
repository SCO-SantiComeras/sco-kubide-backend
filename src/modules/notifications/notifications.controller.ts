import { Controller, Get, HttpException, HttpStatus, Param, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { AuthService } from "../auth/auth.service";
import { AuthGuard } from "@nestjs/passport";
import { INotification } from "./interface/inotification.interface";
import { Response, Request } from "express";
import { UsersService } from "../users/users.service";
import { UserDto } from "../users/dto/user.dto";
import { HTTP_ERROR_CONSTANTS } from "src/constants/http-error-messages.constants";
import { NotificationDto } from "./dto/notification.dto";

@Controller('api/v1/notifications')
@ApiTags('Notificaciones')
export class NotificationsController {

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('getUsersNotifications')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Fetch user notifications`,
    description: 'Devuelve las notificaciones de nuevos mensajes del usuario logeado. Necesaria autorización',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones recuperadas correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUsersNotifications(
    @Req() req: Request, 
    @Res() res: Response,
  ): Promise<Response<NotificationDto[], Record<string, NotificationDto[]>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[getUsersNotifications] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const userNotifications: INotification[] = await this.notificationsService.findNotificationsByUser(loggedUser._id);

    /* Convert Notifications To Dto Class */
    let usersNotificationsDto: NotificationDto[] = [];
    if (userNotifications && userNotifications.length > 0) {
      usersNotificationsDto = userNotifications.map(notification => this.notificationsService.modelToDto(notification));
    }

    return res.status(200).json(usersNotificationsDto);
  }

  @Get('openUserNotification/:_id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Open user notification`,
    description: 'Abre una notificación del usuario logeado. Necesaria autorización',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación abierta correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async openUserNotification(
    @Req() req: Request, 
    @Res() res: Response, 
    @Param('_id') _id: string,
  ): Promise<Response<NotificationDto, Record<string, NotificationDto>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[openUserNotification] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const existNotification: INotification = await this.notificationsService.findNotification(_id);
    if (!existNotification) {
      console.log(`[openUserNotification] Notification not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.NOTIFICATIONS.NOTIFICATION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const notificationOpened: INotification = await this.notificationsService.setNotificationOpen(existNotification._id);
    if (!notificationOpened) {
      console.log(`[openUserNotification] Unnable to set opened notification`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.NOTIFICATIONS.OPEN_NOTIFICATION_ERROR, HttpStatus.NOT_FOUND);
    }

    return res.status(200).json(this.notificationsService.modelToDto(notificationOpened));
  }
}
