import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoDbModule } from './modules/mongo-db/mongo-db.module';
import { configurationApp } from './configuration/configuration-app';
import { configurationMongo } from './configuration/configuration-mongo';
import { MongoDbConfig } from './modules/mongo-db/mongo-db-config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthConfig } from './modules/auth/config/auth.config';
import { configurationAuth } from './configuration/configuration-auth';
import { MessagesModule } from './modules/messages/messages.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { configurationDocker } from './configuration/configuration-docker';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        configurationApp,
        configurationMongo,
        configurationAuth,
        configurationDocker,
      ],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongoDbModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoDB: MongoDbConfig = {
          ip: configService.get('mongo.host'),
          port: configService.get('mongo.port'),
          database: configService.get('mongo.database'),
          user: configService.get('mongo.user'),
          pass: configService.get('mongo.password'),
        };
        return mongoDB;
      },
      inject: [ConfigService],
    }),
    AuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const authConfig: AuthConfig = {
          secret: configService.get('auth.secret'),
          signOptions: { 
            expiresIn: configService.get('auth.expiresIn') 
          },
        };
        return authConfig;
      },
      inject: [ConfigService],
    }),
    UsersModule,
    MessagesModule,
    NotificationsModule,
  ],
  providers: [

  ],
})
export class AppModule {}
