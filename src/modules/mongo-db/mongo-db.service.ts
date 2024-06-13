import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { MongoDbConfig } from './mongo-db-config';

@Injectable()
export class MongoDbService {

  private _dbConnection: mongoose.Connection;

  constructor(
    @Inject('CONFIG_OPTIONS') private options: MongoDbConfig,
    private readonly configService: ConfigService,
  ) {
    if (!this.options) {
      console.error('[MongoDbService] Unnable to get options for init connection');
      throw new Error('MongoDB Unnable to get options for init connection');
    }

    this.createConnectionDB(this.options);
  }

  async createConnectionDB(options: MongoDbConfig) {
    const dbHostName: string = !this.configService.get('docker.enabled') 
      ? options.ip 
      : this.configService.get('docker.dbService');

    let url = `mongodb://${dbHostName}:${options.port}/${options.database}`;
    if (options.user && options.pass) {
      url = `mongodb://${options.user}:${options.pass}@${dbHostName}:${options.port}/${options.database}?authSource=admin`;
    }

    this._dbConnection = mongoose.createConnection(url, {
      autoCreate: false,
      autoIndex: false,
    });

    this._dbConnection.once('open', () => {
      console.log(`[createConnectionDB] Connected to ${options.database} successfully`);
    });

    this._dbConnection.on('error', () => {
      console.error(`[createConnectionDB] Error connecting to ${options.database}`);
    });
  }

  getConnection(): mongoose.Connection {
    return this._dbConnection;
  }
}
