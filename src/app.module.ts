import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import path from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: path.resolve('./config/.env.dev') }),
    AuthModule,
    UserModule,
      MongooseModule.forRoot(process.env.MONGO_URL as string, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log(' MongoDB connected successfully');
        });

        connection.on('error', (err) => {
          console.error(' MongoDB connection failed:', err.message);
        });

        connection.on('disconnected', () => {
          console.warn(' MongoDB disconnected');
        });

        return connection;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
