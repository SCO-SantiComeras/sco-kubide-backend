import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { ControllerService } from './controller/controller.service';

@Module({
  providers: [
    BcryptService,
    ControllerService,
  ],
  exports: [
    BcryptService,
    ControllerService,
  ],
})
export class SharedModule {}
