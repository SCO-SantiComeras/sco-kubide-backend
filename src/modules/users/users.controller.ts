import { HTTP_ERROR_CONSTANTS } from '../../constants/http-error-messages.constants';
import { Body, Controller, Get, HttpException, HttpStatus, Res, UseGuards, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { IUser } from './interface/iuser.interface';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
import { BcryptService } from '../shared/bcrypt/bcrypt.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('api/v1/users')
@ApiTags('Usuarios')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly authService: AuthService,
  ) {}

  @Get('getUserData')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Fetch user data`,
    description: 'Devuelve los datos del usuario logeado. Necesaria autorización',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario recuperado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async fetchUserData(@Req() req: Request, @Res() res: Response): Promise<Response<UserDto, Record<string, UserDto>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[fetchUserData] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    /* Hide Password */
    loggedUser.password = undefined;

    return res.status(200).json(loggedUser);
  }

  @Post('updateUserData')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Update user data`,
    description: 'Actualiza los datos del usuario logeado. Necesaria autorización',
  })
  @ApiBody({
    description: 'Ejemplo de actualización de usuario utilizando la clase UpdateUserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          email: 'update@email.com',
          name: 'Usuario de actualización',
          password: 'Update123456!',
          newPassword: 'Update123456!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email de usuario ya existente',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible actualizar el usuario',
  })
  async updateUserData(@Req() req: Request, @Res() res: Response, @Body() user: UpdateUserDto): Promise<Response<UserDto, Record<string, UserDto>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[updateUser] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    /* Check if New User Data Email Is Not Equal To Logged User Email */
    if (user.email != loggedUser.email) {
      const existNewEmail: IUser = await this.usersService.findUserByEmail(user.email);
      if (existNewEmail) {
        console.log('[updateUser] Email already registered');
        throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.EMAIL_ALREADY_EXIST, HttpStatus.CONFLICT);
      }
    }

    /* Check If New Password Is Reported */
    let updatePassword: boolean = false;
    if (user.password && user.newPassword) {
      const encryptedNewPassword: string = await this.bcryptService.encryptPassword(user.newPassword);
      if (encryptedNewPassword) {
        user.password = encryptedNewPassword;
        updatePassword = true;
      }
    }

    const updatedUser: IUser = await this.usersService.updateUser(loggedUser._id, user, updatePassword);
    if (!updatedUser) {
      console.log('[updateUser] Unnable to update user');
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.UPDATE_USER_ERROR, HttpStatus.CONFLICT);
    }

    return res.status(200).json(this.usersService.modelToDto(updatedUser));
  }

  @Get('changeUserActiveState')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Change user active state`,
    description: 'Cambia el estado activo/desactivo del usuario logeado. Necesaria autorización',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del usuario actualizado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible actualizar el usuario',
  })
  async changeUserActiveState(@Req() req: Request, @Res() res: Response): Promise<Response<UserDto, Record<string, UserDto>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[changeUserActiveState] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    /* Get Logged User Next Active State */
    const nextActiveState: boolean = !loggedUser.active;

    const updatedUser: IUser = await this.usersService.changeUserActiveState(loggedUser._id, nextActiveState);
    if (!updatedUser) {
      console.log('[changeUserActiveState] Unnable to update user');
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.UPDATE_USER_ERROR, HttpStatus.CONFLICT);
    }

    return res.status(200).json(this.usersService.modelToDto(updatedUser));
  }

  @Get('getActiveUsers')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: `Fetch active users`,
    description: 'Devuelve usuarios con estado activo. Necesaria autorización',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios recuperados correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getActiveUsers(@Req() req: Request, @Res() res: Response): Promise<Response<UserDto[], Record<string, UserDto[]>>> {
    const loggedUser: UserDto = this.usersService.modelToDto(await this.authService.decodeTokenUser(req));
    if (!loggedUser) {
      console.log('[fetchUserData] User token unauthorized');
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    /* Get All Active Users On Application */
    const filter = { active: true };
    const activedUsers: IUser[] = await this.usersService.fetchUsers(filter);

    /* Remove Current Logged User From Active Users List */
    const indexOf: number = activedUsers.indexOf(activedUsers.find(u => u.email == loggedUser.email));
    if (indexOf != -1) {
      activedUsers.splice(indexOf, 1);
    }

    /* Convert Models to Dto Classes */
    let activedUsersDto: UserDto[] = [];
    if (activedUsers && activedUsers.length > 0) {
      activedUsersDto = activedUsers.map(user => this.usersService.modelToDto(user));
    }

    return res.status(200).json(activedUsersDto);
  }
}
