import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser } from '../../users/interface/iuser.interface';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { HTTP_ERROR_CONSTANTS } from '../../../constants/http-error-messages.constants';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<IUser> {
    const user = await this.usersService.findUserByEmail(payload.email);
    if (!user) {
      console.log(`[Jwt Strategy Validate] User '${payload.email} is not authorized`);
      throw new HttpException(HTTP_ERROR_CONSTANTS.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
