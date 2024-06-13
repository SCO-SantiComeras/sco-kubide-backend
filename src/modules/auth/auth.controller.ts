import { HTTP_ERROR_CONSTANTS } from '../../constants/http-error-messages.constants';
import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { TokenDto } from './dto/token.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/interface/iuser.interface';
import { Response } from 'express';
import { BcryptService } from '../shared/bcrypt/bcrypt.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('api/v1/auth')
@ApiTags('Autentificación')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: `Login`,
    description: 'Iniciar sesión en la aplicación',
  })
  @ApiBody({
    description: 'Ejemplo de inicio de sesión utilizando la clase LoginDto',
    type: LoginDto,
    examples: {
      a: {
        value: {
          email: 'user1@email.com',
          password: 'User123456!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión iniciada correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible generar token de credenciales del usuario',
  })
  async login(@Res() res: Response, @Body() login: LoginDto): Promise<Response<TokenDto, Record<string, TokenDto>>> {
    const existUser: IUser = await this.usersService.findUserByEmail(login.email);
    if (!existUser) {
      console.log(`[login] User '${login.email}' not found`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const credentialsOK: boolean = await this.bcryptService.comparePasswords(login.password, existUser.password);
    if (!credentialsOK) {
      console.log(`[login] Invalid credentials`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const token: TokenDto = await this.authService.generateToken(existUser);
    if (!token) {
      console.log(`[login] Unnable to generate user token`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNNABLE_USER_TOKEN, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return res.status(200).json(token);
  }

  @Post('register')
  @ApiOperation({
    summary: `Register`,
    description: 'Registrar un usuario en la aplicación',
  })
  @ApiBody({
    description: 'Ejemplo de registro de usuario utilizando la clase UserDto',
    type: UserDto,
    examples: {
      a: {
        value: {
          email: 'user1@email.com',
          name: 'Usuario 1',
          password: 'User123456!'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario registrado correctamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Email de usuario ya existente',
  })
  @ApiResponse({
    status: 500,
    description: 'Imposible registrar el usuario',
  })
  async register(@Res() res: Response, @Body() user: UserDto): Promise<Response<UserDto, Record<string, UserDto>>> {
    const existUser: IUser = await this.usersService.findUserByEmail(user.email);
    if (existUser) {
      console.log(`[register] User '${user.email}' already exist`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.USER_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    /* Default New Users Active State Is False */
    user.active = false;

    const createdUser: IUser = await this.usersService.addUser(user);
    if (!createdUser) {
      console.log(`[register] User '${user.email}' unnable to create`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.USERS.CREATE_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    console.log(`[register] User '${user.email}' created successfully`);
    return res.status(200).json(this.usersService.modelToDto(createdUser));
  }
}
