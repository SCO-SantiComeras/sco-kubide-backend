import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {

  constructor() { }

  public async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public async comparePasswords(password: string, currentPassword: string): Promise<boolean> {
    let validPassword: boolean = false;
    
    try {
      validPassword = await bcrypt.compare(password, currentPassword);
    } catch (error) {
      console.log(`[comparePasswords] Error: ${JSON.stringify(error)}`);
      throw new Error(error);
    }

    return validPassword;
  }
}
