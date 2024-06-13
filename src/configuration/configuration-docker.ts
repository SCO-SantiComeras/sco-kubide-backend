import { registerAs } from '@nestjs/config';

export const configurationDocker = registerAs('docker', () => ({
  enabled: process.env.ENABLED_DOCKER == 'true',
  dbService: process.env.DB_SERVICE_DOCKER,
}));
