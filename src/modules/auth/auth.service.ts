import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/interface/iuser.interface';
import { TokenDto } from './dto/token.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(user: IUser): Promise<TokenDto> {
    const payload: JwtPayload = { email: user.email };
    let token: TokenDto = undefined;

    try {
      const accessToken: string = this.jwtService.sign(payload, { 
        secret: this.configService.get('auth.secret'),
        expiresIn: this.configService.get('auth.expiresIn'),
      });

      if (accessToken) {
        const userDto: UserDto = await this.usersService.modelToDto(user);
        token = {
          accessToken: accessToken,
          user: userDto,
        };
      }
    } catch (error) {
      console.log(`[generateToken] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }
    
    return token;
  }

  async decodeTokenUser(req: Request): Promise<IUser> {
    if (!req || (req && !req.headers) || (req && req.headers && !req.headers.authorization)) {
      return undefined;
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    if(!accessToken) {
      return undefined;
    }

    let decodedToken = undefined;
    try {
      decodedToken = this.jwtService.verify(accessToken, { 
        secret: this.configService.get('auth.secret'),
      });
    } catch (error) {
      decodedToken = undefined;
    }

    if (!decodedToken) {
      return undefined;
    }

    const existUser: IUser = await this.usersService.findUserByEmail(decodedToken.email);
    if (!existUser) {
      return undefined;
    }

    return existUser;
  };

  async validateAccessToken(req: Request): Promise<boolean> {
    if (await this.decodeTokenUser(req)) {
      return true;
    }

    return false;
  };
}
