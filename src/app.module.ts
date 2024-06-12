import { Module } from '@nestjs/common';
import { MongoDbModule } from './modules/mongo-db/mongo-db.module';
import { ConfigModule } from '@nestjs/config';
import { configurationApp } from './configuration/configuration-app';
import { configurationMongo } from './configuration/configuration-mongo';

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
    MongoDbModule.register({
      ip: '127.0.0.1',
      port: 27017,
      database: 'sco-kubide-backend',
    })
  ],
  providers: [

  ],
})
export class AppModule {}
