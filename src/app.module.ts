import { Module } from '@nestjs/common';
import { MongoDbModule } from './modules/mongo-db/mongo-db.module';

@Module({
  imports: [
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
