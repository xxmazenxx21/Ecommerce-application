import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from 'src/DB/models/user.model';
import { otpModel } from 'src/DB/models/otp.model';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [UserModel,otpModel],
  controllers: [AuthController],
  providers: [AuthService,JwtService]
})
export class AuthModule {}
