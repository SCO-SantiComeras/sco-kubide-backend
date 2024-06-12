import { Module } from '@nestjs/common';
import { MongoDbModule } from './modules/mongo-db/mongo-db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurationApp } from './configuration/configuration-app';
import { configurationMongo } from './configuration/configuration-mongo';
import { MongoDbConfig } from './modules/mongo-db/mongo-db-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        configurationApp,
        configurationMongo,
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
  ],
  providers: [

  ],
})
export class AppModule {}
